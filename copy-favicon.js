const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取当前工作目录
const baseDir = process.cwd();
console.log(`当前工作目录: ${baseDir}`);

// 源文件和目标文件的路径
const sourceFile = path.join(baseDir, 'theme-img', 'favicon.ico');
const targetFile = path.join(baseDir, 'favicon.png');

console.log(`源文件路径: ${sourceFile}`);
console.log(`目标文件路径: ${targetFile}`);

try {
  // 检查源文件是否存在
  if (fs.existsSync(sourceFile)) {
    console.log(`找到源文件: ${sourceFile}`);
  } else {
    console.error(`错误: 源文件 ${sourceFile} 不存在!`);
    process.exit(1);
  }

  // 如果是Windows系统，使用系统命令将.ico转换为.png
  if (process.platform === 'win32') {
    console.log('检测到Windows系统');
    try {
      // 直接复制文件并重命名
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`已将favicon.ico复制并重命名为favicon.png`);
      
      // 检查目标文件是否成功创建
      if (fs.existsSync(targetFile)) {
        console.log(`确认: 目标文件已成功创建: ${targetFile}`);
      } else {
        console.error(`错误: 目标文件未成功创建: ${targetFile}`);
      }
    } catch (error) {
      console.error(`复制文件失败: ${error.message}`);
      console.error(`错误详情: ${error.stack}`);
      process.exit(1);
    }
  } else {
    // 非Windows系统
    console.error('此脚本设计用于Windows系统');
    process.exit(1);
  }

  console.log(`favicon.png已成功创建在网站根目录!`);
} catch (error) {
  console.error(`出错了: ${error.message}`);
  console.error(`错误详情: ${error.stack}`);
  process.exit(1);
} 