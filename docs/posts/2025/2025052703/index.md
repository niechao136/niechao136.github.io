---
title: 使用 Vue 3 Composition API 的实践
date: 2025-05-27
tags: [vue3, composition-api, 前端]
description: 初学者如何理解并应用 Vue 3 Composition API 的基本用法和优势
---

# 使用 Vue 3 Composition API 的实践

Vue 3 引入了 Composition API，它带来了更灵活的逻辑组织方式。本文从基础出发，介绍如何使用它，并说明为何它值得使用。

## 1. 为什么选择 Composition API？

Options API 存在的问题：

- 难以复用逻辑
- 多个功能逻辑分散在不同的选项中（data, methods, computed）

Composition API 的优势：

- 更好的逻辑复用
- 更强的类型推导（特别在 TypeScript 中）
- 更适合构建大型复杂应用

## 2. 基础用法

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
````

## 3. 生命周期函数

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

## 4. 自定义逻辑复用（Composable）

创建 `useMouse.ts`：

```ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

使用它：

```vue
<script setup>
import { useMouse } from './useMouse'

const { x, y } = useMouse()
</script>

<template>
  <p>Mouse at: {{ x }}, {{ y }}</p>
</template>
```

## 5. 总结

Composition API 适合结构清晰、逻辑高度复用的开发模式。推荐在新项目中默认使用它。你也可以在旧项目中渐进式引入。

