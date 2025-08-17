# 跨域代理配置说明

## 概述

本项目已配置了 Vite 开发服务器的跨域代理，用于解决前端开发时的跨域问题。

## 配置详情

### 1. 代理规则

- **路径**: `/api/*`
- **目标服务器**: `http://localhost:8080` (默认)
- **配置**: 
  - `changeOrigin: true` - 改变请求头中的 origin
  - `secure: false` - 支持 HTTP 请求
  - 保持 `/api` 前缀

### 2. 工作原理

```
前端请求: http://localhost:5173/api/competitions
↓
代理转发: http://localhost:8080/api/competitions
```

### 3. 环境变量配置

在项目根目录创建 `.env.local` 文件（如果不存在）：

```env
# 后端服务器地址
VITE_BACKEND_URL=http://localhost:8080

# API 基础地址（使用代理）
VITE_API_BASE_URL=/api
```

### 4. 使用方法

#### 前端代码中
```typescript
// 使用相对路径，会被代理转发
const response = await fetch('/api/competitions')

// 或者使用环境变量
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/competitions`)
```

#### API 服务中
```typescript
// src/api/index.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})
```

### 5. 调试功能

代理配置包含了调试日志，在控制台可以看到：
- 代理错误信息
- 发送的请求详情
- 接收的响应状态

### 6. 自定义配置

如果需要代理其他路径，可以在 `vite.config.ts` 中添加：

```typescript
proxy: {
  '/api': { /* 现有配置 */ },
  '/other-api': {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
  }
}
```

### 7. 生产环境

**注意**: 此代理配置仅在开发环境有效。生产环境需要：
- 后端服务器配置 CORS
- 或者使用 Nginx 等反向代理
- 或者前后端部署在同一域名下

### 8. 常见问题

#### Q: 代理不生效？
A: 检查：
1. 后端服务器是否运行在 8080 端口
2. 请求路径是否以 `/api` 开头
3. 是否重启了开发服务器

#### Q: 如何修改后端地址？
A: 修改 `.env.local` 文件中的 `VITE_BACKEND_URL` 值

#### Q: 支持 HTTPS 吗？
A: 可以，将 `secure: false` 改为 `secure: true`

## 重启服务

修改配置后，需要重启开发服务器：

```bash
# 停止当前服务 (Ctrl+C)
# 重新启动
pnpm dev
```

## 验证配置

启动服务后，在浏览器控制台应该能看到代理相关的日志信息。
