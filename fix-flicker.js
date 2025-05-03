const fs = require('fs');
const path = require('path');

// 防闪动修复脚本
const ANTI_FLICKER_SCRIPT = `
<!-- 防止评论区闪动的样式和脚本 -->
<style id="anti-flicker-styles">
  /* 预设评论区样式，避免加载过程中的闪动 */
  div[style*="max-width: 800px"] {
    max-width: 800px !important;
    margin: 50px auto 10px !important;
    padding: 0 16px !important;
    transition: none !important;
    animation: none !important;
  }
  
  /* 确保所有giscus相关元素都有固定样式 */
  .giscus-container, 
  iframe.giscus-frame,
  .giscus,
  .giscus-wrapper {
    margin-bottom: 10px !important;
    transition: none !important;
    animation: none !important;
  }
  
  /* 隐藏评论区直到完全加载 */
  .giscus-frame-wrapper {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  /* 当加载完成后显示 */
  .giscus-frame-wrapper.loaded {
    opacity: 1;
  }
</style>

<script>
(function() {
  // 只在页面完全加载后应用一次样式，减少闪动
  window.addEventListener('load', function() {
    console.log('防闪动脚本已加载，应用固定样式');
    
    // 一次性设置所有样式，避免多次DOM操作
    const commentContainer = document.querySelector('div[style*="max-width: 800px"]');
    if (commentContainer) {
      // 使用cssText一次性设置所有样式，减少重绘
      commentContainer.style.cssText = 'max-width: 800px !important; margin: 50px auto 10px !important; padding: 0 16px !important;';
    }
    
    // 延迟一小段时间后显示评论区
    setTimeout(function() {
      const frameWrappers = document.querySelectorAll('.giscus-frame-wrapper');
      frameWrappers.forEach(wrapper => {
        wrapper.classList.add('loaded');
      });
    }, 500);
  });
  
  // 监听iframe加载完成事件
  document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          for (const node of mutation.addedNodes) {
            if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
              // iframe已加载，包装它以控制显示
              const parent = node.parentElement;
              if (parent && !parent.classList.contains('giscus-frame-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'giscus-frame-wrapper';
                node.parentNode.insertBefore(wrapper, node);
                wrapper.appendChild(node);
                
                // 监听iframe加载完成
                node.addEventListener('load', function() {
                  setTimeout(function() {
                    wrapper.classList.add('loaded');
                  }, 300);
                });
              }
            }
          }
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
</script>
`;

// 处理HTML文件
function processHTMLFile(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // 检查脚本是否已存在
    if (htmlContent.includes('防止评论区闪动的样式和脚本')) {
      console.log('防闪动脚本已存在，将更新');
      // 删除旧脚本
      htmlContent = htmlContent.replace(/<!-- 防止评论区闪动的样式和脚本 -->[\s\S]*?<\/script>/g, '');
    }
    
    // 在</head>标签前添加防闪动样式和脚本
    htmlContent = htmlContent.replace('</head>', ANTI_FLICKER_SCRIPT + '\n</head>');
    
    // 直接修复评论区容器样式
    htmlContent = htmlContent.replace(
      /<div style="max-width: 800px; margin:[^>]*>/g, 
      '<div style="max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;">'
    );
    
    // 保存修改后的文件
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`文件已成功更新: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`处理文件时出错: ${err.message}`);
    return false;
  }
}

// 主函数
function main() {
  const friendsPagePath = path.join(__dirname, 'friends', 'index.html');
  
  if (!fs.existsSync(friendsPagePath)) {
    console.error('找不到友链页面文件！');
    return;
  }
  
  if (processHTMLFile(friendsPagePath)) {
    console.log('✅ 友链页面评论区防闪动修复成功！');
    console.log('请清除浏览器缓存并刷新页面查看效果');
    console.log('如果问题仍然存在，请在Cloudflare控制面板中清除缓存');
  } else {
    console.error('❌ 友链页面防闪动修复失败！');
  }
}

// 执行主函数
main(); 