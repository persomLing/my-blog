// custom-code-block-plugin.js
export default function codeCopyPlugin() {
  return {
    viewerEffect({ markdownBody }) {
      const codeBlocks = markdownBody.querySelectorAll('pre > code')
      console.log(codeBlocks,);

      codeBlocks.forEach((codeElement, index) => {
        // 创建增强的代码块容器
        const enhancedBlock = document.createElement('button')
        enhancedBlock.className = 'btn-copy'
        enhancedBlock.setAttribute('data-code-index', index)
        enhancedBlock.innerHTML = '复制代码'
        console.log(enhancedBlock, codeElement);

        codeElement.parentNode.insertBefore(enhancedBlock, codeElement)

        // 绑定复制事件
        const copyBtn = enhancedBlock 
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(codeElement.textContent)
            copyBtn.innerHTML = '✓ 复制成功'
            setTimeout(() => {
              copyBtn.innerHTML = '复制代码'
            }, 2000)
          } catch (err) {
            console.error('复制失败:', err)
          }
        })
      })
    }
  }
}