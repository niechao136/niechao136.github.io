
import { defineConfig } from 'vitepress'
import sidebar from './generated/sidebar'

export default defineConfig({
  title: '我的博客',
  description: '基于 VitePress 构建的个人博客',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
      { text: '项目', link: '/projects/' },
      { text: '关于我', link: '/about/' },
    ],
    sidebar,
  },
})
