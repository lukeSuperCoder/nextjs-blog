# PostgreSQL 数据库配置指南

> 本指南帮助你配置和使用 PostgreSQL 数据库

---

## 📋 前置条件

确保你已经安装了 PostgreSQL 数据库:

### macOS
```bash
# 使用 Homebrew 安装
brew install postgresql@15

# 启动 PostgreSQL 服务
brew services start postgresql@15
```

### Windows
下载并安装 PostgreSQL: https://www.postgresql.org/download/windows/

### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
```

---

## 🗄️ 数据库配置步骤

### 1. 创建数据库

```bash
# 连接到 PostgreSQL (默认用户 postgres)
psql -U postgres -h 127.0.0.1

# 或者如果你是 macOS 使用 Homebrew 安装的
psql postgres
```

在 PostgreSQL 命令行中执行:

```sql
-- 创建项目数据库
CREATE DATABASE nextjs_blog;

-- 创建专用用户 (可选,推荐)
CREATE USER blog_user WITH PASSWORD 'your_secure_password';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE nextjs_blog TO blog_user;

-- 退出
\q
```

### 2. 配置连接字符串

**PostgreSQL 连接字符串格式**:
```
postgresql://用户名:密码@主机:端口/数据库名?schema=public
```

**常见配置示例**:

#### 使用默认 postgres 用户:
```env
DATABASE_URL="postgresql://postgres:your_password@127.0.0.1:5432/nextjs_blog?schema=public"
```

#### 使用自定义用户:
```env
DATABASE_URL="postgresql://blog_user:your_secure_password@127.0.0.1:5432/nextjs_blog?schema=public"
```

#### 本地开发(如果 PostgreSQL 没有密码):
```env
DATABASE_URL="postgresql://postgres@127.0.0.1:5432/nextjs_blog?schema=public"
```

### 3. 创建 .env.local 文件

在项目根目录创建 `.env.local`:

```env
# 数据库连接 - 请修改为你的实际配置
DATABASE_URL="postgresql://postgres:your_password@127.0.0.1:5432/nextjs_blog?schema=public"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**生成安全的 NEXTAUTH_SECRET**:
```bash
# 在终端执行
openssl rand -base64 32
```

---

## 🚀 Prisma 初始化

### 1. 初始化 Prisma

```bash
# 初始化 Prisma (使用 PostgreSQL)
npx prisma init --datasource-provider postgresql
```

这会创建:
- `prisma/schema.prisma` - 数据库模型定义
- `.env` - 环境变量文件 (如果不存在)

### 2. 配置 Prisma Schema

编辑 `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 添加你的数据模型...
```

### 3. 创建数据库迁移

```bash
# 创建并应用迁移
npx prisma migrate dev --name init

# 这个命令会:
# 1. 创建迁移文件
# 2. 应用到数据库
# 3. 生成 Prisma Client
```

### 4. 查看数据库

使用 Prisma Studio 可视化查看数据库:

```bash
npx prisma studio
```

这会在浏览器打开 http://localhost:5555,你可以:
- 查看所有表
- 查看和编辑数据
- 执行查询

---

## 🔧 常用 Prisma 命令

### 开发过程中

```bash
# 创建新的迁移
npx prisma migrate dev --name your_migration_name

# 重置数据库 (删除所有数据)
npx prisma migrate reset

# 生成 Prisma Client (修改 schema 后)
npx prisma generate

# 查看数据库
npx prisma studio

# 格式化 schema 文件
npx prisma format
```

### 生产环境部署

```bash
# 应用迁移 (不会创建新迁移)
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

---

## 🧪 测试数据库连接

创建 `test-db.js` 测试连接:

```javascript
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ 数据库连接成功!')

    // 测试查询
    const userCount = await prisma.user.count()
    console.log('用户数量:', userCount)
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

运行测试:
```bash
node test-db.js
```

---

## 📊 PostgreSQL 实用命令

### psql 命令行工具

```bash
# 连接到数据库
psql -U postgres -d nextjs_blog

# 常用命令 (在 psql 中)
\l                # 列出所有数据库
\c nextjs_blog    # 切换到数据库
\dt               # 列出所有表
\d tablename      # 查看表结构
\du               # 列出所有用户
\q                # 退出
```

### SQL 查询示例

```sql
-- 查看所有表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 查看表的行数
SELECT COUNT(*) FROM "User";

-- 查看最近创建的文章
SELECT id, title, "createdAt"
FROM "Post"
ORDER BY "createdAt" DESC
LIMIT 5;

-- 删除所有数据 (慎用!)
TRUNCATE TABLE "Post", "User", "Category", "Tag" CASCADE;
```

---

## 🔒 安全最佳实践

### 1. 不要提交敏感信息

创建 `.gitignore`:
```
.env
.env.local
.env.production
```

### 2. 使用强密码

```bash
# 生成随机密码
openssl rand -base64 20
```

### 3. 限制数据库访问

生产环境配置 `pg_hba.conf`:
```
# 只允许本地连接
host    all    all    127.0.0.1/32    md5
```

### 4. 定期备份

```bash
# 备份数据库
pg_dump -U postgres -d nextjs_blog > backup.sql

# 恢复数据库
psql -U postgres -d nextjs_blog < backup.sql
```

---

## 🐛 常见问题

### 问题 1: 连接被拒绝

**错误**: `ECONNREFUSED 127.0.0.1:5432`

**解决**:
```bash
# 检查 PostgreSQL 是否运行
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# 启动 PostgreSQL
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### 问题 2: 密码认证失败

**错误**: `password authentication failed`

**解决**:
1. 确认密码正确
2. 检查用户是否存在
3. 重置密码:
```sql
ALTER USER postgres PASSWORD 'new_password';
```

### 问题 3: 数据库不存在

**错误**: `database "nextjs_blog" does not exist`

**解决**:
```sql
CREATE DATABASE nextjs_blog;
```

### 问题 4: 权限不足

**错误**: `permission denied for schema public`

**解决**:
```sql
GRANT ALL PRIVILEGES ON DATABASE nextjs_blog TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

---

## 📚 学习资源

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Prisma 文档](https://www.prisma.io/docs)
- [PostgreSQL 教程](https://www.postgresqltutorial.com/)

---

## ✅ 快速检查清单

开始开发前,确保:

- [ ] PostgreSQL 已安装并运行
- [ ] 数据库 `nextjs_blog` 已创建
- [ ] `.env.local` 文件已配置
- [ ] 数据库连接字符串正确
- [ ] 可以连接到数据库 (使用 psql 或测试脚本)
- [ ] Prisma 已初始化
- [ ] 迁移已创建和应用
- [ ] Prisma Studio 可以访问数据库

---

**祝你开发顺利! 🚀**
