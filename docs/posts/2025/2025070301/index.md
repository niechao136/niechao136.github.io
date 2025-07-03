---
title: 在 Ubuntu 上部署 Dify 平台
date: 2025-07-03
tags: [Ubuntu, Dify]
description: 记录在 Ubuntu 上部署 Dify 平台的过程
---

# 在 Ubuntu 上部署 Dify 平台

Dify 是一个开源的 LLM 应用开发平台，推荐使用 Docker 方式部署。

## 安装基础依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y
# 安装 docker 和 docker-compose
sudo apt install -y git curl docker.io docker-compose
# 检查 docker
docker --version
# 检查 docker-compose
docker-compose --version
```

## 部署 Dify

```bash
# 新建文件夹
sudo mkdir -p /opt/dify
# 赋予当前用户权限
sudo chown -R $USER:$USER /opt/dify
# 进入文件夹
cd /opt/dify
# 克隆仓库
git clone https://github.com/langgenius/dify.git
# 进入 docker 文件夹
cd dify/docker
# 创建环境文件
cp .env.example .env
# 修改配置 (可选)
vi .env
# 启动 Dify
docker-compose up -d
```

如果克隆仓库超时，可以尝试以下操作：

```bash
# 增加 Git 缓冲区大小，设置为 500MB
git config --global http.postBuffer 524288000 
# 启用 HTTP 长连接
git config --global http.version HTTP/1.1
```

如果启动 Dify 时，出现拉取镜像超时的问题，可以尝试以下操作：

```bash
# 创建 Docker 配置文件
sudo mkdir -p /etc/docker
sudo vi /etc/docker/daemon.json
```
添加以下内容（配置镜像仓库）：
```json
{
  "registry-mirrors": [
    "https://2a6bf1988cb6428c877f723ec7530dbc.mirror.swr.myhuaweicloud.com",
    "https://docker.m.daocloud.io",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://your_preferred_mirror",
    "https://dockerhub.icu",
    "https://docker.registry.cyou",
    "https://docker-cf.registry.cyou",
    "https://dockercf.jsdelivr.fyi",
    "https://docker.jsdelivr.fyi",
    "https://dockertest.jsdelivr.fyi",
    "https://mirror.aliyuncs.com",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.iscas.ac.cn",
    "https://docker.rainbond.cc",
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ],
  "max-concurrent-downloads": 10,
  "max-download-attempts": 5,
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65536,
      "Soft": 65536
    }
  }
}
```
保存后重启 Docker：
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 验证安装

```bash
# 检查容器状态
docker-compose ps
# 查看日志
docker-compose logs -f web
```

## 访问 Dify

1. 通过浏览器访问
    - 使用服务器 IP：http://<你的服务器IP>
    - 或配置的域名：https://<你的域名>
2. 初始设置
    - 首次访问会进入设置页面
    - 创建管理员账户
    - 配置 LLM 提供商（OpenAI/Azure/本地模型等）
