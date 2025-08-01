const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.join(__dirname, '../docs/posts')
const TAGS_DIR = path.join(__dirname, '../docs/tags')
const ARCHIVES_DIR = path.join(__dirname, '../docs/archives')
const SERIES_DIR = path.join(__dirname, '../docs/series')

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/)
  if (!match) return {}
  const lines = match[1].split(/\r?\n/)
  const data = {}
  for (const line of lines) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length > 0) {
      const raw = rest.join(':').trim()
      if (raw.startsWith('[')) {
        try {
          // 尝试 JSON 解析
          data[key.trim()] = JSON.parse(raw)
        } catch {
          // 手动解析 YAML 数组格式
          data[key.trim()] = raw
            .replace(/^\[/, '')
            .replace(/]$/, '')
            .split(',')
            .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean)
        }
      } else {
        data[key.trim()] = raw.replace(/^"|"$/g, '')
      }
    }
  }
  return data
}

function walkDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let result = []
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.name === 'index.md' && path.resolve(fullPath) === path.resolve(path.join(POSTS_DIR, 'index.md'))) continue
    if (file.isDirectory()) {
      result = result.concat(walkDir(fullPath))
    } else if (file.name.endsWith('.md')) {
      result.push(fullPath)
    }
  }
  return result
}

function generate() {
  function generateIndex() {
    // posts/index.md
    const lines = [
      '---',
      'title: 所有文章',
      '---\n',
      '<script setup>',
      `const posts = ${JSON.stringify(posts, null, 2)}`,
      '</script>\n',
      '# 📚 所有文章\n\n',
      '<PostCard',
      '  v-for="post in posts"',
      '  :key="post.link"',
      '  v-bind="post"',
      '/>',
    ]
    fs.writeFileSync(path.join(POSTS_DIR, 'index.md'), lines.join('\n'), 'utf-8')
  }
  function generateTag() {
    if (!fs.existsSync(TAGS_DIR)) fs.mkdirSync(TAGS_DIR)
    // tags/index.md
    const tagMap = {}
    for (const post of posts) {
      for (const tag of post.tags) {
        if (!tagMap[tag]) tagMap[tag] = []
        tagMap[tag].push(post)
      }
    }
    const tagsIndex = [
      '---',
      'title: 标签',
      '---\n',
      '# 🏷️ 所有标签\n'
    ]
    Object.keys(tagMap)
      .sort()
      .forEach(tag => {
        tagsIndex.push(`- [${tag}](./${tag}/) (${tagMap[tag].length})`)
      })
    fs.writeFileSync(path.join(TAGS_DIR, 'index.md'), tagsIndex.join('\n'), 'utf-8')
    // 每个 tag 页面
    for (const [tag, tagPosts] of Object.entries(tagMap)) {
      const tagLines = [
        '---',
        `title: 标签 - ${tag}`,
        '---\n',
        '<script setup>',
        `const posts = ${JSON.stringify(tagPosts, null, 2)}`,
        '</script>\n',
        `# 🏷️ 标签：${tag}\n\n`,
        '<PostCard',
        '  v-for="post in posts"',
        '  :key="post.link"',
        '  v-bind="post"',
        '/>',
      ]
      const tagPath = path.join(TAGS_DIR, tag)
      if (!fs.existsSync(tagPath)) fs.mkdirSync(tagPath)
      fs.writeFileSync(path.join(tagPath, 'index.md'), tagLines.join('\n'), 'utf-8')
    }
  }
  function generateArchive() {
    // archives/index.md
    if (!fs.existsSync(ARCHIVES_DIR)) fs.mkdirSync(ARCHIVES_DIR)
    const grouped = {}
    for (const post of posts) {
      const year = post.date.slice(0, 4)
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(post)
    }
    const archivesLines = [
      '---',
      'title: 归档',
      '---\n',
      '<script setup>',
      `const posts = ${JSON.stringify(grouped, null, 2)}`,
      '</script>\n',
      '# 🗂️ 文章归档\n\n',
    ]
    Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .forEach(year => {
        archivesLines.push(`## ${year}`)
        archivesLines.push(
          '<PostCard',
          `  v-for="post in posts['${year}']"`,
          '  :key="post.link"',
          '  v-bind="post"',
          '/>')
        archivesLines.push('')
      })

    fs.writeFileSync(path.join(ARCHIVES_DIR, 'index.md'), archivesLines.join('\n'), 'utf-8')
  }
  function generateSeries() {
    if (!fs.existsSync(SERIES_DIR)) fs.mkdirSync(SERIES_DIR)
    const seriesMap = {}
    for (const post of posts) {
      if (post.series) {
        if (!seriesMap[post.series]) seriesMap[post.series] = []
        seriesMap[post.series].push(post)
      }
    }

    const seriesIndex = [
      '---',
      'title: 系列',
      '---\n',
      '# 📖 所有系列\n'
    ]
    Object.keys(seriesMap).sort().forEach(series => {
      seriesIndex.push(`- [${series}](./${series}/) (${seriesMap[series].length})`)
    })
    fs.writeFileSync(path.join(SERIES_DIR, 'index.md'), seriesIndex.join('\n'), 'utf-8')

    for (const [series, seriesPosts] of Object.entries(seriesMap)) {
      const lines = [
        '---',
        `title: 系列 - ${series}`,
        '---\n',
        '<script setup>',
        `const posts = ${JSON.stringify(seriesPosts, null, 2)}`,
        '</script>\n',
        `# 📖 系列：${series}\n`,
        '<PostCard',
        '  v-for="post in posts"',
        '  :key="post.link"',
        '  v-bind="post"',
        '/>',
      ]
      const seriesPath = path.join(SERIES_DIR, series)
      if (!fs.existsSync(seriesPath)) fs.mkdirSync(seriesPath)
      fs.writeFileSync(path.join(seriesPath, 'index.md'), lines.join('\n'), 'utf-8')
    }
  }
  function generateSidebar() {
    // sidebar 生成
    const sidebarGroups = {}
    for (const post of posts) {
      const urlParts = post.link.split('/').filter(Boolean)
      if (urlParts.length >= 3 && urlParts[0] === 'posts') {
        const year = urlParts[1]
        if (!sidebarGroups[year]) {
          sidebarGroups[year] = []
        }
        sidebarGroups[year].push({
          text: post.title,
          link: post.link
        })
      }
    }
    const sidebar = {
      '/posts/': Object.entries(sidebarGroups)
        .sort((a, b) => b[0].localeCompare(a[0])) // 年份倒序
        .map(([year, items]) => ({
          text: `${year} 年文章`,
          collapsed: false,
          items
        }))
    }
    const sidebarFile = path.join(__dirname, '../docs/.vitepress/generated/sidebar.ts')
    fs.mkdirSync(path.dirname(sidebarFile), { recursive: true })
    fs.writeFileSync(
      sidebarFile,
      'export default ' + JSON.stringify(sidebar, null, 2),
      'utf-8'
    )
  }
  const posts = walkDir(POSTS_DIR)
    .map((filepath) => {
      const content = fs.readFileSync(filepath, 'utf-8')
      const fm = parseFrontMatter(content)
      const relativePath = filepath
        .replace(POSTS_DIR, '')
        .replace(/\\/g, '/')
        .replace(/\/index\.md$/, '/')
        .replace(/\.md$/, '')
      return {
        title: fm.title || path.basename(filepath, '.md'),
        date: fm.date || '',
        description: fm.description || '',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        series: fm.series || '',
        link: `/posts${relativePath}`
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date)) // 按时间倒序

  generateIndex()
  generateTag()
  generateArchive()
  generateSeries()
  console.log('✅ 已生成 index、tags、archives、series 页面')
  generateSidebar()
  console.log('✅ 已生成 sidebar.ts 文件')
}

generate()
