const fs = require('fs');
const path = require('path');

// 内联脚本，用于强制设置评论区样式
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

// 查找所有HTML文件
function findHTMLFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findHTMLFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
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

// 向HTML文件添加内联脚本
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

// 主函数
function main() {
  // 获取脚本所在目录
  const baseDir = process.cwd();
  console.log(`当前工作目录: ${baseDir}`);
  
  // 获取需要处理的目录
  const dirs = [
    path.join(baseDir, '2024'),
    path.join(baseDir, '2025'),
    path.join(baseDir, 'archives'),
    path.join(baseDir, 'categories'),
    path.join(baseDir, 'tags'),
    path.join(baseDir, 'page'),
    path.join(baseDir, 'about'),
    path.join(baseDir, 'friends'),
    path.join(baseDir, 'search')
  ];
  
  // 查找所有HTML文件
  let htmlFiles = [];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = findHTMLFiles(dir, []);
      htmlFiles = htmlFiles.concat(files);
    } else {
      console.log(`目录不存在: ${dir}`);
    }
  });
  
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  // 处理每个HTML文件
  let updatedCount = 0;
  htmlFiles.forEach(filePath => {
    if (addInlineScript(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`完成添加/更新内联样式脚本，共更新了 ${updatedCount} 个文件`);
}

// 执行主函数
main(); 