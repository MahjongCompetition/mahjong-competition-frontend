# 麻将比赛系统前端

一个基于 Vue 3 + Vite + Naive UI 的麻将比赛系统前端应用，集成了用户端和管理员端功能。

## 功能特性

### 用户端功能
- 🏠 首页展示最新比赛信息
- 🏆 比赛列表浏览和搜索
- 📋 比赛详情查看和报名
- 👥 团队管理（创建、加入、管理）
- 👤 个人资料管理
- 🔐 用户注册和登录

### 管理员端功能
- 📊 管理面板统计信息
- 🏆 比赛管理（创建、编辑、删除）
- 📋 规则管理（创建、编辑、删除）
- 👥 玩家管理（查看、状态管理）
- 👨‍💼 管理员账户管理
- 📈 成绩管理和录入

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Naive UI
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Axios
- **开发语言**: TypeScript
- **样式**: CSS3 + 响应式设计

## 项目结构

```
src/
├── api/                 # API 接口层
│   ├── index.ts        # Axios 配置和拦截器
│   ├── auth.ts         # 认证相关 API
│   └── competition.ts  # 比赛相关 API
├── components/         # 公共组件
├── router/            # 路由配置
│   └── index.ts
├── stores/            # 状态管理
│   └── auth.ts        # 认证状态管理
├── views/             # 页面组件
│   ├── user/          # 用户端页面
│   │   ├── Home.vue           # 首页
│   │   ├── Login.vue          # 登录页
│   │   ├── Register.vue       # 注册页
│   │   ├── Competitions.vue   # 比赛列表
│   │   ├── CompetitionDetail.vue # 比赛详情
│   │   ├── Teams.vue          # 团队管理
│   │   └── Profile.vue        # 个人资料
│   ├── admin/         # 管理员端页面
│   │   ├── Login.vue          # 管理员登录
│   │   ├── AdminLayout.vue    # 管理员布局
│   │   ├── Dashboard.vue      # 管理面板
│   │   ├── Competitions.vue   # 比赛管理
│   │   ├── Rules.vue          # 规则管理
│   │   ├── Players.vue        # 玩家管理
│   │   ├── Admins.vue         # 管理员管理
│   │   └── MatchResults.vue   # 成绩管理
│   └── NotFound.vue   # 404 页面
├── App.vue            # 根组件
└── main.ts            # 应用入口
```

## 安装和运行

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐) 或 npm >= 8.0.0

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发环境运行
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 生产环境构建
```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

### 代码检查
```bash
# 使用 pnpm
pnpm lint

# 或使用 npm
npm run lint
```

### 运行测试
```bash
# 使用 pnpm
pnpm test

# 或使用 npm
npm run test
```

## 配置说明

### 环境变量
创建 `.env.local` 文件来配置环境变量：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080

# 应用标题
VITE_APP_TITLE=麻将比赛系统
```

### API 配置
在 `src/api/index.ts` 中配置 API 基础地址和超时时间。

## 使用说明

### 用户端访问
- 访问 `http://localhost:5173/` 进入用户端首页
- 可以浏览比赛、注册登录、管理团队等

### 管理员端访问
- 访问 `http://localhost:5173/admin` 进入管理员端
- 需要管理员账户登录才能访问

### 路由说明
- `/` - 用户端首页
- `/competitions` - 比赛列表
- `/competition/:id` - 比赛详情
- `/teams` - 团队管理
- `/profile` - 个人资料
- `/login` - 用户登录
- `/register` - 用户注册
- `/admin` - 管理员面板
- `/admin/login` - 管理员登录

## 开发说明

### 添加新页面
1. 在 `src/views/` 下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 根据需要添加相应的 API 接口

### 添加新 API
1. 在 `src/api/` 下创建新的 API 模块
2. 定义相应的 TypeScript 接口
3. 在组件中导入并使用

### 状态管理
使用 Pinia 进行状态管理，认证状态在 `src/stores/auth.ts` 中管理。

## 注意事项

1. **API 集成**: 当前版本使用模拟数据，需要根据实际后端 API 进行调整
2. **认证机制**: 使用 JWT Token 进行用户认证
3. **权限控制**: 管理员端需要相应的权限才能访问
4. **响应式设计**: 支持移动端和桌面端访问

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 项目讨论区

---

**注意**: 这是一个开发中的项目，部分功能可能还在开发中。如有问题请查看 Issues 或联系开发团队。
