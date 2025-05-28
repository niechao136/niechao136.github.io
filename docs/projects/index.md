---
title: 我的项目
description: 展示我在 GitHub 上的部分项目
---

<script setup>
const projects = [
    {
        name: 'niechao136.github.io',
        description: '一个基于 VitePress 构建的内容型博客模板',
        techs: ['vitepress', 'vue', 'markdown'],
        repo: 'https://github.com/niechao136/niechao136.github.io',
        demo: 'https://niechao136.github.io',
    }
]
</script>

# 我的项目

<ProjectCard
    v-for="project in projects"
    :key="project.repo"
    v-bind="project"
/>
