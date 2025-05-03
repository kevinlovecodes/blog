// 这个脚本将在iframe加载后注入样式到giscus iframe内部
document.addEventListener('DOMContentLoaded', setupIframeStyleInjector);
window.addEventListener('load', setupIframeStyleInjector);

// 设置MutationObserver来监听DOM变化
function setupIframeStyleInjector() {
  console.log('设置iframe样式注入器...');
  
  // 尝试立即应用
  injectStyleToGiscusIframe();
  
  // 创建MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
            console.log('检测到giscus iframe加载');
            
            // 等待iframe完全加载
            node.addEventListener('load', function() {
              console.log('giscus iframe已加载，注入样式...');
              injectStyleToIframe(node);
            });
            
            // 立即尝试注入（有些情况下load事件可能已经触发）
            injectStyleToIframe(node);
          }
        }
      }
    });
  });
  
  // 启动观察器，监视整个body的变化
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // 每500ms检查并尝试注入样式，持续10秒
  let checkCount = 0;
  const intervalId = setInterval(function() {
    injectStyleToGiscusIframe();
    checkCount++;
    if (checkCount >= 20) { // 10秒
      clearInterval(intervalId);
    }
  }, 500);
}

// 查找所有giscus iframe并注入样式
function injectStyleToGiscusIframe() {
  const iframes = document.querySelectorAll('iframe.giscus-frame');
  if (iframes && iframes.length > 0) {
    iframes.forEach(iframe => {
      injectStyleToIframe(iframe);
    });
  }
}

// 向指定iframe注入样式
function injectStyleToIframe(iframe) {
  try {
    // 确保iframe已完全加载且可访问
    if (!iframe.contentDocument) {
      console.log('iframe尚未加载完成或无法访问内容');
      return;
    }
    
    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
      /* giscus iframe内部样式 */
      .gsc-header {
        margin-top: 20px !important;
        padding-bottom: 10px !important;
      }
      
      .gsc-reactions {
        margin-top: 10px !important;
        margin-bottom: 10px !important;
      }
      
      .gsc-comments {
        margin-top: 20px !important;
      }
      
      .gsc-comment-box-separator {
        margin-top: 15px !important;
        margin-bottom: 15px !important;
      }
      
      .gsc-comment-box {
        margin-top: 10px !important;
        margin-bottom: 10px !important;
      }
      
      .gsc-timeline {
        margin-top: 15px !important;
      }
      
      /* 减少评论区内的多余空间 */
      .gsc-comment {
        padding-top: 12px !important;
        padding-bottom: 12px !important;
      }
      
      /* 调整评论区标题间距 */
      .gsc-comments > .gsc-header {
        margin-bottom: 10px !important;
      }
      
      /* 评论输入框调整 */
      .gsc-comment-box {
        margin-top: 20px !important;
        margin-bottom: 10px !important;
      }
    `;
    
    // 将样式添加到iframe的document中
    if (iframe.contentDocument.head) {
      iframe.contentDocument.head.appendChild(style);
      console.log('成功注入样式到iframe内部');
      
      // 设置iframe容器的样式
      const parentDiv = iframe.parentElement;
      if (parentDiv) {
        parentDiv.style.setProperty('margin-top', '50px', 'important');
        parentDiv.style.setProperty('margin-bottom', '10px', 'important');
        console.log('设置iframe父容器样式');
        
        // 设置祖父元素样式
        const grandParent = parentDiv.parentElement;
        if (grandParent) {
          grandParent.style.setProperty('margin-top', '50px', 'important');
          grandParent.style.setProperty('margin-bottom', '10px', 'important');
        }
      }
    } else {
      console.log('无法访问iframe的head元素');
    }
  } catch (error) {
    console.error('注入样式到iframe时出错:', error);
  }
} 