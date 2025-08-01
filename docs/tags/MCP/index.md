---
title: 标签 - MCP
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
  }
]
</script>

# 🏷️ 标签：MCP


<PostCard
  v-for="post in posts"
  :key="post.link"
  v-bind="post"
/>