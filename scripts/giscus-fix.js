/**
 * Giscus评论区样式修复主脚本
 * 
 * 此脚本替代了原来的多个脚本，统一处理Giscus评论区的样式问题
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('开始修复Giscus评论区样式问题...');

try {
  // 执行整合后的Giscus样式修复脚本
  console.log('\n执行Giscus样式修复脚本');
  console.log('=====================');
  execSync('node scripts/giscus/fix-giscus-styles.js', { stdio: 'inherit' });

  console.log('\n所有修复脚本已执行完成！');
  console.log('请刷新网站页面并检查评论区样式是否正确。');
  console.log('如果问题仍然存在，请检查浏览器开发者工具中的控制台输出。');

} catch (error) {
  console.error('执行脚本时出错:', error);
  process.exit(1);
} 