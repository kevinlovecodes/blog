const fs = require('fs');
const path = require('path');

// 友链页面的评论区HTML模板
const COMMENT_SECTION_HTML = `
    <!-- 嵌入giscus评论 -->
    <div style="max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;">
      <div class="giscus-container" style="margin-bottom: 10px !important;">
        <script>
          // 立即执行获取当前主题并设置giscus的主题
          (function() {
            // 获取当前主题
            function getCurrentTheme() {
              const theme = document.documentElement.getAttribute('data-color-scheme');
              if (theme === 'dark') return 'dark';
              if (theme === 'light') return 'light';
              // 如果是auto，则根据系统主题决定
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            // 设置giscus的主题属性
            document.write('<script src="https://giscus.app/client.js" \\
              data-repo="kevinlovecodes/blog" \\
              data-repo-id="R_kgDOOjvubQ" \\
              data-category="Announcements" \\
              data-category-id="DIC_kwDOOjvubc4CpufH" \\
              data-mapping="pathname" \\
              data-strict="0" \\
              data-reactions-enabled="1" \\
              data-emit-metadata="0" \\
              data-input-position="bottom" \\
              data-theme="' + getCurrentTheme() + '" \\
              data-lang="zh-CN" \\
              data-loading="lazy" \\
              crossorigin="anonymous" \\
              async><\\/script>');
          })();
        </script>
      </div>
    </div>

    <!-- 强制设置评论区样式 -->
    <style id="forced-giscus-style">
      /* 评论区底部边距 */
      .giscus-container, 
      iframe.giscus-frame,
      div[style*="max-width: 800px"],
      .giscus,
      .giscus-wrapper {
        margin-bottom: 10px !important;
      }
    </style>
    
    <script>
    // 强制设置评论区样式
    (function() {
      console.log('友链页面评论区样式修复脚本已加载');
      
      // 立即执行
      fixCommentMargins();
      
      // DOM加载完成后执行
      document.addEventListener('DOMContentLoaded', fixCommentMargins);
      
      // 页面加载完成后执行
      window.addEventListener('load', function() {
        fixCommentMargins();
        // 延迟执行以确保所有内容加载完成
        setTimeout(fixCommentMargins, 500);
        setTimeout(fixCommentMargins, 1000);
        setTimeout(fixCommentMargins, 2000);
      });
      
      // 应用样式函数
      function fixCommentMargins() {
        // 直接修改评论区容器
        const commentContainer = document.querySelector('div[style*="max-width: 800px"]');
        if (commentContainer) {
          commentContainer.setAttribute('style', 'max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px !important;');
        }
        
        // 修改所有评论区相关元素
        const selectors = [
          '.giscus-container', 
          'iframe.giscus-frame', 
          '.giscus',
          '.giscus-wrapper'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.style.setProperty('margin-bottom', '10px', 'important');
          });
        });
      }
    })();
    </script>
`;

// 处理HTML文件的函数
function processFriendsPage(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    
    // 读取HTML文件内容
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // 查找评论区开始和结束的位置
    const commentSectionStartPattern = /<!-- 嵌入giscus评论 -->/;
    const commentSectionEndPattern = /<footer>/;
    
    const commentSectionStartMatch = htmlContent.match(commentSectionStartPattern);
    const commentSectionEndMatch = htmlContent.match(commentSectionEndPattern);
    
    if (!commentSectionStartMatch || !commentSectionEndMatch) {
      console.error('无法找到评论区或页脚标记！');
      return false;
    }
    
    // 提取评论区前后的内容
    const contentBeforeComment = htmlContent.substring(0, commentSectionStartMatch.index);
    const contentAfterComment = htmlContent.substring(commentSectionEndMatch.index);
    
    // 重建HTML文件
    const newHtmlContent = contentBeforeComment + COMMENT_SECTION_HTML + contentAfterComment;
    
    // 保存新的HTML文件
    fs.writeFileSync(filePath, newHtmlContent, 'utf8');
    console.log(`已成功重建文件: ${filePath}`);
    
    return true;
  } catch (err) {
    console.error(`处理文件时出错: ${err.message}`);
    return false;
  }
}

// 创建备份文件
function createBackup(filePath) {
  try {
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`已创建备份: ${backupPath}`);
    return true;
  } catch (err) {
    console.error(`创建备份时出错: ${err.message}`);
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
  
  // 创建备份
  if (!createBackup(friendsPagePath)) {
    console.error('创建备份失败，中止操作！');
    return;
  }
  
  // 处理文件
  if (processFriendsPage(friendsPagePath)) {
    console.log('✅ 友链页面评论区重建成功！');
    console.log('请运行 hexo clean && hexo g 重新生成网站，然后查看效果。');
    console.log('或者清除浏览器缓存并使用 Ctrl+F5 强制刷新页面。');
  } else {
    console.error('❌ 友链页面重建失败！');
  }
}

// 执行主函数
main(); 