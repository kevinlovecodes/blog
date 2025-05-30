const fs = require('fs');
const path = require('path');

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

/**
 * 获取博客的所有目录路径
 * @returns {Array} - 博客目录路径列表
 */
function getBlogDirectories() {
  const baseDir = process.cwd();
  
  return [
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
}

/**
 * 获取博客中的所有HTML文件
 * @returns {Array} - 所有HTML文件的路径列表
 */
function getAllHTMLFiles() {
  const dirs = getBlogDirectories();
  let htmlFiles = [];
  
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = findHTMLFiles(dir, []);
      htmlFiles = htmlFiles.concat(files);
    } else {
      console.log(`目录不存在: ${dir}`);
    }
  });
  
  return htmlFiles;
}

module.exports = {
  findHTMLFiles,
  getBlogDirectories,
  getAllHTMLFiles
}; 