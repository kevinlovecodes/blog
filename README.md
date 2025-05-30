# 博客数据库系统

这是一个基于Hexo静态博客的数据库存储系统，使用Cloudflare D1数据库存储博客文章的元数据。

## 项目功能

- 使用Cloudflare D1数据库存储博客文章的元数据（如标题、slug、时间）
- 从现有的`search.json`自动提取文章元数据
- 支持一键导入数据到数据库
- 集成Giscus评论系统，提供完整的样式解决方案

## 项目结构

```
blog/
  ├── css/                 # 样式文件
  │   └── giscus-custom.css # Giscus评论样式（整合版）
  ├── scripts/             # 脚本目录
  │   ├── giscus/          # Giscus评论系统相关脚本
  │   ├── database/        # 数据库相关脚本
  │   └── giscus-fix.js    # Giscus修复主入口
  ├── iframe-style-injector.js # Giscus iframe样式注入器
  ├── search.json          # 文章索引数据
  └── [其他博客文件和目录]
```

## 技术栈

- Hexo：静态博客生成框架
- Cloudflare D1：边缘SQL数据库
- Wrangler：Cloudflare开发工具
- Node.js：运行环境
- Giscus：基于GitHub Discussions的评论系统

## 数据库结构

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
```

## 使用方法

1. 安装依赖：
```
npm install
```

2. 登录Cloudflare：
```
npx wrangler login
```

3. 创建D1数据库：
```
npx wrangler d1 create blog-meta
```

4. 创建数据库表结构：
```
npx wrangler d1 execute blog-meta --file=./scripts/database/schema.sql
```

5. 导入数据：
```
npm run import-posts
```

6. 查询数据：
```
npx wrangler d1 execute blog-meta --command="SELECT * FROM posts;"
```

7. 修复Giscus评论区样式：
```
npm run fix-giscus
```

## 远程操作

如需操作远程数据库，请在命令后添加`--remote`参数，例如：

```
npx wrangler d1 execute blog-meta --command="SELECT * FROM posts;" --remote
```

或者使用导入脚本的`--remote`参数：

```
npm run import-posts -- --remote
```

## 项目优化

最近，我们对项目进行了以下优化：

1. 精简了目录结构，移除了重复的my-blog目录
2. 整合了多个功能相似的Giscus脚本
3. 合并了CSS样式文件，移除了冗余样式
4. 提取了通用工具函数，减少代码重复
5. 优化了项目目录组织，使结构更清晰

更多详情请参考 [scripts/README.md](scripts/README.md) 