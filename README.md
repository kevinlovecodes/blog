# 博客数据库系统

这是一个基于Hexo静态博客的数据库存储系统，使用Cloudflare D1数据库存储博客文章的元数据。

## 项目功能

- 使用Cloudflare D1数据库存储博客文章的元数据（如标题、slug、时间）
- 从现有的`search.json`自动提取文章元数据
- 支持一键导入数据到数据库

## 技术栈

- Hexo：静态博客生成框架
- Cloudflare D1：边缘SQL数据库
- Wrangler：Cloudflare开发工具
- Node.js：运行环境

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
npx wrangler d1 execute blog-meta --file=./schema.sql
```

5. 导入数据：
```
node import-posts.js
```

6. 查询数据：
```
npx wrangler d1 execute blog-meta --command="SELECT * FROM posts;"
```

## 远程操作

如需操作远程数据库，请在命令后添加`--remote`参数，例如：

```
npx wrangler d1 execute blog-meta --command="SELECT * FROM posts;" --remote
```

或者使用导入脚本的`--remote`参数：

```
node import-posts.js --remote
``` 