const fs = require('fs');
const path = require('path');

/**
 * 从HTML文件中移除Hexo生成器标记
 * @param {string} filePath - HTML文件路径
 * @returns {boolean} - 是否成功移除标记
 */
function removeHexoGeneratorTag(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找Hexo生成器标记 - 修正正则表达式
    const hexoTagRegex = /<meta name="generator" content="Hexo [^"]*">/g;
    
    if (content.match(hexoTagRegex)) {
      // 替换标记
      const newContent = content.replace(hexoTagRegex, '');
      
      // 写入文件
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`已移除Hexo生成器标记: ${filePath}`);
      return true;
    } else {
      console.log(`文件中没有找到Hexo生成器标记: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`处理文件时出错: ${filePath}`, error);
    return false;
  }
}

/**
 * 主函数 - 处理所有HTML文件
 */
function main() {
  console.log('开始移除Hexo生成器标记...');
  
  // 获取所有HTML文件
  const htmlFiles = findHTMLFiles('.');
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  // 统计更新计数
  let updatedCount = 0;
  
  // 处理每个HTML文件
  htmlFiles.forEach(filePath => {
    if (removeHexoGeneratorTag(filePath)) {
      updatedCount++;
    }
    
    // 如果是index.html，还需要检查父目录下是否有index.html
    if (path.basename(filePath) === 'index.html') {
      const indexPath = path.join(path.dirname(filePath), 'index.html');
      if (indexPath !== filePath && fs.existsSync(indexPath)) {
        if (removeHexoGeneratorTag(indexPath)) {
          updatedCount++;
        }
      }
    }
  });
  
  // 显示任务结果
  console.log('\n所有文件处理完成！');
  console.log(`共移除了 ${updatedCount} 个文件中的Hexo生成器标记`);
}

/**
 * 查找所有HTML文件
 * @param {string} dir - 要搜索的目录
 * @param {Array} fileList - 累积的文件列表
 * @returns {Array} - HTML文件列表
 */
function findHTMLFiles(dir, fileList = []) {
  console.log(`正在搜索目录: ${dir}`);
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        
        // 忽略backup目录
        if (filePath.includes('backup')) {
          return;
        }
        
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

// 执行主函数
main(); 