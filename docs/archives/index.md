---
title: 归档
---

<script setup>
const posts = {
  "2025": [
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
      "link": "/posts/2025/vue3-composition-api"
    }
  ]
}
</script>

# 🗂️ 文章归档


## 2025
<PostCard
  v-for="post in posts['2025']"
  :key="post.link"
  v-bind="post"
/>
