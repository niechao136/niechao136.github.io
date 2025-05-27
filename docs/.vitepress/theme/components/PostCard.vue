<script setup>
import { withBase } from 'vitepress'
defineProps({
  title: String,
  date: String,
  description: String,
  tags: Array,
  link: String,
})
</script>

<template>
  <div class="post-card">
    <a :href="withBase(link)" class="post-card-title">{{ title }}</a>
    <div class="post-card-meta">
      🗓️ {{ date }}
    </div>
    <div class="post-card-desc">{{ description }}</div>
    <div class="post-card-tags">
      <template v-for="tag in tags">
        <a :href="withBase(`/tags/${tag}`)" class="post-tag">#{{ tag }}</a>
      </template>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s ease;
  background: var(--vp-c-bg);
}
.post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.post-card-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--vp-c-brand-1);
}
.post-card-meta {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
.post-card-desc {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}
.post-card-tags {
  margin-top: 0.5rem;
}
.post-tag {
  font-size: 0.8rem;
  margin-right: 0.5rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
</style>
