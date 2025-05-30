const fs = require('fs');
const path = require('path');
const { getAllHTMLFiles } = require('./giscus/utils');

/**
 * 从HTML文件中移除Hexo生成器标记
 * @param {string} filePath - HTML文件路径
 * @returns {boolean} - 是否成功移除标记
 */
function removeHexoGeneratorTag(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找Hexo生成器标记
    const hexoTagRegex = /<meta name="generator" content="Hexo [^"]*">\s*<\/head>/g;
    
    if (content.match(hexoTagRegex)) {
      // 替换为仅有</head>标签
      const newContent = content.replace(hexoTagRegex, '</head>');
      
      // 写入文件
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`已移除Hexo生成器标记: ${filePath}`);
      return true;
    } else {
      console.log(`文件中没有找到Hexo生成器标记: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`处理文件错误: ${filePath}`, error);
    return false;
  }
}

/**
 * 主函数 - 处理所有HTML文件
 */
function main() {
  console.log('开始移除Hexo生成器标记...');
  
  // 获取所有HTML文件
  const htmlFiles = getAllHTMLFiles();
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  // 统计更新计数
  let updatedCount = 0;
  
  // 处理每个HTML文件
  htmlFiles.forEach(filePath => {
    if (removeHexoGeneratorTag(filePath)) {
      updatedCount++;
    }
  });
  
  // 处理根目录的index.html
  const indexPath = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(indexPath)) {
    if (removeHexoGeneratorTag(indexPath)) {
      updatedCount++;
    }
  }
  
  // 显示任务结果
  console.log('\n所有文件处理完成！');
  console.log(`共移除了 ${updatedCount} 个文件中的Hexo生成器标记`);
}

// 执行主函数
main(); 