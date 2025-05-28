<script setup>
defineProps({
  name: String,
  description: String,
  techs: Array,
  repo: String,
  demo: String
})
</script>

<template>
  <div class="project-card">
    <h3 class="name">
      <a :href="repo" target="_blank" rel="noopener">{{ name }}</a>
    </h3>
    <p class="desc">{{ description }}</p>
    <div class="techs">
      <span v-for="tech in techs" :key="tech" class="tech">#{{ tech }}</span>
    </div>
    <div class="links">
      <a :href="repo" target="_blank">🔗 GitHub</a>
      <a v-if="demo" :href="demo" target="_blank">🌐 Demo</a>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  margin-bottom: 1rem;
  background: var(--vp-c-bg-soft);
  transition: box-shadow 0.2s;
}
.project-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.name {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.desc {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}
.techs {
  margin-bottom: 0.5rem;
}
.tech {
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  margin-right: 0.5rem;
}
.links a {
  margin-right: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>
