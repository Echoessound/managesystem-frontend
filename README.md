# 酒店管理系统 (Hotel Management System)

这是一个基于 React + TypeScript + Ant Design 构建的酒店管理系统前端项目。

## 项目简介

本项目旨在提供一个功能完善的酒店管理后台，主要服务于酒店商家和管理员。商家可以录入酒店信息、管理房型，管理员则可以审核酒店发布内容。

## 核心功能

### 商家端
- **酒店信息录入**: 支持录入酒店基础信息、房型配置、设施列表、营业执照上传。
- **酒店信息管理**: 查看已录入的酒店列表及其状态。
- **信息编辑**: 修改酒店的基础信息和房型数据。

### 通用功能
- **用户认证**: 支持注册、登录、登出。
- **响应式布局**: 侧边栏可伸缩，内容区域自适应。

## 技术栈

- **前端框架**: React 19
- **语言**: TypeScript
- **UI 组件库**: Ant Design (antd)
- **路由**: React Router v6
- **构建工具**: Vite


## 项目结构

```
managesystem-frontend/
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 图片、字体等资源
│   ├── component/          # 公共组件
│   │   └── Home/           # 首页相关子组件
│   │       ├── EditManage.tsx  # 编辑酒店信息
│   │       ├── InfoEntry.tsx   # 录入酒店信息
│   │       └── InfoManage.tsx  # 酒店信息列表
│   ├── router/             # 路由配置
│   ├── services/           # API 服务封装
│   │   └── api.ts          # HTTP 请求与 API 方法
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 核心数据类型
│   ├── views/              # 页面视图
│   │   ├── Home/           # 商家主页面
│   │   ├── Login/          # 登录页
│   │   ├── Register/       # 注册页
│   │   └── PersonalProfile/# 个人中心
│   ├── App.tsx             # 应用入口组件
│   └── main.tsx            # 渲染入口
├── index.html              # HTML 模板
├── package.json
├── tsconfig.json
└── vite.config.ts          # Vite 配置
```

## API 接口说明

项目已在 `src/services/api.ts` 中封装了完整的接口调用，包括：

### 认证模块
- `api.login`: 用户登录
- `api.register`: 用户注册
- `api.logout`: 登出

### 酒店管理模块
- `api.getHotels`: 获取已发布酒店列表
- `api.getMyHotels`: 获取当前用户的酒店列表
- `api.createHotel`: 创建新酒店
- `api.updateHotel`: 更新酒店信息

### 管理员模块
- `api.getAllHotels`: 获取所有酒店（分页）
- `api.reviewHotel`: 审核酒店
- `api.getStatsSummary`: 获取统计数据

## 运行指南

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

## 环境配置

项目使用环境变量配置 API 地址，请确保在 `.env` 文件中配置正确：
```
VITE_API_BASE_URL=http://localhost:3000
```
