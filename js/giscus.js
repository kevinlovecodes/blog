document.addEventListener('DOMContentLoaded', function() {
  // 检测当前页面是否为文章页面
  const isPostPage = document.querySelector('article.post') !== null;
  console.log('是否为文章页面:', isPostPage);
  
  if (isPostPage) {
    // 创建giscus评论系统容器
    const giscusContainer = document.createElement('div');
    giscusContainer.className = 'giscus-container';
    
    // 找到插入评论的位置 - 在container post-prev-next之后
    const postPrevNext = document.querySelector('.container.post-prev-next');
    console.log('找到导航元素:', postPrevNext);
    
    // 尝试其他选择器
    const altSelector = document.querySelector('.post-prev-next');
    console.log('替代选择器结果:', altSelector);
    
    // 查找所有可能的导航元素
    console.log('所有class包含post-prev-next的元素:', document.querySelectorAll('[class*="post-prev-next"]'));
    
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
      console.log('已添加giscus脚本');
    } else {
      console.error('未能找到插入评论的位置!');
      
      // 尝试直接插入到文章末尾
      const article = document.querySelector('article.post');
      if (article) {
        console.log('尝试插入到文章末尾');
        article.appendChild(document.createElement('h2')).textContent = '评论';
        const commentContainer = document.createElement('div');
        commentContainer.className = 'giscus-container';
        article.appendChild(commentContainer);
        
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
        
        commentContainer.appendChild(giscusScript);
        console.log('已添加giscus脚本到文章末尾');
      } else {
        console.error('无法找到文章元素!');
      }
    }
  } else {
    console.log('不是文章页面，不加载评论');
  }
}); 