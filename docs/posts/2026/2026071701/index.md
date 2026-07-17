---
title: 用 MCP 协议让大模型真正「接管」你的服务器——DevOps MCP 运维平台开发实录
date: 2026-07-17
tags: [MCP, Devops]
description: 记录 DevOps MCP 运维平台开发过程
---

# 用 MCP 协议让大模型真正「接管」你的服务器——DevOps MCP 运维平台开发实录

## 从一个痛点出发

我在维护几个自部署项目时，经常要做这样一套操作：SSH 连上服务器 → `cd` 到项目目录 → `git pull` → `docker compose up -d` → 检查日志看有没有报错。

这套流程本身不复杂，但很烦。更烦的是，当我在用 Claude 或 Cursor 分析问题时，AI 能帮我想清楚该执行什么命令，却没有办法帮我真正执行——我还是得自己开终端，手敲一遍。

这就是我做 **DevOps MCP** 的起点：让大模型不只是「告诉你怎么做」，而是直接「帮你做」。

---

## 什么是 MCP？为什么选它？

MCP（Model Context Protocol）是 Anthropic 提出的开放协议，允许 LLM 通过标准化的工具接口与外部系统交互。简单来说，它就是给大模型装上「手」的规范。

支持 MCP 的客户端（Claude Desktop、Cursor、Windsurf 等）可以发现并调用 MCP Server 暴露的工具，整个过程对 LLM 透明——它知道有哪些工具可以用，知道每个工具的参数和返回格式，能自主决策什么时候调用。

选 MCP 而不是自己封装 API，有几个原因：

- **生态兼容**：任何支持 MCP 的 AI 工具都能直接接入，不需要为每个客户端单独开发集成
- **协议标准化**：工具描述、参数校验、错误处理都有规范，LLM 调用时出错率更低
- **解耦**：MCP Server 只负责执行能力，「大脑」（用哪个模型、怎么编排）完全由调用方决定

---

## 项目定位：不是又一个运维面板

在设计之初，我刻意区分了两种产品形态：

**传统运维面板**：面向人工操作，Web 界面是主入口，AI 是辅助。

**DevOps MCP**：面向 AI 调用，MCP 接口是核心，Web 界面是管理工具。

这个区分很重要。Web 管理界面的作用是让用户配置「项目有哪些命令、参数是什么、权限怎么控制」，而实际的运维操作由 LLM 通过 MCP 接口发起。人工界面和 AI 接口各司其职。

---

## 核心设计：以「项目」为中心

系统的核心实体是**项目（Project）**，每个项目对应服务器上的一个实际工程，包含：

- `work_dir`：工作目录
- `commands`：该项目支持的运维命令集合

命令是最关键的配置单元：

```json
{
  "action_type": "deploy",
  "shell_command": "git pull origin ${branch} && docker compose up -d --build",
  "default_params": { "branch": "main" },
  "timeout": 300,
  "work_dir": null,
  "is_health_check": false,
  "requires_confirm": false
}
```

LLM 调用 `execute_action("my-project", "deploy", {"branch": "v1.2.0"})` 时，系统会将参数替换到脚本中，通过 SSH 在对应目录执行。

---

## MCP 工具集设计

整个工具集围绕「LLM 做运维决策需要什么信息、能执行什么操作」来设计：

| 工具 | 作用 |
|------|------|
| `get_node_overview` | 获取所有项目列表及健康状态，LLM 的「第一眼」 |
| `execute_action` | 提交运维操作，异步执行返回 task_id |
| `get_task_status` | 查询任务状态和增量日志 |
| `cancel_task_action` | 取消运行中的任务 |
| `inspect_script_content` | 查看命令的实际脚本内容 |
| `get_system_metrics` | 获取 CPU、内存、磁盘使用情况 |
| `query_audit_logs` | 查询历史操作记录 |

工具集的设计目标是让 LLM 用尽量少的 tool call 轮次完成诊断和操作。`get_node_overview` 一次返回所有项目的健康状态，LLM 不需要逐个检查就能定位异常服务。

### 典型的 LLM 运维流程

```
用户：帮我检查一下服务器状态，有问题就重启

LLM：调用 get_node_overview()
     → { "api-server": "unhealthy", "nginx": "healthy", "worker": "healthy" }

LLM：调用 execute_action("api-server", "restart")
     → { "task_id": "abc-123", "status": "pending" }

LLM：等待 3 秒后调用 get_task_status("abc-123", log_offset=0)
     → { "status": "success", "new_log": "Container restarted successfully" }

LLM：回复用户「api-server 已成功重启，其他服务正常」
```

