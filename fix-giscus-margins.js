const fs = require('fs');
const path = require('path');

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

// 更新HTML文件中的Giscus评论区样式
function updateGiscusMargins(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找Giscus评论区容器
    const oldStyleRegex = /<div style="max-width: 800px; margin: (.*?); padding: 0 16px;">/g;
    
    if (content.match(oldStyleRegex)) {
      // 替换为新的样式
      const newContent = content.replace(oldStyleRegex, 
        '<div style="max-width: 800px; margin: 50px auto 10px !important; padding: 0 16px;">');
      
      // 写入文件
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`已更新Giscus评论区样式: ${filePath}`);
      return true;
    } else {
      console.log(`文件中没有找到Giscus评论区: ${filePath}`);
      return false;
    }
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
    if (updateGiscusMargins(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`完成更新Giscus评论区样式，共更新了 ${updatedCount} 个文件`);
}

// 执行主函数
main(); 