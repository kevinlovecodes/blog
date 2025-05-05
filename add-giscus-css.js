const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 需要添加的CSS引用代码
const cssLinkCode = `  <!-- Giscus评论样式 -->
  <link rel="stylesheet" href="/css/giscus-custom.css">`;

// 查找所有HTML文件
function findHTMLFiles(dir, fileList = []) {
  console.log(`正在搜索目录: ${dir}`);
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findHTMLFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
          console.log(`找到HTML文件: ${filePath}`);
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

// 向HTML文件添加CSS引用
function addCSSLink(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否已经包含该CSS引用
    if (content.includes('giscus-custom.css')) {
      console.log(`文件已包含Giscus样式引用: ${filePath}`);
      return;
    }
    
    // 查找插入位置（在custom.css引用之后）
    const searchStr = 'link rel="stylesheet" href="/css/custom.css">';
    const insertPoint = content.indexOf(searchStr);
    
    if (insertPoint === -1) {
      console.log(`无法找到插入位置: ${filePath}`);
      return;
    }
    
    // 插入CSS引用代码
    const insertPosition = insertPoint + searchStr.length;
    const newContent = content.slice(0, insertPosition) + '\n' + cssLinkCode + content.slice(insertPosition);
    
    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`已添加Giscus样式引用: ${filePath}`);
  } catch (error) {
    console.error(`处理文件错误: ${filePath}`, error);
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
  htmlFiles.forEach(filePath => {
    addCSSLink(filePath);
  });
  
  console.log('完成添加Giscus样式引用');
}

// 执行主函数
main(); 