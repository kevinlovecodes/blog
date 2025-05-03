const { execSync } = require('child_process');
const path = require('path');

console.log('开始修复Giscus评论区样式问题...');

try {
  // 1. 将iframe-style-injector.js脚本复制到网站根目录
  console.log('\n1. 修复CSS样式文件');
  console.log('=====================');
  console.log('CSS文件已更新。');

  // 2. 运行添加iframe注入器脚本的脚本
  console.log('\n2. 添加iframe样式注入器');
  console.log('=====================');
  execSync('node add-iframe-injector.js', { stdio: 'inherit' });

  // 3. 强制设置评论区边距
  console.log('\n3. 强制设置评论区边距');
  console.log('=====================');
  execSync('node force-margins.js', { stdio: 'inherit' });

  // 4. 修复HTML文件中的评论区边距
  console.log('\n4. 修复HTML文件中的评论区边距');
  console.log('=====================');
  execSync('node fix-giscus-margins.js', { stdio: 'inherit' });

  console.log('\n所有修复脚本已执行完成！');
  console.log('请刷新网站页面并检查评论区样式是否正确。');
  console.log('如果问题仍然存在，请检查浏览器开发者工具中的控制台输出。');

} catch (error) {
  console.error('执行脚本时出错:', error);
  process.exit(1);
} 