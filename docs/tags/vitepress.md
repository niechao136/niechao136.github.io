---
title: 标签 - vitepress
---

<script setup>
const posts = [
  {
    "title": "你好，VitePress！",
    "date": "2025-05-27",
    "description": "从零开始搭建一个 VitePress 博客",
    "tags": [
      "vitepress",
      "博客"
    ],
    "link": "/posts/2025/hello-vitepress"
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
    "link": "/posts/2025/vite-deploy-github-pages"
  }
]
</script>

# 🏷️ 标签：vitepress


<PostCard
  v-for="post in posts"
  :key="post.link"
  v-bind="post"
/>