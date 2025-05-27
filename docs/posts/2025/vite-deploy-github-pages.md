---
title: 如何将 VitePress 项目部署到 GitHub Pages
date: 2025-05-27
tags: [vitepress, 部署, github-pages]
description: 手把手教你如何使用 GitHub Pages 免费托管 VitePress 静态站点
---

# 如何将 VitePress 项目部署到 GitHub Pages

VitePress 是一个基于 Vite 构建的静态站点生成器，非常适合构建文档和博客。

本篇文章将介绍如何从零部署一个 VitePress 项目到 GitHub Pages。

---

## 第一步：项目结构准备

假设你的项目结构如下：

````

my-blog/
├── docs/
│   └── index.md
├── .vitepress/
│   └── config.ts
├── package.json

````

---

## 第二步：安装 gh-pages

```bash
npm install gh-pages --save-dev
````

---

## 第三步：配置构建与部署脚本

在 `package.json` 中添加以下命令：

```json
{
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "deploy": "gh-pages -d docs/.vitepress/dist"
  }
}
```

---

## 第四步：设置基础路径

如果你的仓库名为 `my-blog`，你需要在 `config.ts` 中设置 `base`：

```ts
export default {
  base: '/my-blog/'
}
```

否则你的网站资源路径会出错。

---

## 第五步：部署到 GitHub Pages

执行以下命令：

```bash
npm run build
npm run deploy
```

`gh-pages` 会自动将构建后的 `dist` 文件夹发布到 `gh-pages` 分支。

---

## 第六步：启用 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 点击 Settings > Pages
3. 选择分支为 `gh-pages`，文件夹为 `/（root）`
4. 保存后会生成一个 URL，例如：

```
https://yourusername.github.io/my-blog/
```

---

## 常见问题

### ❓ 页面资源 404？

检查你的 `config.ts` 中的 `base` 是否以 `/仓库名/` 格式设置。

---

## 总结

通过 GitHub Pages，我们可以免费、稳定地托管一个 VitePress 网站。结合 Markdown 写作 + Git 管理，非常适合博客、文档或个人主页用途。
