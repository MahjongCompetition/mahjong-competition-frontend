# 团队管理功能说明

## 概述

团队管理功能已根据最新的API文档进行了全面更新，现在支持通过团队码加入团队，符合后端API的设计规范。

## 主要功能

### 1. 创建团队
- **API端点**: `POST /api/teams/create`
- **必需参数**: 
  - `teamName`: 团队名称（2-20字符）
  - `maxMembers`: 最大成员数量（2-10人）
- **可选参数**: `description`: 团队描述

### 2. 加入团队
- **API端点**: `POST /api/teams/join`
- **必需参数**: `teamCode`: 团队码（3-20字符）
- **说明**: 团队码是加入团队的唯一标识，用户需要向队长获取

### 3. 退出团队
- **API端点**: `POST /api/teams/leave`
- **必需参数**: `teamId`: 团队ID

### 4. 解散团队
- **API端点**: `POST /api/teams/dissolve`
- **必需参数**: `teamId`: 团队ID
- **权限**: 仅队长可以解散团队

### 5. 团队信息查询
- **获取我的团队**: `GET /api/player/my-teams`
- **获取团队成员**: `GET /api/teams/{teamId}/members`
- **根据团队码查询**: `GET /api/teams/code/{teamCode}`
- **根据队长查询**: `GET /api/teams/captain/{captainId}`

## 数据结构

### Team 接口
```typescript
interface Team {
  id: number
  teamName: string
  teamCode: string        // 团队码，用于加入团队
  captainId: number       // 队长ID
  maxMembers: number      // 最大成员数量
  currentMembers: number  // 当前成员数量
  isActive: boolean       // 是否激活
  createdAt: string       // 创建时间
  updatedAt: string       // 更新时间
}
```

### TeamMember 接口
```typescript
interface TeamMember {
  id: number
  teamId: number
  player: {
    id: number
    username: string
    nickname: string
    qq: string
    mahjongId: string
    mahjongNickname: string
  }
  joinTime: string        // 加入时间
  isActive: boolean       // 是否激活
  createdAt: string
  updatedAt: string
}
```

## 使用流程

### 创建团队
1. 用户点击"创建团队"按钮
2. 填写团队名称和最大成员数量
3. 提交表单，调用创建团队API
4. 创建成功后自动成为队长

### 加入团队
1. 用户点击"加入团队"按钮
2. 输入团队码（向队长获取）
3. 提交表单，调用加入团队API
4. 加入成功后显示在"我的团队"列表中

### 退出团队
1. 在团队卡片上点击"退出"按钮
2. 确认操作，调用退出团队API
3. 退出成功后从列表中移除

## 权限控制

- **创建团队**: 所有登录用户
- **加入团队**: 所有登录用户（需要有效的团队码）
- **退出团队**: 团队成员
- **解散团队**: 仅队长
- **编辑团队**: 仅队长

## 错误处理

### 常见错误
- **团队码无效**: 提示"团队码无效，请检查后重试"
- **团队人数已满**: 提示"该团队人数已满，无法加入"
- **权限不足**: 提示相应的权限错误信息

### 错误响应格式
```json
{
  "code": -1,
  "message": "错误描述",
  "data": null
}
```

## 前端组件

### Teams.vue
主要的团队管理页面，包含：
- 团队列表展示
- 创建团队对话框
- 加入团队对话框
- 团队操作按钮（编辑、退出、详情）

### 状态管理
- 使用 `ref` 管理团队数据
- 实时更新团队列表
- 加载状态管理

## 开发注意事项

1. **团队码唯一性**: 团队码是系统生成的唯一标识，用户无法自定义
2. **成员数量限制**: 创建团队时最大成员数量限制在2-10人
3. **实时更新**: 操作成功后需要重新加载团队数据
4. **错误处理**: 所有API调用都需要适当的错误处理
5. **权限验证**: 前端需要验证用户权限，后端会进行二次验证

## 后续优化

1. **团队搜索**: 添加团队搜索功能
2. **团队邀请**: 实现团队邀请机制
3. **团队公告**: 添加团队公告功能
4. **团队统计**: 显示团队比赛成绩统计
5. **批量操作**: 支持批量管理团队成员

## API文档参考

详细的API文档请参考 `api-docs.json` 文件中的团队管理相关接口。
