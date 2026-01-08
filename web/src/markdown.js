import { marked } from 'marked'
import { debounce } from './common'
import katex from 'katex'

// 配置 marked 以支持数学公式
const renderer = new marked.Renderer()

// 扩展 marked 以支持行内和块级数学公式
marked.use({
  extensions: [
    {
      name: 'inlineMath',
      level: 'inline',
      start(src) {
        const dollarIndex = src.indexOf('$')
        const parenIndex = src.indexOf('\\(')
        if (dollarIndex === -1) return parenIndex
        if (parenIndex === -1) return dollarIndex
        return Math.min(dollarIndex, parenIndex)
      },
      tokenizer(src) {
        // Try \(...\) syntax first
        let match = src.match(/^\\\(([^\)]+?)\\\)/)
        if (match) {
          console.log('[LaTeX] Matched \\(...\\) inline:', match[1].substring(0, 30))
          return {
            type: 'inlineMath',
            raw: match[0],
            text: match[1].trim()
          }
        }
        
        // Fall back to $...$ syntax
        match = src.match(/^\$([^\$\n]+?)\$/)
        if (match) {
          console.log('[LaTeX] Matched $...$ inline:', match[1].substring(0, 30))
          return {
            type: 'inlineMath',
            raw: match[0],
            text: match[1].trim()
          }
        }
      },
      renderer(token) {
        try {
          const html = katex.renderToString(token.text, {
            throwOnError: false,
            displayMode: false
          })
          console.log('[LaTeX] Rendered inline successfully')
          return html
        } catch (e) {
          console.error('[LaTeX] Inline render error:', e.message)
          return `<code class="math-error">${token.text}</code>`
        }
      }
    },
    {
      name: 'blockMath',
      level: 'block',
      start(src) {
        const dollarIndex = src.indexOf('$$')
        const bracketIndex = src.indexOf('\\[')
        if (dollarIndex === -1) return bracketIndex
        if (bracketIndex === -1) return dollarIndex
        return Math.min(dollarIndex, bracketIndex)
      },
      tokenizer(src) {
        // Try \[...\] syntax first
        let match = src.match(/^\\\[([\s\S]+?)\\\]/)
        if (match) {
          console.log('[LaTeX] Matched \\[...\\] block:', match[1].substring(0, 50))
          return {
            type: 'blockMath',
            raw: match[0],
            text: match[1].trim()
          }
        }
        
        // Fall back to $$...$$ syntax
        match = src.match(/^\$\$\n?([\s\S]+?)\n?\$\$/)
        if (match) {
          console.log('[LaTeX] Matched $$...$$ block:', match[1].substring(0, 50))
          return {
            type: 'blockMath',
            raw: match[0],
            text: match[1].trim()
          }
        }
      },
      renderer(token) {
        try {
          const html = katex.renderToString(token.text, {
            throwOnError: false,
            displayMode: true
          })
          console.log('[LaTeX] Rendered block successfully')
          return `<div class="math-block">${html}</div>`
        } catch (e) {
          console.error('[LaTeX] Render error:', e.message)
          return `<pre class="math-error">${token.text}</pre>`
        }
      }
    }
  ]
})

export function initMarkdown () {
  const markdownInput = document.getElementById('markdown-input')
  const markdownPreview = document.getElementById('markdown-preview')

  const updatePreview = debounce(() => {
    const markdownContent = markdownInput.value
    markdownPreview.innerHTML = marked.parse(markdownContent)
  }, 300)

  function setMarkdown (text) {
    markdownInput.value = text
    updatePreview()
  }

  function getMarkdown () {
    return markdownInput.value
  }

  // add input event
  markdownInput.addEventListener('input', updatePreview)

  return {
    setMarkdown,
    updatePreview,
    getMarkdown,
  }
}
