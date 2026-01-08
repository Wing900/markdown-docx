/**
 * 语言配置 - 仅支持中文
 * 保留此文件以维持兼容性，但不再提供多语言功能
 */

// 初始化语言系统（简化版，仅设置中文）
export function initLanguage() {
  // 设置文档语言为中文
  document.documentElement.lang = 'zh-CN';
  return 'zh';
}

// 导出空函数以保持向后兼容
export function updateDocumentLangs() {
  // 不再需要更新语言元素
}

export function setLanguage() {
  // 固定为中文，不再支持切换
  document.documentElement.lang = 'zh-CN';
}