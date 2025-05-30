# 博客数据库系统

这是一个基于静态网站的数据库存储系统，使用Cloudflare D1数据库存储博客文章的元数据。

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

- 静态网站：HTML、CSS、JavaScript
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

1. 克隆仓库
2. 安装依赖：`npm install`
3. 导入文章数据：`npm run import-posts`
4. 修复Giscus样式：`npm run fix-giscus`

## 部署

本站使用Cloudflare Pages进行部署，自动与GitHub仓库同步。

## 远程操作

如需操作远程数据库，请在命令后添加`--remote`参数，例如：

```