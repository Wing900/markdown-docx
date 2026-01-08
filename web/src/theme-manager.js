/**
 * 中国风主题管理器
 * 极简主义、淡灰色、浅色系
 */

// 主题配置定义 - 中国风色彩
const themeConfigs = {
  academic: {
    name: '素雅',
    theme: {
      primary: '000000',
      heading1: '000000',
      heading2: '000000',
      heading3: '000000',
      heading4: '000000',
      heading5: '000000',
      heading6: '000000',
      link: '0066CC',
      code: '666666',
      blockquote: '666666',
      del: 'C85A54'
    }
  },
  default: {
    name: '水墨',
    theme: {
      primary: '5B7C8D',
      heading1: '3A5260',
      heading2: '5B7C8D',
      heading3: '6B8B9A',
      heading4: '6B8B9A',
      heading5: '6B8B9A',
      heading6: '6B8B9A',
      link: '5B7C8D',
      code: '9B8B8E',
      blockquote: '6B6B6B',
      del: 'C85A54'
    }
  },
  elegant: {
    name: '青竹',
    theme: {
      primary: '6B8E7F',
      heading1: '4A6B5C',
      heading2: '6B8E7F',
      heading3: '7A9D8E',
      heading4: '7A9D8E',
      heading5: '7A9D8E',
      heading6: '7A9D8E',
      link: '6B8E7F',
      code: '8B7C7F',
      blockquote: '6B6B69',
      del: 'C85A54'
    }
  },
  modern: {
    name: '藕荷',
    theme: {
      primary: '9B8B8E',
      heading1: '6D6164',
      heading2: '9B8B8E',
      heading3: 'AA9A9D',
      heading4: 'AA9A9D',
      heading5: 'AA9A9D',
      heading6: 'AA9A9D',
      link: '9B8B8E',
      code: '8B7C7F',
      blockquote: '6B6B69',
      del: 'C85A54'
    }
  }
};

// 全局主题状态
let currentTheme = 'academic';

/**
 * 切换主题
 * @param {string} themeName - 主题名称
 */
function switchTheme(themeName) {
  if (!themeConfigs[themeName]) {
    console.warn(`主题 "${themeName}" 不存在`);
    return;
  }

  currentTheme = themeName;
  
  // 保存到 localStorage
  try {
    localStorage.setItem('markdown-docx-theme', themeName);
  } catch (e) {
    console.warn('无法保存主题设置到 localStorage:', e);
  }

  // 更新 UI 显示
  updateThemeDisplay(themeName);

  // 更新预览区域主题
  updatePreviewTheme(themeConfigs[themeName]);

  // 触发自定义事件通知主题已变更
  window.dispatchEvent(new CustomEvent('themeChanged', {
    detail: {
      theme: themeName,
      config: themeConfigs[themeName]
    }
  }));
}

/**
 * 更新主题显示
 * @param {string} themeName - 主题名称
 */
function updateThemeDisplay(themeName) {
  const config = themeConfigs[themeName];
  const themeButton = document.getElementById('theme-toggle');
  const themeSelect = document.getElementById('doc-theme');

  // 更新按钮文本
  if (themeButton) {
    const label = themeButton.querySelector('.md3-button__label');
    if (label) {
      label.textContent = config.name;
    }
  }

  // 更新选择框
  if (themeSelect) {
    themeSelect.value = themeName;
  }

  // 更新菜单项的选中状态
  document.querySelectorAll('.theme-option').forEach(option => {
    if (option.dataset.theme === themeName) {
      option.setAttribute('aria-selected', 'true');
      option.style.backgroundColor = 'rgba(91, 124, 141, 0.08)';
    } else {
      option.removeAttribute('aria-selected');
      option.style.backgroundColor = '';
    }
  });
}

/**
 * 更新预览区域主题
 * @param {Object} config - 主题配置
 */
function updatePreviewTheme(config) {
  const preview = document.getElementById('markdown-preview');
  if (!preview) return;

  // 应用主题色彩到 CSS 变量
  preview.style.setProperty('--theme-primary', `#${config.theme.primary}`);
  preview.style.setProperty('--theme-heading1', `#${config.theme.heading1}`);
  preview.style.setProperty('--theme-heading2', `#${config.theme.heading2}`);
  preview.style.setProperty('--theme-heading3', `#${config.theme.heading3}`);
  preview.style.setProperty('--theme-heading4', `#${config.theme.heading4}`);
  preview.style.setProperty('--theme-heading5', `#${config.theme.heading5}`);
  preview.style.setProperty('--theme-heading6', `#${config.theme.heading6}`);
  preview.style.setProperty('--theme-link', `#${config.theme.link}`);
  preview.style.setProperty('--theme-code', `#${config.theme.code}`);
  preview.style.setProperty('--theme-blockquote', `#${config.theme.blockquote}`);
  preview.style.setProperty('--theme-del', `#${config.theme.del}`);
}

/**
 * 获取当前主题配置
 * @returns {Object} 当前主题信息
 */
function getCurrentTheme() {
  return {
    name: currentTheme,
    config: themeConfigs[currentTheme]
  };
}


/**
 * 初始化主题功能
 */
function initThemeManager() {
  // 从 localStorage 恢复主题设置
  let savedTheme = 'academic';
  try {
    savedTheme = localStorage.getItem('markdown-docx-theme') || 'academic';
  } catch (e) {
    console.warn('无法从 localStorage 读取主题设置:', e);
  }

  // 验证主题是否存在
  if (!themeConfigs[savedTheme]) {
    savedTheme = 'academic';
  }

  currentTheme = savedTheme;

  // 初始化 UI
  updateThemeDisplay(currentTheme);
  updatePreviewTheme(themeConfigs[currentTheme]);

  // 绑定主题切换按钮事件
  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');

  if (themeToggle && themeDropdown) {
    // 点击按钮切换下拉菜单
    themeToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isHidden = themeDropdown.hasAttribute('hidden');
      
      if (isHidden) {
        themeDropdown.removeAttribute('hidden');
      } else {
        themeDropdown.setAttribute('hidden', '');
      }
    });

    // 绑定主题选项点击事件
    themeDropdown.addEventListener('click', function (e) {
      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        const themeName = themeOption.dataset.theme;
        switchTheme(themeName);
        themeDropdown.setAttribute('hidden', '');
      }
    });
  }

  // 绑定模态框中的主题选择器
  const themeSelect = document.getElementById('doc-theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', function () {
      switchTheme(this.value);
    });
  }

  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', function (e) {
    if (themeDropdown && !themeToggle?.contains(e.target)) {
      themeDropdown.setAttribute('hidden', '');
    }
  });
}

// 在 DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeManager);
} else {
  initThemeManager();
}

// 导出 API
export const ThemeManager = {
  getCurrentTheme,
  switchTheme,
  themeConfigs
};