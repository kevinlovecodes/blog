// 这个脚本将自动为所有文章添加giscus评论

const fs = require('fs');
const path = require('path');

// giscus评论代码（不包含评论标题）
const giscusCode = `
<!-- 嵌入giscus评论 -->
<div style="max-width: 800px; margin: 40px auto 10px; padding: 0 16px;">
  <div class="giscus-container">
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

<script>
// 主题切换监听和处理
(function() {
  // 全局变量存储当前加载状态和上次主题
  let giscusReady = false;
  let lastTheme = '';
  let waitingForIframe = false;
  let checkInterval = null;
  
  function updateGiscusTheme(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) {
      // 如果iframe不存在且没有开始等待，启动轮询检查
      if (!waitingForIframe) {
        waitingForIframe = true;
        startPollingForIframe(theme);
      }
      return;
    }
    
    let giscusTheme = 'light';
    if (theme === 'dark') {
      giscusTheme = 'dark';
    } else if (theme === 'auto') {
      giscusTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // 只有当主题变化时才发送消息
    if (lastTheme !== giscusTheme) {
      lastTheme = giscusTheme;
      try {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          'https://giscus.app'
        );
        console.log('Giscus theme updated to:', giscusTheme);
      } catch (e) {
        console.error('Failed to update giscus theme:', e);
      }
    }
    
    // 标记giscus已经就绪
    giscusReady = true;
    
    // 如果轮询存在，清除它
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }
  
  // 轮询检查iframe是否已加载
  function startPollingForIframe(theme) {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    
    // 每100ms检查一次iframe是否存在
    checkInterval = setInterval(() => {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe) {
        updateGiscusTheme(theme);
        clearInterval(checkInterval);
        checkInterval = null;
        waitingForIframe = false;
      }
    }, 100);
    
    // 60秒后如果还没找到就停止轮询
    setTimeout(() => {
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
        waitingForIframe = false;
        console.log('Gave up waiting for giscus iframe');
      }
    }, 60000);
  }

  // 添加主题切换事件处理
  function addThemeListeners() {
    // 单独监听每个主题按钮的变化
    const allRadios = document.querySelectorAll('input[name="theme"]');
    allRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          updateGiscusTheme(this.value);
        }
      });
    });
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function() {
      const currentTheme = document.documentElement.getAttribute('data-color-scheme');
      if (currentTheme === 'auto') {
        updateGiscusTheme('auto');
      }
    });
    
    // 监听颜色方案变化
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-scheme') {
          updateGiscusTheme(document.documentElement.getAttribute('data-color-scheme'));
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-color-scheme'] 
    });
  }
  
  // 设置iframe加载监听
  function setupIframeListener() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(function(node) {
            if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
              // iframe已加载，立即更新主题
              const currentTheme = document.documentElement.getAttribute('data-color-scheme');
              updateGiscusTheme(currentTheme);
              
              // 添加iframe加载完成事件监听
              node.addEventListener('load', function() {
                // iframe内容完全加载后，再次更新主题以确保设置正确
                setTimeout(() => {
                  updateGiscusTheme(document.documentElement.getAttribute('data-color-scheme'));
                }, 300);
              });
            }
          });
        }
      });
    });
    
    // 开始观察body的变化
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // 初始化函数
  function initialize() {
    setupIframeListener();
    addThemeListeners();
    
    // 页面加载完成后再次尝试更新主题
    window.addEventListener('load', function() {
      setTimeout(() => {
        updateGiscusTheme(document.documentElement.getAttribute('data-color-scheme'));
      }, 500);
    });
  }
  
  // 根据页面加载状态运行初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
</script>
`;

// 查找所有文章文件
function findArticleFiles(dir, fileList = []) {
  console.log(`正在搜索目录: ${dir}`);
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findArticleFiles(filePath, fileList);
        } else if (file === 'index.html' && (filePath.includes('\\2024\\') || filePath.includes('\\2025\\'))) {
          console.log(`找到文章文件: ${filePath}`);
          fileList.push(filePath);
        }
      } catch (err) {
        console.error(`无法访问文件: ${filePath}`, err);
      }
    });
  } catch (err) {
    console.error(`无法读取目录: ${dir}`, err);
  }
  
  return fileList;
}

// 向文章添加giscus评论
function addGiscusToArticle(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否已经包含giscus评论
    if (content.includes('giscus.app/client.js')) {
      console.log(`文件已包含giscus评论: ${filePath}`);
      
      // 替换旧的giscus代码为新的代码
      const articleEndTag = '</article>';
      const footerStartTag = '<footer>';
      
      // 查找</article>和<footer>之间的内容
      const startIndex = content.indexOf(articleEndTag) + articleEndTag.length;
      const endIndex = content.indexOf(footerStartTag);
      
      if (startIndex > 0 && endIndex > startIndex) {
        // 替换整个评论区
        const newContent = content.substring(0, startIndex) + giscusCode + content.substring(endIndex);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`已更新giscus评论: ${filePath}`);
      } else {
        console.log(`无法找到合适的位置更新giscus: ${filePath}`);
      }
      
      return;
    }
    
    // 查找插入位置（在</article>之后）
    const insertPoint = content.indexOf('</article>');
    if (insertPoint === -1) {
      console.log(`无法找到插入位置: ${filePath}`);
      return;
    }
    
    // 插入giscus评论代码
    const newContent = content.slice(0, insertPoint + 10) + giscusCode + content.slice(insertPoint + 10);
    
    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`已添加giscus评论: ${filePath}`);
  } catch (error) {
    console.error(`处理文件错误: ${filePath}`, error);
  }
}

// 主函数
function main() {
  // 获取脚本所在目录
  const baseDir = process.cwd();
  console.log(`当前工作目录: ${baseDir}`);
  
  // 获取2024和2025目录
  const dirs = [
    path.join(baseDir, '2024'),
    path.join(baseDir, '2025')
  ];
  
  // 查找所有文章文件
  let articleFiles = [];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = findArticleFiles(dir, []);
      articleFiles = articleFiles.concat(files);
    } else {
      console.log(`目录不存在: ${dir}`);
    }
  });
  
  console.log(`找到 ${articleFiles.length} 个文章文件`);
  
  // 处理每个文章文件
  articleFiles.forEach(filePath => {
    addGiscusToArticle(filePath);
  });
  
  console.log('完成添加giscus评论');
}

// 执行主函数
main(); 