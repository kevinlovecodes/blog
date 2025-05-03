const fs = require('fs');
const path = require('path');

// 要添加的脚本标记
const scriptTag = `
  <!-- Giscus iframe样式注入器 -->
  <script src="/iframe-style-injector.js"></script>
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

// 向HTML文件添加脚本标签
function addScriptToHTML(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否已经包含该脚本
    if (content.includes('iframe-style-injector.js')) {
      console.log(`文件已包含样式注入脚本: ${filePath}`);
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
    const newContent = content.slice(0, headEndIndex) + scriptTag + content.slice(headEndIndex);
    
    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`已添加样式注入脚本: ${filePath}`);
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
    if (addScriptToHTML(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`完成添加样式注入脚本，共更新了 ${updatedCount} 个文件`);
}

// 执行主函数
main(); 