整个过程用户只说了一句话。

---

## 几个关键的工程决策

### 1. 异步任务执行

最初版本是同步阻塞的：执行命令 → 等待完成 → 返回结果。这在 `deploy` 这类耗时几分钟的命令上会导致 MCP 调用超时。

改造思路：`execute_action` 立即返回 `task_id`，命令在后台异步执行，LLM 通过 `get_task_status` 轮询结果。

同时引入**增量日志**机制，`get_task_status` 支持 `log_offset` 参数，每次只返回上次读取位置之后的新增内容，避免 LLM 频繁轮询时重复传输大量日志造成 token 浪费：

```python
# LLM 调用方式
result = get_task_status(task_id, log_offset=0)    # 首次，返回 next_offset=500
result = get_task_status(task_id, log_offset=500)  # 第二次，只返回新增部分
```

### 2. 高危命令确认机制

运维操作中，`stop`、`delete` 这类命令一旦误触发代价很高。给这类命令加了 `requires_confirm` 标记，LLM 调用时如果没有传入 `confirm=true`，会收到这样的响应：

```json
{
  "status": "requires_confirm",
  "message": "⚠️ 该操作（stop）被标记为高危命令，需要确认后才能执行。",
  "hint": "如确认执行，请在下一次调用时传入 confirm=true"
}
```

LLM 会自然地转向用户确认，用户明确同意后才会在下一次调用中传入 `confirm=true`。这个机制不依赖任何特定的前端交互，对所有 MCP 客户端都有效。

工具 docstring 里也加了明确的约束：

> 严禁在未经用户确认的情况下自行将 confirm 设为 true。

### 3. 命令级工作目录

像 Dify 这样的开源项目，`docker compose` 文件在 `docker/` 子目录，而 `git pull` 需要在根目录执行。给命令表加了可选的 `work_dir` 字段，命令级工作目录优先于项目级工作目录：

```
project.work_dir = /opt/dify
command("deploy").work_dir = /opt/dify/docker   # 覆盖项目目录
command("update").work_dir = null               # 继承项目目录
```

### 4. 自动化规则

除了 LLM 触发，系统还支持两种自动触发方式：

- **定时触发**：基于 cron 表达式，前端提供可视化选择器，不需要用户手写 cron
- **条件触发**：定期执行检查脚本，exit code 为 0 时自动触发指定命令

条件触发的典型用例是「代码有更新就自动部署」：

```bash
# 条件检查脚本（每5分钟执行一次）
git fetch origin
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && exit 1 || exit 0
```

exit code 为 0（有更新）时，自动触发 `deploy` 命令。

---

## 安全设计

在一个可以执行任意 shell 命令的系统里，安全是第一优先级：

**专用运维用户**：所有命令通过 `devops` 用户执行，配合 sudo 白名单（只允许 docker、git 等特定命令），即使 API Key 泄露也无法执行高权限操作。

**API Key 项目级权限**：每个 API Key 可以配置允许访问的项目列表，一个 Key 只能操作被授权的项目。

**路径安全检查**：读取文件时防止目录遍历攻击（如 `../../etc/passwd`）。

**操作审计**：所有操作（包括 AI 触发和人工触发）都写入审计日志，区分 `actor_type: human/ai`。

---

## 技术架构

```
┌──────────────────────────────────────────────┐
│           Nginx Gateway (:10096)             │
└──────────────┬───────────────────────────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
Next.js (:3000)    FastAPI (:8000)
  管理界面           MCP + REST API
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           SQLite    APScheduler   SSH
           数据库     定时调度      远程执行
```

后端主要依赖：FastAPI + SQLAlchemy + FastMCP + APScheduler + paramiko

前端：Next.js + MUI + React Query + xterm.js（Web 终端）

---

## 接入方式

项目基于 Docker Compose 部署，配置好 SSH 密钥后，在任何支持 MCP 的 AI 工具中填入端点地址即可接入：

```
MCP 端点：http://your-server:10096/api/mcp
API Key：在管理界面生成
```

以 Claude Desktop 为例，配置后可以直接用自然语言管理服务器：

> 「帮我把 dify 项目更新到 XX 版本」

LLM 会自主调用 `execute_action` → `get_task_status` 全程不需要人工干预。

---

## 项目地址

GitHub：[https://github.com/niechao136/dev-ops-mcp](https://github.com/niechao136/dev-ops-mcp)

如果你也在维护自部署服务，欢迎试用，有问题欢迎提 Issue。