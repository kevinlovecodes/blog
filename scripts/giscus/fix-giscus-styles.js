const fs = require('fs');
const path = require('path');
const { getAllHTMLFiles } = require('./utils');

// 强制设置评论区样式的内联脚本
const inlineScript = `
<!-- 强制设置评论区样式的脚本 -->
<script>
(function() {
  // 立即执行一次
  applyStyles();
  
  // DOM加载完成后执行
  document.addEventListener('DOMContentLoaded', applyStyles);
  
  // 页面完全加载后再次执行
  window.addEventListener('load', function() {
    applyStyles();
    // 页面加载后延迟执行，确保giscus已加载
    setTimeout(applyStyles, 1000);
  });
  
  // 创建MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    let shouldApply = false;
    
    // 检查是否有iframe被添加到页面
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
            shouldApply = true;
            // 监听iframe加载完成事件
            node.addEventListener('load', function() {
              setTimeout(applyStyles, 100);
            });
            break;
          }
        }
      }
    });
    
    if (shouldApply) {
      applyStyles();
    }
  });
  
  // 启动观察器
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // 设置周期性检查（前10秒每500ms检查一次）
  let checkCount = 0;
  const maxChecks = 20; // 10秒内检查20次
  const intervalId = setInterval(function() {
    applyStyles();
    checkCount++;
    if (checkCount >= maxChecks) {
      clearInterval(intervalId);
    }
  }, 500);
  
  // 应用样式的函数
  function applyStyles() {
    // 直接选择评论区容器
    const giscusContainers = document.querySelectorAll('.giscus-container');
    if (giscusContainers && giscusContainers.length > 0) {
      giscusContainers.forEach(container => {
        const parentDiv = container.parentElement;
        if (parentDiv && parentDiv.style) {
          parentDiv.style.marginTop = '50px';
          parentDiv.style.marginBottom = '10px';
          console.log('已应用评论区容器样式');
        }
      });
    }
    
    // 选择样式包含max-width的div元素（giscus通常在这样的容器中）
    const containers = document.querySelectorAll('div[style*="max-width: 800px"]');
    if (containers && containers.length > 0) {
      containers.forEach(container => {
        container.style.setProperty('margin-top', '50px', 'important');
        container.style.setProperty('margin-bottom', '10px', 'important');
        console.log('已设置评论区容器样式');
      });
    }
    
    // 处理giscus iframe
    const iframes = document.querySelectorAll('iframe.giscus-frame');
    if (iframes && iframes.length > 0) {
      iframes.forEach(iframe => {
        // 设置iframe自身的样式
        iframe.style.setProperty('margin-top', '10px', 'important');
        iframe.style.setProperty('margin-bottom', '10px', 'important');
        
        // 设置父元素样式
        const parent = iframe.parentElement;
        if (parent) {
          parent.style.setProperty('margin-top', '50px', 'important');
          parent.style.setProperty('margin-bottom', '10px', 'important');
          
          // 设置祖父元素样式（如果存在）
          const grandParent = parent.parentElement;
          if (grandParent) {
            grandParent.style.setProperty('margin-top', '50px', 'important');
            grandParent.style.setProperty('margin-bottom', '10px', 'important');
          }
        }
      });
    }
    
    // 查找并设置特定位置后的评论区
    const prevNextContainers = document.querySelectorAll('.post-prev-next');
    prevNextContainers.forEach(container => {
      const nextElement = container.nextElementSibling;
      if (nextElement) {
        nextElement.style.setProperty('margin-top', '50px', 'important');
        nextElement.style.setProperty('margin-bottom', '10px', 'important');
      }
    });
  }
})();
</script>
`;

// 要添加的iframe样式注入器脚本标记
const iframeInjectorTag = `
  <!-- Giscus iframe样式注入器 -->
  <script src="/scripts/giscus/iframe-style-injector.js"></script>
`;

/**
 * 向HTML文件添加内联脚本
 * @param {string} filePath - HTML文件路径
 * @returns {boolean} - 是否成功添加脚本
 */
