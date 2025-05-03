document.addEventListener('DOMContentLoaded', function() {
  // 检测当前页面是否为文章页面
  const isPostPage = document.querySelector('article.post') !== null;
  
  if (isPostPage) {
    // 创建giscus评论系统容器
    const giscusContainer = document.createElement('div');
    giscusContainer.className = 'giscus-container';
    
    // 找到插入评论的位置 - 在post-prev-next之后
    const postPrevNext = document.querySelector('.post-prev-next');
    if (postPrevNext && postPrevNext.parentNode) {
      postPrevNext.parentNode.insertBefore(giscusContainer, postPrevNext.nextSibling);
      
      // 创建标题
      const commentTitle = document.createElement('h2');
      commentTitle.textContent = '评论';
      commentTitle.style.maxWidth = '800px';
      commentTitle.style.margin = '64px auto 24px';
      commentTitle.style.padding = '0 16px';
      giscusContainer.parentNode.insertBefore(commentTitle, giscusContainer);
      
      // 加载giscus脚本
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
      
      giscusContainer.appendChild(giscusScript);
    }
  }
}); 