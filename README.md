# 携程酒店管理系统 — Web 管理端

基于 React 19 + TypeScript + Ant Design 构建的酒店管理系统 Web 管理端，为商户提供酒店信息管理功能，为管理员提供审核功能。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript 5.x | 类型安全的编程语言 |
| Ant Design 6 | 企业级 UI 组件库 |
| React Router DOM 7 | 客户端路由管理 |
| Axios | HTTP 请求库 |
| Vite 7 | 前端构建工具 |

---

## 快速开始

### 1. 安装依赖

```bash
cd managesystem-frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问地址：`http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

产物输出至 `dist/` 目录。

### 4. 代码质量检查

```bash
npm run lint
```

---

## 项目结构

```
managesystem-frontend/
├── index.html
├── package.json
├── vite.config.ts                # Vite 配置（含 API 代理）
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── public/
│   └── ctrip-seeklogo.svg        # 携程 Logo
├── src/
│   ├── main.tsx                  # 应用入口
│   ├── App.tsx                   # 根组件
│   ├── index.css                  # 全局样式
│   ├── router/
│   │   └── index.tsx             # 路由配置
│   ├── views/                    # 页面视图
│   │   ├── Login/               # 登录页
│   │   ├── Register/            # 注册页
│   │   ├── Home/                # 商家主页
│   │   ├── PersonalProfile/     # 个人中心
│   │   └── AdminHome/           # 管理员主页
│   ├── component/               # 可复用组件
│   │   └── Home/
│   │       ├── HotelForm.tsx     # 酒店信息表单
│   │       ├── InfoEntry.tsx     # 酒店信息录入
│   │       ├── InfoManage.tsx    # 酒店列表管理
│   │       ├── InfoShow.tsx     # 酒店信息展示
│   │       └── EditManage.tsx    # 编辑酒店信息
│   │   └── AdminHome/
│   │       ├── HotelReview.tsx   # 酒店审核
│   │       └── HistoryReview.tsx # 审核历史
│   ├── types/
│   │   └── index.ts             # TypeScript 类型定义
│   └── utils/
│       ├── MapContainer.tsx     # 地图组件
│       └── MapContainer.css
└── CHANGELOG.md
```

---

## 页面路由

| 路由 | 页面 | 角色 | 功能说明 |
|------|------|------|----------|
| `/login` | 登录页 | 通用 | 用户身份验证 |
| `/register` | 注册页 | 通用 | 新用户注册，支持邮箱验证码 |
| `/Home` | 商家主页 | 商户 | 商家管理入口界面 |
| `/PersonalProfile` | 个人中心 | 通用 | 用户个人信息管理 |
| `/AdminHome` | 管理员主页 | 管理员 | 审核管理入口界面 |

---

## 核心功能模块

### 1. 用户认证

- **登录**：`/login` — 用户名 + 密码登录，JWT Token 存储于 localStorage
- **注册**：`/register` — 支持邮箱验证码注册流程

### 2. 商家管理（商户端）

| 组件 | 功能 |
|------|------|
| `HotelForm.tsx` | 酒店信息填写表单，含图片上传 |
| `InfoEntry.tsx` | 新增酒店信息录入 |
| `InfoManage.tsx` | 查看和管理已录入的酒店列表 |
| `EditManage.tsx` | 修改现有酒店信息 |

### 3. 管理员审核（管理端）

| 组件 | 功能 |
|------|------|
| `HotelReview.tsx` | 审核待处理的酒店申请（通过/拒绝） |
| `HistoryReview.tsx` | 查看历史审核记录 |

### 4. 辅助功能

- **地图组件** `MapContainer.tsx`：展示酒店位置，支持地图交互
- **个人中心** `PersonalProfile`：用户信息管理与退出登录

---

## API 接口对接

前端通过 Vite 代理将 `/api` 请求转发至后端：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

后端服务地址（生产环境需替换为实际域名）：`http://localhost:8080`

### 认证接口

| 接口路径 | 方法 | 说明 |
|----------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/sendCode` | POST | 发送邮箱验证码 |
| `/api/auth/info` | GET | 获取当前用户信息 |

### 酒店接口

| 接口路径 | 方法 | 说明 |
|----------|------|------|
| `/api/hotel/create` | POST | 创建酒店（含图片） |
| `/api/hotel/list` | GET | 获取酒店列表 |
| `/api/hotel/detail/:id` | GET | 获取酒店详情 |
| `/api/hotel/update/:id` | PUT | 更新酒店信息 |
| `/api/hotel/:id` | DELETE | 删除酒店 |
| `/api/hotel/:id/submit` | POST | 提交审核 |
| `/api/hotel/:id/review` | PUT | 管理员审核 |
| `/api/hotel/:id/publish` | POST | 发布/下架 |

---

## 支持城市

北京、上海、广州、深圳、杭州、成都、武汉、西安、南京、重庆、苏州、天津、长沙、青岛、厦门、昆明、大连、沈阳、哈尔滨、济南。

---

## 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

---

## 版本历史

详见 [CHANGELOG.md](./CHANGELOG.md)。

---

本项目仅供学习和研究使用。