function addInlineScript(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否已经包含该脚本
    if (content.includes('强制设置评论区样式的脚本')) {
      console.log(`文件已包含样式脚本，正在更新: ${filePath}`);
      // 移除旧脚本
      const scriptStartIndex = content.indexOf('<!-- 强制设置评论区样式的脚本 -->');
      if (scriptStartIndex !== -1) {
        const scriptEndIndex = content.indexOf('</script>', scriptStartIndex) + 9;
        content = content.substring(0, scriptStartIndex) + content.substring(scriptEndIndex);
      }
    }
    
    // 找到</body>标签，在其前面插入内联脚本
    const bodyEndIndex = content.lastIndexOf('</body>');
    if (bodyEndIndex === -1) {
      console.log(`文件中找不到</body>标签: ${filePath}`);
      return false;
    }
    
    // 插入内联脚本
    const newContent = content.slice(0, bodyEndIndex) + inlineScript + content.slice(bodyEndIndex);
    
    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`已添加/更新内联样式脚本: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`处理文件错误: ${filePath}`, error);
    return false;
  }
}

/**
 * 更新HTML文件中的Giscus评论区样式
 * @param {string} filePath - HTML文件路径
 * @returns {boolean} - 是否成功更新样式
 */
function updateGiscusMargins(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找Giscus评论区容器
    const oldStyleRegex = /<div style="max-width: 800px; margin: (.*?); padding: 0 16px;">/g;
    
    if (content.match(oldStyleRegex)) {
      // 替换为新的样式
      const newContent = content.replace(oldStyleRegex, 
        '<div style="max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;">');
      
      // 写入文件
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`已更新Giscus评论区样式: ${filePath}`);
      return true;
    } else {
      console.log(`文件中没有找到Giscus评论区: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`处理文件错误: ${filePath}`, error);
    return false;
  }
}

/**
 * 向HTML文件添加iframe样式注入器脚本
 * @param {string} filePath - HTML文件路径
 * @returns {boolean} - 是否成功添加脚本
 */
function addIframeInjectorScript(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否已经包含该脚本
    if (content.includes('iframe-style-injector.js')) {
      console.log(`文件已包含iframe样式注入器: ${filePath}`);
      return false;
    }
    
    // 检查文件是否包含giscus
    if (!content.includes('giscus.app/client.js') && !content.includes('giscus-container')) {
      console.log(`文件不包含Giscus评论，跳过: ${filePath}`);
      return false;
    }
    
    // 找到</head>标签，在其前面插入脚本标签
    const headEndIndex = content.lastIndexOf('</head>');
    if (headEndIndex === -1) {
      console.log(`文件中找不到</head>标签: ${filePath}`);
      return false;
    }
    
    // 插入脚本标签
    const newContent = content.slice(0, headEndIndex) + iframeInjectorTag + content.slice(headEndIndex);
    
    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`已添加样式注入脚本: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`处理文件错误: ${filePath}`, error);
    return false;
  }
}

/**
 * 主函数 - 执行所有Giscus样式修复任务
 */
function main() {
  console.log('开始修复Giscus评论区样式问题...');
  
  // 获取所有HTML文件
  const htmlFiles = getAllHTMLFiles();
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  // 统计各项任务的更新计数
  let marginUpdateCount = 0;
  let inlineScriptCount = 0;
  let iframeInjectorCount = 0;
  
  // 处理每个HTML文件
  htmlFiles.forEach(filePath => {
    // 1. 更新HTML文件中的Giscus评论区边距
    if (updateGiscusMargins(filePath)) {
      marginUpdateCount++;
    }
    
    // 2. 添加内联脚本
    if (addInlineScript(filePath)) {
      inlineScriptCount++;
    }
    
    // 3. 添加iframe样式注入器脚本
    if (addIframeInjectorScript(filePath)) {
      iframeInjectorCount++;
    }
  });
  
  // 显示任务结果
  console.log('\n所有修复脚本已执行完成！');
  console.log(`更新Giscus评论区边距: ${marginUpdateCount} 个文件`);
  console.log(`添加内联样式脚本: ${inlineScriptCount} 个文件`);
  console.log(`添加iframe样式注入器: ${iframeInjectorCount} 个文件`);
  console.log('\n请刷新网站页面并检查评论区样式是否正确。');
  console.log('如果问题仍然存在，请检查浏览器开发者工具中的控制台输出。');
}

// 执行主函数
main(); 