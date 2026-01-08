import initZhMarkdown from './zh-template.md?raw'

// 初始化模板（仅加载默认中文模板，不渲染按钮）
export function initTemplates(service) {
  // 设置默认的中文模板内容
  service.markdown.setMarkdown(initialMarkdown)

  return {
    initialMarkdown
  }
}

// 默认使用中文模板
export const initialMarkdown = initZhMarkdown
