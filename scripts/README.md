# 博客脚本说明

本目录包含了博客项目中所有工具脚本，经过优化和整合后的脚本结构如下：

## 目录结构

```
scripts/
  ├── giscus/             # Giscus评论系统相关脚本
  │   ├── utils.js        # 通用工具函数
  │   ├── fix-giscus-styles.js  # 整合的样式修复脚本
  │   └── iframe-style-injector.js  # iframe样式注入器
  ├── database/           # 数据库相关脚本
  │   ├── import-posts.js # 导入文章元数据到数据库
  │   ├── schema.sql      # 数据库表结构
  │   └── wrangler.toml   # Cloudflare配置
  └── giscus-fix.js       # Giscus修复主入口
```

## 脚本说明

### Giscus相关脚本

1. **utils.js**：
   - 提取了所有Giscus脚本中重复的函数，如文件查找、目录遍历等
   - 提供了通用的工具函数，减少代码重复

2. **fix-giscus-styles.js**：
   - 整合了原先分散的多个脚本功能
   - 包含HTML文件中评论区边距修复
   - 包含内联样式脚本注入
   - 包含iframe样式注入器脚本添加

3. **iframe-style-injector.js**：
   - 用于注入样式到Giscus iframe内部
   - 保持原始功能不变

4. **giscus-fix.js**：
   - 主脚本入口，用于执行所有Giscus相关的修复工作
   - 替代了原来的fix-giscus-all.js

### 数据库相关脚本

1. **import-posts.js**：
   - 从search.json导入文章元数据到Cloudflare D1数据库
   - 支持本地和远程数据库操作

2. **schema.sql**：
   - 数据库表结构定义

3. **wrangler.toml**：
   - Cloudflare Wrangler配置文件

## 如何使用

### 修复Giscus评论区样式

```bash
npm run fix-giscus
```

### 导入文章元数据到数据库

```bash
npm run import-posts
```

如需操作远程数据库，请添加`--remote`参数：

```bash
npm run import-posts -- --remote
```

## 优化内容

1. 精简了目录结构，移除了重复的my-blog目录
2. 整合了多个功能相似的Giscus脚本
3. 合并了CSS样式文件，移除了冗余样式
4. 提取了通用工具函数，减少代码重复
5. 优化了项目目录组织，使结构更清晰 