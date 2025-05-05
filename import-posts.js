const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// 检查是否需要操作远程数据库
const isRemote = process.argv.includes('--remote');

// 读取search.json文件
const searchJsonPath = path.join(__dirname, 'my-blog', 'search.json');
const data = JSON.parse(fs.readFileSync(searchJsonPath, 'utf8'));

// 提取文章元数据
const posts = data.map(post => {
  // 从URL中提取slug
  const slug = post.url.split('/').pop();
  
  return {
    title: post.title,
    slug: slug || post.url.replace(/\//g, '-').substring(1),
    created_at: post.url.split('/').slice(1, 4).join('-') // 从URL提取日期
  };
});

// 准备SQL命令
async function insertData() {
  try {
    console.log(`共找到 ${posts.length} 篇文章，开始导入到数据库...`);
    
    for (let post of posts) {
      const command = `npx wrangler d1 execute blog-meta --command="INSERT INTO posts (title, slug, created_at) VALUES ('${post.title.replace(/'/g, "''")}', '${post.slug.replace(/'/g, "''")}', '${post.created_at}');"${isRemote ? ' --remote' : ''}`;
      
      try {
        const { stdout, stderr } = await execPromise(command);
        console.log(`插入文章: ${post.title}`);
        if (stdout) console.log(`输出: ${stdout}`);
        if (stderr) console.error(`错误: ${stderr}`);
      } catch (err) {
        console.error(`插入文章 "${post.title}" 时出错: ${err.message}`);
      }
    }
    
    console.log('完成! 所有文章元数据已导入到数据库');
    console.log('你可以使用以下命令查询数据:');
    console.log(`npx wrangler d1 execute blog-meta --command="SELECT * FROM posts;"${isRemote ? ' --remote' : ''}`);
  } catch (error) {
    console.error(`执行过程中出错: ${error.message}`);
  }
}

// 执行导入
insertData();
