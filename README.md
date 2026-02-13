# 酒店管理系统前端

基于 React 19 + TypeScript + Ant Design 构建的酒店管理系统前端应用，提供完整的用户界面和商家管理功能。

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript 5.9 | 类型安全的编程语言 |
| Ant Design 6 | 企业级 UI 组件库 |
| React Router DOM 7 | 客户端路由管理 |
| Axios | HTTP 请求库 |
| Vite 7 | 现代前端构建工具 |
| Tailwind CSS 4 | 原子化 CSS 样式框架 |

## 项目架构

```
managesystem-frontend/
├── src/
│   ├── main.tsx                 # 应用入口文件
│   ├── App.tsx                  # 主应用组件
│   ├── router/
│   │   └── index.tsx            # 路由配置中心
│   ├── views/                   # 页面视图层
│   │   ├── Home/                # 商家管理主页
│   │   ├── Login/               # 用户登录页面
│   │   ├── Register/            # 用户注册页面
│   │   └── PersonalProfile/     # 个人中心页面
│   ├── component/               # 可复用组件
│   │   └── Home/
│   │       ├── InfoEntry.tsx    # 酒店信息录入组件
│   │       ├── InfoManage.tsx   # 酒店信息管理组件
│   │       └── EditManage.tsx   # 编辑酒店信息组件
│   ├── types/
│   │   └── index.ts             # TypeScript 类型定义
│   ├── services/                # API 服务层（待实现）
│   ├── index.css                # 全局样式文件
│   └── vite-env.d.ts            # Vite 类型声明
├── public/
│   └── ctrip-seeklogo.svg       # 携程 Logo 资源
├── package.json                  # 项目依赖配置
├── vite.config.ts               # Vite 构建配置
├── tsconfig.json                # TypeScript 编译配置
└── CHANGELOG.md                 # 版本更新日志
```

## 核心功能模块

### 1. 用户认证中心
| 页面 | 路由 | 功能说明 |
|------|------|----------|
| 登录页 | `/login` | 用户身份验证，支持记住密码 |
| 注册页 | `/register` | 新用户注册，支持邮箱验证码 |

### 2. 商家管理后台
| 页面 | 组件 | 功能说明 |
|------|------|----------|
| 商家主页 | `Home/` | 商家管理入口界面 |
| 酒店管理 | `InfoManage.tsx` | 查看和管理已录入的酒店列表 |
| 编辑酒店 | `EditManage.tsx` | 修改现有酒店信息 |
| 录入酒店 | `InfoEntry.tsx` | 添加新酒店信息 |

### 3. 个人中心
| 页面 | 路由 | 功能说明 |
|------|------|----------|
| 个人中心 | `/PersonalProfile` | 用户个人信息管理 |

## 数据结构定义

### 酒店信息类型

```typescript
interface Hotel {
  // 基础信息
  name: string;          // 酒店名称
  description: string;   // 酒店描述
  address: string;        // 详细地址
  city: string;          // 所在城市
  
  // 价格与评分
  price: number;         // 基础价格（元）
  rating: number;        // 用户评分（0-5分）
  
  // 图片与设施
  images: string[];      // 酒店图片 URL 数组
  amenities: string[];  // 设施配置列表
  
  // 房型信息
  roomTypes: RoomType[]; // 房型信息数组
  
  // 联系信息
  contactPhone: string;  // 联系电话
  checkInTime: string;   // 最早入住时间
  checkOutTime: string;  // 最晚退房时间
}

interface RoomType {
  name: string;        // 房型名称
  price: number;       // 房型价格
  capacity: number;    // 容纳人数
  count: number;       // 房间数量
}
```

## API 接口对接

后端服务地址：`http://localhost:8080`

### 认证接口

| 接口路径 | 请求方法 | 功能描述 |
|----------|----------|----------|
| `/api/auth/sendCode` | POST | 发送邮箱验证码 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |

### 酒店管理接口

| 接口路径 | 请求方法 | 功能描述 |
|----------|----------|----------|
| `/api/hotel/create` | POST | 创建新酒店 |
| `/api/hotel/list` | GET | 获取酒店列表 |
| `/api/hotel/:id` | GET | 获取酒店详情 |
| `/api/hotel/:id` | PUT | 更新酒店信息 |
| `/api/hotel/:id` | DELETE | 删除酒店 |

## 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本（或 yarn/pnpm）

### 1. 安装依赖

```bash
cd managesystem-frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器启动后，默认访问地址：`http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 4. 代码质量检查

```bash
npm run lint
```

## 支持城市

| 序号 | 城市 | 序号 | 城市 |
|------|------|------|------|
| 1 | 北京 | 11 | 苏州 |
| 2 | 上海 | 12 | 天津 |
| 3 | 广州 | 13 | 长沙 |
| 4 | 深圳 | 14 | 青岛 |
| 5 | 杭州 | 15 | 厦门 |
| 6 | 成都 | 16 | 昆明 |
| 7 | 武汉 | 17 | 大连 |
| 8 | 西安 | 18 | 沈阳 |
| 9 | 南京 | 19 | 哈尔滨 |
| 10 | 重庆 | 20 | 济南 |

## 设施配置

| 分类 | 支持的设施 |
|------|-----------|
| 网络设施 | WiFi |
| 休闲设施 | 游泳池、健身房、SPA、江景 |
| 餐饮服务 | 餐厅、早餐 |
| 交通服务 | 停车场、接机服务 |
| 客房服务 | 空调、电视、浴缸、阳台、24小时前台、行李寄存 |
| 建筑设施 | 电梯 |
| 商务设施 | 会议室、商务中心 |
| 其他服务 | 儿童游乐场、宠物友好 |

## 后端服务配置

确保后端服务已启动（默认端口：8080）。

开发环境通过 Vite 代理转发请求：

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

## 版本历史

详细版本更新记录请查看 [CHANGELOG.md](./CHANGELOG.md)

## 许可证

本项目仅供学习和研究使用。
