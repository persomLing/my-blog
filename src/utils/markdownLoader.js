// 加载所有 markdown 文件
import _ from 'lodash'

// 收集 src/assets 下的资源在 dev/build 中对应的最终 URL（as: 'url' 会返回可直接使用的 URL）
// 在 Vite 中，import.meta.glob 的路径模式在编译时解析，这里使用以 /src 开头的绝对模式
const assetMap = import.meta.glob('/src/assets/**/*', { eager: true, as: 'url' })

// 把 baseDir 和相对路径解析为规范路径（以 / 开头，不含重复斜杠）
const normalizePath = (baseDir, relativePath) => {
  if (!relativePath) return relativePath
  if (relativePath.startsWith('/')) return relativePath.replace(/([^:]\/)\/+/g, '$1')

  const baseParts = baseDir.split('/').filter(Boolean)
  const relParts = relativePath.split('/').filter(Boolean)
  const parts = baseParts.concat(relParts)
  const out = []
  parts.forEach(seg => {
    if (seg === '..') {
      out.pop()
    } else if (seg === '.') {
      // skip
    } else {
      out.push(seg)
    }
  })
  return '/' + out.join('/')
}

// 根据原始路径和 md 文件目录解析出最终可用的 asset URL（使用 assetMap）
const resolveAssetUrl = (rawPath, mdDir) => {
  if (!rawPath) return null

  let p = rawPath.trim()

  // 常见别名和写法映射
  if (p.startsWith('@/')) p = p.replace(/^@\//, '/src/')
  else if (p.startsWith('assets/')) p = '/src/' + p
  else if (p.startsWith('./') || p.startsWith('../')) p = normalizePath(mdDir, p)

  // 精确匹配 assetMap
  if (assetMap[p]) return assetMap[p]

  // 尝试后缀匹配（兼容写了相对简写或只写文件名的情况）
  const key = Object.keys(assetMap).find(k => k.endsWith(p) || k.endsWith('/' + p))
  if (key) return assetMap[key]

  return null
}



// 截断文本并添加省略号
const truncateText = (text, maxLength = 80) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 处理文章摘要（直接截断Markdown文本）
const processExcerpt = (excerpt) => {
  // 移除Markdown格式，转换为纯文本
  const plainText = excerpt.replace(/<img\s+.*?\/?>/g, '').replace(/[#*`_[\]()]+/g, '')
  return truncateText(plainText)
}

const loadMarkdownFiles = async () => {
  // 使用 Vite 的 import.meta.glob 来加载所有 markdown 文件
  const mdFiles = import.meta.glob('../allDocuments/**/*.md', { eager: true, query: '?raw', import: 'default' })

  // 处理文件路径和内容
  const articles = []

  // 遍历所有加载的文件
  for (const filePath in mdFiles) {
    // 确保只处理 .md 文件
    if (!filePath.endsWith('.md')) {
      continue;
    }

    // 解析文件路径
    // 路径格式类似: ../allDocuments/工作总结/页面配置？低代码？.md
    const relativePath = filePath.replace(/^\.\.\/allDocuments\//, '')

    // 处理不同层级的路径
    const pathParts = relativePath.split('/')
    let category, filename

    if (pathParts.length === 1) {
      // 根目录下的文件
      category = '未分类'
      filename = pathParts[0]
    } else {
      // 多级目录下的文件
      category = pathParts.slice(0, -1).join('/') // 使用完整的目录路径作为分类
      filename = pathParts[pathParts.length - 1]
    }


    // 获取文件名（去掉 .md 后缀）
    const title = filename.replace(/\.md$/, '')

    if (mdFiles[filePath]) {
      let rawContent = mdFiles[filePath]

      // 计算当前 md 文件在 src 下的路径和目录（用于解析相对路径）
      const mdSrcPath = '/src/' + filePath.replace(/^\.\.\//, '') // ../allDocuments/... -> /src/allDocuments/...
      const mdDir = mdSrcPath.replace(/[^/]+$/, '')

      // 处理 HTML <img src="..."> 标签
      rawContent = rawContent.replace(/<img\s+[^>]*src="([^"]+)"([^>]*)>/g, (match, src, rest) => {
        const resolved = resolveAssetUrl(src, mdDir)
        return resolved ? match.replace(src, resolved) : match
      })

      // 处理 Markdown 图片语法 ![alt](path)
      rawContent = rawContent.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (match, p1) => {
        const resolved = resolveAssetUrl(p1, mdDir)
        return resolved ? match.replace(p1, resolved) : match
      })

      // 生成文章数据（使用处理后的内容）
      articles.push({
        id: `${category}-${title}`,
        title: title,
        date: '2025-11-17',
        author: '博主',
        category: category,
        excerpt: processExcerpt(rawContent),
        content: rawContent
      })
    }
  }

  return articles
}

// 生成分类列表
const generateCategories = (articles) => {
  // 创建分类树结构
  const categoryTree = {}

  // 遍历所有文章，构建分类树
  articles.forEach(article => {
    const categoryPath = article.category
    if (categoryPath === '未分类') {
      // 未分类的文章直接处理
      if (!categoryTree['未分类']) {
        categoryTree['未分类'] = {
          name: '未分类',
          href: '#category/未分类',
          icon: '📂',
          children: []
        }
      }
      categoryTree['未分类'].children.push({
        name: article.title,
        href: `#post/${article.id}`,
        icon: '📝',
        article: article // 保存完整的文章对象
      })
    } else {
      // 处理多级分类
      const pathParts = categoryPath.split('/')
      let currentLevel = categoryTree

      pathParts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            href: `#category/${pathParts.slice(0, index + 1).join('/')}`,
            icon: '📂',
            children: []
          }
        }
        if (index === pathParts.length - 1) {
          // 最后一级分类，添加文章
          currentLevel[part].children.push({
            name: article.title,
            href: `#post/${article.id}`,
            icon: '📝',
            article: article // 保存完整的文章对象
          })
        }
        currentLevel = currentLevel[part].children
      })
    }
  })

  // 转换为数组结构
  const convertToTree = (treeObj) => {
    return Object.values(treeObj).map(item => {
      if (item.children && item.children.length > 0) {
        // 递归处理子分类
        item.children = convertToTree(item.children.reduce((acc, child) => {
          acc[child.name] = child
          return acc
        }, {}))
      }
      return item
    })
  }

  return convertToTree(categoryTree)
}

// 导出所有函数
export {
  loadMarkdownFiles,
  generateCategories,
}
