---
title: 标签 - vue3
---

<script setup>
const posts = [
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
</script>

# 🏷️ 标签：vue3


<PostCard
  v-for="post in posts"
  :key="post.link"
  v-bind="post"
/>