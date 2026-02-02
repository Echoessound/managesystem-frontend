# 酒店管理系统前端

基于 React + TypeScript + Ant Design 的酒店管理系统前端项目。

## 技术栈

- **React 19** - UI 框架
- **TypeScript 5.9** - 类型安全
- **Ant Design 6** - UI 组件库
- **React Router DOM 7** - 路由管理
- **Axios** - HTTP 请求
- **Vite 7** - 构建工具
- **Tailwind CSS 4** - 样式方案

## 项目结构

```
managesystem-frontend/
├── src/
│   ├── App.tsx              # 应用入口组件
│   ├── main.tsx             # 项目启动入口
│   ├── router/
│   │   └── index.tsx        # 路由配置
│   ├── views/               # 页面视图
│   │   ├── Home/            # 商家主页
│   │   ├── Login/           # 登录页
│   │   ├── Register/        # 注册页
│   │   └── PersonalProfile/ # 个人中心
│   ├── component/           # 可复用组件
│   │   └── Home/
│   │       ├── InfoEntry.tsx    # 酒店信息录入
│   │       ├── InfoManage.tsx   # 酒店信息管理
│   │       └── EditManage.tsx   # 编辑酒店信息
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── services/            # API 服务（待实现）
│   └── index.css            # 全局样式
├── public/
│   └── ctrip-seeklogo.svg   # 携程 Logo
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 功能模块

### 1. 用户认证
- **登录** (`/login`) - 用户登录
- **注册** (`/register`) - 用户注册，支持邮箱验证码

### 2. 商家管理后台 (`/`)
- **酒店信息管理** - 查看和管理已录入的酒店
- **编辑酒店信息** - 修改现有酒店信息
- **酒店信息录入** - 添加新酒店信息

### 3. 个人中心 (`/PersonalProfile`)
- 用户个人信息管理

## 酒店信息数据结构

```typescript
{
  // 基础信息
  name: string;        // 酒店名称
  description: string; // 描述
  address: string;     // 地址
  city: string;        // 城市
  
  // 价格与评分
  price: number;       // 基础价格（元）
  rating: number;      // 评分（0-5）
  
  // 图片与设施
  images: string[];    // 酒店图片
  amenities: string[]; // 设施配置
  
  // 房型信息
  roomTypes: RoomType[]; // 房型列表
  
  // 联系信息
  contactPhone: string; // 联系电话
  checkInTime: string;  // 入住时间
  checkOutTime: string; // 退房时间
}
```

## API 接口

后端服务地址：`http://localhost:8080`

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/sendCode` | POST | 发送邮箱验证码 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 注意事项

- 确保后端服务已启动（默认端口 8080）
- 注册用户后需邮箱验证
- 酒店信息录入支持图片上传功能
- 支持 20 个主要城市的酒店管理

## 支持的城市

北京、上海、广州、深圳、杭州、成都、武汉、西安、南京、重庆、苏州、天津、长沙、青岛、厦门、昆明、大连、沈阳、哈尔滨、济南

## 支持的设施配置

WiFi、游泳池、健身房、餐厅、停车场、SPA、江景、早餐、接机服务、行李寄存、24小时前台、空调、电视、浴缸、阳台、电梯、会议室、商务中心、儿童游乐场、宠物友好

