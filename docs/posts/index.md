---
title: 所有文章
---

<script setup>
const posts = [
  {
    "title": "MCP 学习笔记",
    "date": "2025-07-21",
    "description": "记录 MCP 的学习笔记",
    "tags": [
      "Dify",
      "MCP"
    ],
    "series": "",
    "link": "/posts/2025/2025072101/"
  },
  {
    "title": "Dify 平台配置 https",
    "date": "2025-07-04",
    "description": "记录如何配置 Dify 平台的 https",
    "tags": [
      "Dify",
      "https"
    ],
    "series": "",
    "link": "/posts/2025/2025070401/"
  },
  {
    "title": "在 Ubuntu 上部署 Dify 平台",
    "date": "2025-07-03",
    "description": "记录在 Ubuntu 上部署 Dify 平台的过程",
    "tags": [
      "Ubuntu",
      "Dify"
    ],
    "series": "",
    "link": "/posts/2025/2025070301/"
  },
  {
    "title": "你好，VitePress！",
    "date": "2025-05-27",
    "description": "从零开始搭建一个 VitePress 博客",
    "tags": [
      "vitepress",
      "博客"
    ],
    "series": "",
    "link": "/posts/2025/2025052701/"
  },
  {
    "title": "如何将 VitePress 项目部署到 GitHub Pages",
    "date": "2025-05-27",
    "description": "手把手教你如何使用 GitHub Pages 免费托管 VitePress 静态站点",
    "tags": [
      "vitepress",
      "部署",
      "github-pages"
    ],
    "series": "",
    "link": "/posts/2025/2025052702/"
  },
  {
    "title": "使用 Vue 3 Composition API 的实践",
    "date": "2025-05-27",
    "description": "初学者如何理解并应用 Vue 3 Composition API 的基本用法和优势",
    "tags": [
      "vue3",
      "composition-api",
      "前端"
    ],
    "series": "",
    "link": "/posts/2025/2025052703/"
  }
]
</script>

# 📚 所有文章


<PostCard
  v-for="post in posts"
  :key="post.link"
  v-bind="post"
/>