const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.join(__dirname, '../docs/posts')
const TAGS_DIR = path.join(__dirname, '../docs/tags')
const ARCHIVES_DIR = path.join(__dirname, '../docs/archives')
const ARCHIVES_FILE = path.join(__dirname, '../docs/archives/index.md')
const OUTPUT_FILE = path.join(POSTS_DIR, 'index.md')

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
    if (file.name === 'index.md') continue
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      result = result.concat(walkDir(fullPath))
    } else if (file.name.endsWith('.md')) {
      result.push(fullPath)
    }
  }
  return result
}

function generate() {
  const posts = walkDir(POSTS_DIR)
    .map((filepath) => {
      const content = fs.readFileSync(filepath, 'utf-8')
      const fm = parseFrontMatter(content)
      const relativePath = filepath
        .replace(POSTS_DIR, '')
        .replace(/\\/g, '/')
        .replace(/\.md$/, '')
      return {
        title: fm.title || path.basename(filepath, '.md'),
        date: fm.date || '',
        description: fm.description || '',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        link: `/posts${relativePath}`
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date)) // 按时间倒序

  // 1. posts/index.md
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

  // for (const post of posts) {
  //   lines.push(`## [${post.title}](${post.link})\n`)
  //   if (post.date) lines.push(`🗓️ ${post.date}  `)
  //   if (post.description) lines.push(`📄 ${post.description}\n`)
  //   if (post.tags.length > 0) {
  //     lines.push(`**标签**：` + post.tags.map(t => `\`${t}\``).join(' ') + '\n')
  //   }
  //   lines.push('') // 空行分隔
  // }

  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8')

  // 2. tags/index.md
  const tagMap = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap[tag]) tagMap[tag] = []
      tagMap[tag].push(post)
    }
  }

  if (!fs.existsSync(TAGS_DIR)) fs.mkdirSync(TAGS_DIR)

  const tagsIndex = [
    '---',
    'title: 标签',
    '---\n',
    '# 🏷️ 所有标签\n'
  ]

  Object.keys(tagMap)
    .sort()
    .forEach(tag => {
      tagsIndex.push(`- [${tag}](./${tag}.md) (${tagMap[tag].length})`)
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
    // for (const post of tagPosts) {
    //   tagLines.push(`- [${post.title}](${post.link}) (${post.date})`)
    // }
    fs.writeFileSync(path.join(TAGS_DIR, `${tag}.md`), tagLines.join('\n'), 'utf-8')
  }

  // 3. archives/index.md

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
      // for (const post of grouped[year]) {
      //   archivesLines.push(`- [${post.title}](${post.link}) (${post.date})`)
      // }
      archivesLines.push('')
    })

  fs.writeFileSync(ARCHIVES_FILE, archivesLines.join('\n'), 'utf-8')

  console.log('✅ 已生成 index、tags、archives 页面')
}

generate()
