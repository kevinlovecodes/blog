// 强制设置友链页面评论区样式的脚本
const fs = require('fs');
const path = require('path');

// 内联脚本，使用!important强制应用样式
const inlineScript = `
<!-- 强制设置友链页面评论区样式的脚本 -->
<script>
(function() {
  // 检查是否在友链页面
  const isFriendsPage = window.location.pathname.includes('/friends/');
  if (!isFriendsPage) return;
  
  console.log('友链页面间距修复脚本已加载');
  
  // 立即执行一次
  applyFriendPageStyles();
  
  // DOM加载完成后执行
  document.addEventListener('DOMContentLoaded', applyFriendPageStyles);
  
  // 页面完全加载后多次执行
  window.addEventListener('load', function() {
    applyFriendPageStyles();
    
    // 延迟执行多次，确保样式被应用
    setTimeout(applyFriendPageStyles, 500);
    setTimeout(applyFriendPageStyles, 1000);
    setTimeout(applyFriendPageStyles, 2000);
    setTimeout(applyFriendPageStyles, 3000);
  });
  
  // 创建MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    let shouldApply = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          // 检查是否是iframe或其他giscus相关元素
          if ((node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) ||
              (node.classList && node.classList.contains('giscus-container')) ||
              (node.id && node.id.includes('giscus'))) {
            shouldApply = true;
            break;
          }
        }
      }
    });
    
    if (shouldApply) {
      applyFriendPageStyles();
      // 延迟再次应用确保样式生效
      setTimeout(applyFriendPageStyles, 100);
    }
  });
  
  // 启动观察器
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // 应用样式的函数
  function applyFriendPageStyles() {
    // 强制添加friends-page类，以防万一
    document.body.classList.add('friends-page');
    
    // 直接创建样式元素并添加到页面，确保样式被应用
    const styleEl = document.createElement('style');
    styleEl.id = 'force-friends-margins-style';
    styleEl.textContent = \`
      /* 友链页面评论区样式 */
      .giscus-container, 
      iframe.giscus-frame, 
      div[style*="max-width: 800px"],
      .giscus,
      .giscus-wrapper,
      .giscus-frame-wrapper,
      .giscus + *,
      .giscus-container + * {
        margin-bottom: 10px !important;
      }
      
      /* 评论区容器 */
      .post-prev-next + div,
      div[style*="max-width: 800px"] {
        margin-top: 50px !important;
        margin-bottom: 10px !important;
      }
      
      /* 页脚与评论区间距 */
      footer {
        margin-top: 10px !important;
      }
    \`;
    
    // 如果样式元素已存在，先移除
    const existingStyle = document.getElementById('force-friends-margins-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // 添加样式到头部
    document.head.appendChild(styleEl);
    
    // 直接选择并设置所有可能的评论区元素样式
    const selectors = [
      '.giscus-container', 
      'iframe.giscus-frame', 
      'div[style*="max-width: 800px"]',
      '.giscus', 
      '.giscus-wrapper',
      '.post-prev-next + div'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          // 评论区顶部间距
          el.style.setProperty('margin-top', selector.includes('post-prev-next') ? '50px' : 'inherit', 'important');
          // 评论区底部间距统一为10px
          el.style.setProperty('margin-bottom', '10px', 'important');
          console.log(\`已强制设置 \${selector} 的底部间距为10px\`);
        });
      }
    });
    
    // 处理iframe事件
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
      console.log('已找到giscus iframe，设置加载事件');
      
      // 设置iframe加载事件
      iframe.addEventListener('load', function() {
        try {
          if (iframe.contentDocument) {
            const style = document.createElement('style');
            style.textContent = \`
              /* 在iframe内部应用样式 */
              body, .gsc-comments, .gsc-comment-box {
                margin-bottom: 10px !important;
              }
            \`;
            iframe.contentDocument.head.appendChild(style);
            console.log('已向iframe内部注入样式');
          }
        } catch (e) {
          console.error('无法访问iframe内容:', e);
        }
      });
    }
    
    // 使用内联样式直接修改评论区容器
    const commentContainer = document.querySelector('div[style*="max-width: 800px"]');
    if (commentContainer) {
      commentContainer.setAttribute('style', 'max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;');
      console.log('已直接修改评论区容器的内联样式');
    }
  }
})();
</script>
`;

// 处理HTML文件的函数
function processHTMLFile(filePath) {
  try {
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否是友链页面
    if (filePath.includes('friends')) {
      console.log(`处理友链页面: ${filePath}`);
      
      // 检查脚本是否已存在
      if (htmlContent.includes('强制设置友链页面评论区样式的脚本')) {
        console.log('脚本已存在，将更新');
        
        // 使用正则表达式替换已存在的脚本
        const scriptRegex = /<!-- 强制设置友链页面评论区样式的脚本 -->[\s\S]*?<\/script>/;
        htmlContent = htmlContent.replace(scriptRegex, inlineScript);
      } else {
        console.log('添加新脚本');
        
        // 在</body>标签前插入内联脚本
        htmlContent = htmlContent.replace('</body>', `${inlineScript}\n</body>`);
      }
      
      // 确保有friends-page类
      if (!htmlContent.includes('class="friends-page"')) {
        htmlContent = htmlContent.replace('<body', '<body class="friends-page"');
      }
      
      // 修改评论区容器的样式
      const commentContainerRegex = /<div style="max-width: 800px; margin:[^>]*>/;
      htmlContent = htmlContent.replace(commentContainerRegex, '<div style="max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;">');
      
      // 保存修改后的文件
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log(`已更新文件: ${filePath}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`处理文件 ${filePath} 时出错:`, err);
    return false;
  }
}

// 修复友链页面评论区间距
function fixFriendsPageMargins() {
  const friendsPagePath = path.join(__dirname, 'friends', 'index.html');
  
  if (fs.existsSync(friendsPagePath)) {
    const success = processHTMLFile(friendsPagePath);
    if (success) {
      console.log('友链页面评论区间距修复成功！请刷新页面查看效果。');
    } else {
      console.log('友链页面评论区间距修复失败！');
    }
  } else {
    console.error('找不到友链页面，请确认路径是否正确。');
  }
}

// 执行修复
fixFriendsPageMargins(); 