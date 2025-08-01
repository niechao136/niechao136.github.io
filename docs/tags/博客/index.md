---
title: 标签 - 博客
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
    "series": "",
    "link": "/posts/2025/2025052701/"
  }
]
</script>

# 🏷️ 标签：博客


<PostCard
  v-for="post in posts"
  :key="post.link"
  v-bind="post"
/>