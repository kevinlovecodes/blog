const fs = require('fs');
const path = require('path');

// 定义页脚上部分的固定标记，用于定位评论区位置
const FOOTER_START_MARKER = '<footer>';

// 处理友链页面的函数
function processHTMLFile(filePath) {
  try {
    console.log(`正在处理: ${filePath}`);
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // 直接替换评论区容器样式
    htmlContent = htmlContent.replace(
      /<div style="max-width: 800px; margin:[^>]*>/g, 
      '<div style="max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;">'
    );
    
    // 寻找评论区结束和页脚开始之间的部分
    const footerIndex = htmlContent.indexOf(FOOTER_START_MARKER);
    if (footerIndex === -1) {
      console.error('无法找到页脚标记！');
      return false;
    }
    
    // 创建我们要注入的脚本
    const inlineScript = `
<script>
(function() {
  console.log('终极修复脚本已加载');
  
  // 立即应用样式
  forceApplyStyles();
  
  // 页面加载时再次应用
  window.addEventListener('load', function() {
    forceApplyStyles();
    setTimeout(forceApplyStyles, 1000);
    setTimeout(forceApplyStyles, 2000);
  });
  
  // 强制应用样式函数
  function forceApplyStyles() {
    // 直接获取评论区容器
    const commentContainer = document.querySelector('div[style*="max-width: 800px"]');
    if (commentContainer) {
      // 直接设置内联样式
      commentContainer.setAttribute('style', 'max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px !important;');
      console.log('直接修改了评论区容器样式');
    }
    
    // 设置iframe样式
    const iframes = document.querySelectorAll('iframe.giscus-frame');
    iframes.forEach(iframe => {
      iframe.style.marginBottom = '10px';
      
      // 设置所有父元素的底部边距
      let parent = iframe.parentElement;
      while (parent && parent !== document.body) {
        parent.style.marginBottom = '10px';
        parent = parent.parentElement;
      }
    });
    
    // 创建一个新的样式元素添加到头部
    const styleEl = document.createElement('style');
    styleEl.textContent = \`
      /* 评论区底部边距强制样式 */
      .giscus-container, 
      iframe.giscus-frame,
      .giscus-frame-wrapper,
      div[style*="max-width: 800px"],
      .giscus,
      .giscus-wrapper {
        margin-bottom: 10px !important;
      }
    \`;
    document.head.appendChild(styleEl);
  }
})();
</script>

<!-- 评论区底部边距内联样式 -->
<style>
.giscus-container, 
iframe.giscus-frame,
.giscus-frame-wrapper,
div[style*="max-width: 800px"],
.giscus,
.giscus-wrapper {
  margin-bottom: 10px !important;
}
</style>
`;

    // 在页脚之前插入我们的脚本
    const modifiedContent = 
      htmlContent.substring(0, footerIndex) + 
      inlineScript + 
      htmlContent.substring(footerIndex);
    
    // 保存修改后的HTML
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`已成功修改文件: ${filePath}`);
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
    console.log('✅ 友链页面评论区间距修复成功！');
    console.log('请清除浏览器缓存并刷新页面查看效果。');
    console.log('您也可以使用 Ctrl+F5 强制刷新页面。');
  } else {
    console.error('❌ 友链页面修复失败！');
  }
}

// 执行主函数
main(); 