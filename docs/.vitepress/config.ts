
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的博客',
  description: '基于 VitePress 构建的个人博客',
  base: '/vite-blog/',

  head: [
    ['link', { rel: 'icon', href: '/vite-blog/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '文章', link: '/posts/2025/hello-vitepress' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
      { text: '关于我', link: '/about' },
    ],
    sidebar: {
      '/posts/2025/': [
        {
          text: '2025 年文章',
          collapsed: false,
          items: [
            { text: '你好，VitePress！', link: '/posts/2025/hello-vitepress' },
            { text: '使用 Composition API 的实践', link: '/posts/2025/vue3-composition-api' },
            { text: '如何部署到 GitHub Pages', link: '/posts/2025/vite-deploy-github-pages' },
          ]
        }
      ]
    }
  },
})
