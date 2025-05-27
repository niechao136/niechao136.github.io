import DefaultTheme from 'vitepress/theme'
import PostCard from './components/PostCard.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostCard', PostCard)
  }
}
