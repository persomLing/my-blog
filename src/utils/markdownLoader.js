// 加载所有 markdown 文件
import _ from 'lodash'


// 处理HTML格式的图片路径
const processHtmlImages = (htmlContent) => {
  // 正则匹配HTML img标签的src属性
  return htmlContent.replace(/<img\s+src="(\.\.?\/.*?)"\s+/g, (match, path) => {
    // 处理相对路径
    let newPath = path
    if (path.startsWith('./') || path.startsWith('../')) {
      newPath = path.replace(/^\.\.\/?/, '')
      newPath = `xqw-blog/src/assets/${newPath}`
    }
    return match.replace(path, newPath)
  })
}

// 将HTML转换为纯文本
const htmlToPlainText = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// 截断文本并添加省略号
const truncateText = (text, maxLength = 100) => {
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
    
    // 只添加有内容的文章
    if (mdFiles[filePath]) {
      // 生成文章数据
      articles.push({
        id: `${category}-${title}`, // 简单的唯一标识
        title: title,
        date: '2025-11-17', // 可以从文件元数据或修改时间获取，这里暂时固定
        author: '博主', // 默认作者
        category: category,
        excerpt: processExcerpt(mdFiles[filePath]), // 使用处理后的内容作为摘要
        content: mdFiles[filePath] // 保留原始内容，在渲染时处理路径
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
  processHtmlImages, // 导出HTML图片处理函数
}
