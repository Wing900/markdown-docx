import markdownDocx, { styles, Packer } from "markdown-docx"
import { ThemeManager } from './theme-manager.js'

export function initTools(service) {
  const clearButton = document.getElementById('clear-markdown')
  const downloadButton = document.getElementById('download')
  const uploadInput = document.getElementById('upload')
  const exportDocxButton = document.getElementById('export-docx')
  const cancelExportButton = document.getElementById('close-modal')
  const downloadSettingModal = document.getElementById('download-setting')

  // Clear button
  clearButton.addEventListener('click', () => {
    service.markdown.setMarkdown('')
    service.markdown.updatePreview()
  })

  // Download button - now opens the settings modal first
  downloadButton.addEventListener('click', () => {
    // Show the download settings modal (using dialog element)
    if (downloadSettingModal) {
      downloadSettingModal.showModal()
    }
  })

  // Cancel export button - closes the modal
  if (cancelExportButton) {
    cancelExportButton.addEventListener('click', () => {
      if (downloadSettingModal) {
        downloadSettingModal.close()
      }
    })
  }
  
  // Close modal when clicking on backdrop
  if (downloadSettingModal) {
    downloadSettingModal.addEventListener('click', (e) => {
      if (e.target === downloadSettingModal) {
        downloadSettingModal.close()
      }
    })
  }

  // Export DOCX button - performs the actual export
  if (exportDocxButton) {
    exportDocxButton.addEventListener('click', async () => {
      const markdownContent = service.markdown.getMarkdown()
      const getValueOf = (id) => document.getElementById(id)?.value || undefined
      const getChecked = (id) => document.getElementById(id)?.checked || false

      // 预处理：将括号公式语法转换为美元语法，确保导出兼容性
      const processedMarkdown = preprocessMathFormula(markdownContent)

      const selectedTheme = ThemeManager.themeConfigs[getValueOf('doc-theme') || 'default']

      // Get export options from form
      const options = {
        name: getValueOf('doc-name'),
        document: {
          title: getValueOf('doc-title'),
          description: getValueOf('doc-description'),
        },
        ignoreImage: getChecked('ignore-image'),
        ignoreFootnote: getChecked('ignore-footnote'),
        ignoreHtml: getChecked('ignore-html'),
        theme: selectedTheme?.theme,
      }
      // Use options for export
      const buffer = await markdownDocx(processedMarkdown, options)
      const blob = await Packer.toBlob(buffer);
    
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = formatFilename(options.name)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
  
      URL.revokeObjectURL(url)
      
      // Hide the modal after export
      if (downloadSettingModal) {
        downloadSettingModal.close()
      }
    })
  }

  // Upload button
  uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function(e) {
      service.markdown.setMarkdown(e.target.result)
      service.markdown.updatePreview()
    }
    reader.readAsText(file)
    // Reset the file input so the same file can be uploaded again if needed
    event.target.value = ''
  })
}

function formatFilename (name) {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const dateString = `${month}${day}${hours}${minutes}${seconds}`
  const filename = `${name || 'markdown-docx'}-${dateString}.docx`
  return filename
}

/**
 * 预处理数学公式语法：将 \(...\) 和 \[...\] 转换为 $...$ 和 $$...$$
 * 确保导出到 DOCX 时公式兼容性
 */
function preprocessMathFormula(content) {
  // 将 \(公式\) 转换为 $公式$
  let processed = content.replace(/\\\(([\s\S]*?)\\\)/g, (match, formula) => {
    return `$${formula}$`
  })

  // 将 \[公式\] 转换为 $$公式$$
  processed = processed.replace(/\\\[[\s\S]*?\\\]/g, (match) => {
    const inner = match.slice(2, -2)
    return `$$${inner}$$`
  })

  // 处理公式附近的顿号（中文顿号会干扰 markdown-docx 解析器）
  processed = fixFormulaPunctuation(processed)

  return processed
}

/**
 * 处理公式标点符号：把公式外部的中文标点换成英文
 * 避免 $...$、$...$ 之间的中文标点干扰 markdown-docx 解析器
 */
function fixFormulaPunctuation(content) {
  // 把 $公式$ 后面的中文标点换成英文标点，并在 $ 符号前后加空格
  // 处理中文逗号、顿号
  content = content.replace(/\$([^\$]+?)\$([，。、])/g, '$ $1$ $2')
  content = content.replace(/([，。、])\$([^\$]+?)\$/g, '$1 $ $2 $')
  // 处理中文句号
  content = content.replace(/\$([^\$]+?)\$。/g, '$ $1$.')
  // 处理中文分号
  content = content.replace(/\$([^\$]+?)\$；/g, '$ $1$;')
  // 处理中文冒号
  content = content.replace(/\$([^\$]+?)\$：/g, '$ $1$:')
  // 处理中文括号
  content = content.replace(/\$([^\$]+?)\$）（/g, '$ $1$) (')
  // 处理中文方括号
  content = content.replace(/\$([^\$]+?)\$】\]/g, '$ $1$] ')

  return content
}
