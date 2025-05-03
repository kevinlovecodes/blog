// 这个脚本直接在文章页面添加giscus评论
document.addEventListener('DOMContentLoaded', function() {
  // 检测当前页面是否为文章页面
  const isPostPage = document.querySelector('article.post') !== null;
  
  if (isPostPage) {
    // 查找文章底部，在</article>之前插入评论区
    const article = document.querySelector('article.post');
    if (article) {
      // 创建评论标题
      const commentTitle = document.createElement('h2');
      commentTitle.textContent = '评论';
      commentTitle.style.maxWidth = '800px';
      commentTitle.style.margin = '64px auto 24px';
      commentTitle.style.padding = '0 16px';
      article.appendChild(commentTitle);
      
      // 创建评论容器
      const commentContainer = document.createElement('div');
      commentContainer.className = 'giscus-container';
      commentContainer.style.maxWidth = '800px';
      commentContainer.style.margin = '0 auto 32px';
      commentContainer.style.padding = '0 16px';
      article.appendChild(commentContainer);
      
      // 创建并添加giscus脚本
      const giscusScript = document.createElement('script');
      giscusScript.src = 'https://giscus.app/client.js';
      giscusScript.setAttribute('data-repo', 'kevinlovecodes/blog');
      giscusScript.setAttribute('data-repo-id', 'R_kgDOOjvubQ');
      giscusScript.setAttribute('data-category', 'Announcements');
      giscusScript.setAttribute('data-category-id', 'DIC_kwDOOjvubc4CpufH');
      giscusScript.setAttribute('data-mapping', 'pathname');
      giscusScript.setAttribute('data-strict', '0');
      giscusScript.setAttribute('data-reactions-enabled', '1');
      giscusScript.setAttribute('data-emit-metadata', '0');
      giscusScript.setAttribute('data-input-position', 'bottom');
      giscusScript.setAttribute('data-theme', 'preferred_color_scheme');
      giscusScript.setAttribute('data-lang', 'zh-CN');
      giscusScript.setAttribute('data-loading', 'lazy');
      giscusScript.setAttribute('crossorigin', 'anonymous');
      giscusScript.async = true;
      
      commentContainer.appendChild(giscusScript);
      
      console.log('Giscus评论已添加到文章底部');
    }
  }
}); 