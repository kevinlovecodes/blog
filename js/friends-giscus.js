// 友链页面评论区样式处理
document.addEventListener('DOMContentLoaded', function() {
  // 确保在友链页面上执行
  if (!document.body.classList.contains('friends-page')) {
    return;
  }

  // 立即执行一次
  adjustCommentMargins();
  
  // 在页面加载完成后执行
  window.addEventListener('load', function() {
    // 立即执行
    adjustCommentMargins();
    
    // 延迟1秒再执行一次，确保所有内容都已加载
    setTimeout(adjustCommentMargins, 1000);
  });
  
  // 创建MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    // 检查是否有iframe被添加到页面
    let shouldAdjust = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
            shouldAdjust = true;
            
            // 监听iframe加载完成事件
            node.addEventListener('load', function() {
              adjustCommentMargins();
              // 延迟100ms再执行一次
              setTimeout(adjustCommentMargins, 100);
            });
          }
        }
      }
    });
    
    if (shouldAdjust) {
      adjustCommentMargins();
    }
  });
  
  // 启动观察器
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // 周期性检查（10秒内每500ms检查一次）
  let checkCount = 0;
  const checkInterval = setInterval(function() {
    adjustCommentMargins();
    checkCount++;
    if (checkCount >= 20) { // 10秒
      clearInterval(checkInterval);
    }
  }, 500);
});

// 调整评论区边距的函数
function adjustCommentMargins() {
  // 选择评论区容器
  const container = document.querySelector('div[style*="max-width: 800px"]');
  if (container) {
    container.style.setProperty('margin-bottom', '10px', 'important');
    console.log('已设置友链页面评论区容器底部边距为10px');
  }
  
  // 选择giscus容器
  const giscusContainer = document.querySelector('.giscus-container');
  if (giscusContainer) {
    giscusContainer.style.setProperty('margin-bottom', '10px', 'important');
    
    // 获取父元素
    const parent = giscusContainer.parentElement;
    if (parent) {
      parent.style.setProperty('margin-bottom', '10px', 'important');
    }
  }
  
  // 处理iframe
  const iframe = document.querySelector('iframe.giscus-frame');
  if (iframe) {
    iframe.style.setProperty('margin-bottom', '10px', 'important');
    
    // 获取父元素链
    let currentElement = iframe;
    for (let i = 0; i < 3; i++) { // 向上查找3层父元素
      currentElement = currentElement.parentElement;
      if (currentElement) {
        currentElement.style.setProperty('margin-bottom', '10px', 'important');
      } else {
        break;
      }
    }
    
    // 如果iframe中有内容，也调整其中的边距
    try {
      if (iframe.contentDocument && iframe.contentDocument.body) {
        const style = document.createElement('style');
        style.textContent = `
          .gsc-comments {
            margin-bottom: 10px !important;
          }
          .gsc-comment-box {
            margin-bottom: 10px !important;
          }
        `;
        iframe.contentDocument.head.appendChild(style);
      }
    } catch (e) {
      console.error('无法访问iframe内容:', e);
    }
  }
  
  // 调整页脚与评论区之间的间距
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.setProperty('margin-top', '10px', 'important');
  }
  
  // 确保页面底部有适当的空白
  const containers = document.querySelectorAll('.container');
  if (containers.length > 0) {
    const lastContainer = containers[containers.length - 1];
    lastContainer.style.setProperty('margin-bottom', '10px', 'important');
  }
} 