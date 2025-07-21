import DefaultTheme from 'vitepress/theme'
import PostCard from './components/PostCard.vue'
import ProjectCard from './components/ProjectCard.vue'
import './css/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostCard', PostCard)
    app.component('ProjectCard', ProjectCard)
    if (typeof window !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('a[href^="http"]')
        links.forEach(link => {
          link.setAttribute('target', '_blank')
          link.setAttribute('rel', 'noopener noreferrer')
        })
      })
    }
  }
}
