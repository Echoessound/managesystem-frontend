# 携程酒店管理系统 - 前端（Web 管理端）

本项目是 **携程酒店管理系统** 的 Web 管理端（商户端 + 管理员端），基于 React + TypeScript + Ant Design 构建，提供完整的酒店管理、审核、发布等功能。

---

## 一、技术栈

- **前端框架**：React 19 + TypeScript
- **UI 组件库**：Ant Design 5.x（PC 端）
- **路由管理**：React Router DOM 6
- **HTTP 客户端**：Axios
- **表单处理**：Ant Design Form + useForm
- **状态管理**：React Hooks（useState、useEffect、useContext）
- **构建工具**：Vite

---

## 二、目录结构

```bash
src/
├── component/                # 业务组件（按模块划分）
│   ├── AdminHome/            # 管理员模块
│   │   ├── HotelReview.tsx       # 酒店审核（待审核列表）
│   │   └── HistoryReview.tsx     # 历史审核记录
│   └── Home/                 # 商户模块
│       ├── InfoManage.tsx        # 酒店列表管理
│       ├── InfoEntry.tsx         # 新增酒店入口
│       ├── InfoShow.tsx           # 酒店详情查看（只读）
│       ├── EditManage.tsx         # 酒店编辑
│       └── HotelForm.tsx          # 酒店表单核心组件
├── views/                    # 页面视图（路由入口）
│   ├── Login/index.tsx           # 登录页
│   ├── Register/index.tsx         # 注册页（含邮箱验证码）
│   ├── PersonalProfile/index.tsx # 个人中心
│   ├── Home/index.tsx             # 商户端主页框架
│   └── AdminHome/index.tsx        # 管理员端主页框架
├── router/                   # 路由配置
│   └── index.tsx
├── types/                    # TypeScript 类型定义
│   └── index.ts
├── utils/                    # 工具函数
│   └── MapContainer.tsx      # 地图容器（预留）
├── App.tsx                   # 根组件
├── main.tsx                  # 入口文件
└── index.css                 # 全局样式
```

---

## 三、核心页面（Views）

### 1. 登录页（Login）

**文件**：`src/views/Login/index.tsx`

**功能**：

- 用户登录（支持普通用户、商户、管理员三种角色）
- 登录成功后保存 JWT Token 至 `localStorage`
- 登录失败显示错误提示

**关键交互**：

- 输入用户名、密码
- 点击登录按钮，调用 `POST /api/auth/login`
- 成功后跳转至对应角色主页（商户 → `/`，管理员 → `/admin-home`）

---

### 2. 注册页（Register）

**文件**：`src/views/Register/index.tsx`

**功能**：

- 用户注册（选择角色：普通用户 / 商户）
- **邮箱验证码**：点击"获取验证码"按钮，后端发送 6 位数字验证码至用户邮箱
- 表单验证：用户名、密码、确认密码、邮箱、手机号

**关键交互**：

1. 填写邮箱 → 点击"获取验证码" → 后端发送验证码
2. 输入验证码 → 填写其他信息 → 提交注册
3. 调用 `POST /api/auth/register`

**验证码实现**：

- `sendCode` 接口使用 Nodemailer 发送至用户邮箱
- 验证码有效期：5 分钟

---

### 3. 商户端主页（Home）

**文件**：`src/views/Home/index.tsx`

**功能**：

- 商户端管理系统主框架
- 左侧导航菜单
- 内容区渲染子路由

**子页面**：

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | InfoManage | 酒店列表管理（默认） |
| `/info-entry` | InfoEntry | 新增酒店 |
| `/info-show/:id` | InfoShow | 查看酒店详情 |
| `/edit/:id` | EditManage | 编辑酒店 |

---

### 4. 管理员端主页（AdminHome）

**文件**：`src/views/AdminHome/index.tsx`

**功能**：

- 管理员端管理系统主框架
- 左侧导航菜单
- 内容区渲染子路由

**子页面**：

| 路径 | 组件 | 说明 |
|------|------|------|
| `/admin-home` | HotelReview | 待审核酒店列表（默认） |
| `/admin-home/history` | HistoryReview | 历史审核记录 |

---

### 5. 个人中心（PersonalProfile）

**文件**：`src/views/PersonalProfile/index.tsx`

**功能**：

- 展示当前登录用户信息（头像、用户名、角色、邮箱）
- 退出登录（清除 localStorage 并跳转至登录页）

---

## 四、核心组件（Component）

### 1. 商户模块（Home/）

#### 1.1 InfoManage（酒店列表管理）

**文件**：`src/component/Home/InfoManage.tsx`

**功能**：

- 获取当前商户名下所有酒店列表
- 展示列：酒店名称、城市、价格、评分、状态、操作
- **操作按钮**：
  - 👁 查看：跳转至 InfoShow
  - ✏️ 编辑：跳转至 EditManage
  - 🗑 删除：确认后调用 DELETE 接口
  - ⬆️ 发布 / ⬇️ 下架：调用 `POST /api/hotel/:id/publish`
  - 📋 提交审核：调用 `POST /api/hotel/:id/submit`
  - 🔄 再次审核：调用 `POST /api/hotel/:id/resubmit`

**状态标签**：

- 待审核（pending）→ 黄色
- 已发布（published）→ 绿色
- 已拒绝（rejected）→ 红色
- 已下线（offline）→ 灰色

---

#### 1.2 InfoEntry（新增酒店入口）

**文件**：`src/component/Home/InfoEntry.tsx`

**功能**：

- 点击"新增酒店"按钮后加载 HotelForm 组件
- 获取当前登录用户的 `_id` 作为 `ownerId`

---

#### 1.3 EditManage（酒店编辑）

**文件**：`src/component/Home/EditManage.tsx`

**功能**：

- 编辑已有酒店信息
- 页面加载时调用 `GET /api/hotel/:id` 获取原数据并回显
- 支持图片上传（酒店图片、房型图片）
- 提交时调用 `PUT /api/hotel/update/:id`

**表单数据结构**（部分）：

```typescript
interface HotelFormData {
  name: string;           // 酒店名称
  city: string;           // 城市
  address: string;        // 详细地址
  price: number;          // 价格
  description: string;    // 描述
  amenities: string[];    // 设施列表
  images: string[];       // 酒店图片（URL 数组）
  roomTypes: RoomType[];  // 房型列表
}

interface RoomType {
  name: string;           // 房型名称
  description: string;   // 房型描述
  price: number;         // 房型价格
  capacity: number;      // 可住人数
  count: number;         // 房间数量
  images: string[];      // 房型图片
}
```

---

#### 1.4 HotelForm（酒店表单核心组件）

**文件**：`src/component/Home/HotelForm.tsx`

**功能**：

- **核心表单组件**，被 InfoEntry、EditManage 共用
- 支持"新增"和"编辑"两种模式
- **表单字段**：
  - 基础信息：名称、城市、地址、价格、描述
  - 设施选择：多选（停车场、WiFi、早餐、健身房等）
  - 酒店图片：最多 9 张，支持拖拽排序
  - 房型信息：可动态增删房型
    - 每种房型：名称、描述、价格、人容量、房间数量、图片（最多 3 张）

**图片上传实现**：

- 使用 Ant Design 的 `Upload` 组件
- 将图片转为 Base64 字符串后提交
- 后端使用 `multer` 接收并保存到 `uploads/` 目录

---

#### 1.5 InfoShow（酒店详情查看）

**文件**：`src/component/Home/InfoShow.tsx`

**功能**：

- 只读模式展示酒店详细信息
- 包括：图片轮播、基础信息、设施、房型列表
- 不可编辑，仅供查看

---

### 2. 管理员模块（AdminHome/）

#### 2.1 HotelReview（待审核酒店）

**文件**：`src/component/AdminHome/HotelReview.tsx`

**功能**：

- 获取待审核、被拒绝、草稿状态的酒店列表
- 查询参数：`status=pending,rejected&publishStatus=draft,rejected`
- **审核操作**：
  - ✅ 通过：调用 `PUT /api/hotel/:id/review`，参数 `{ approved: true }`
  - ❌ 拒绝：弹出输入框填写拒绝原因，调用 `PUT /api/hotel/:id/review`，参数 `{ approved: false, reason: "..." }`
- 查看酒店详情弹窗

---

#### 2.2 HistoryReview（历史审核记录）

**文件**：`src/component/AdminHome/HistoryReview.tsx`

**功能**：

- 查看已审核酒店的历史记录
- 支持按状态筛选：全部 / 已通过 / 已拒绝
- 查询参数：`status=published,rejected&publishStatus=draft,published`
- 分页展示

---

## 五、路由配置（Router）

**文件**：`src/router/index.tsx`

**完整路由表**：

| 路径 | 组件 | 角色 | 说明 |
|------|------|------|------|
| `/login` | Login | 通用 | 登录页 |
| `/register` | Register | 通用 | 注册页 |
| `/` | Home/InfoManage | 商户 | 商户主页（酒店列表） |
| `/info-entry` | Home/InfoEntry | 商户 | 新增酒店 |
| `/info-show/:id` | Home/InfoShow | 商户 | 查看酒店详情 |
| `/edit/:id` | Home/EditManage | 商户 | 编辑酒店 |
| `/PersonalProfile` | PersonalProfile | 通用 | 个人中心 |
| `/admin-home` | AdminHome/HotelReview | 管理员 | 管理员主页（待审核） |
| `/admin-home/history` | AdminHome/HistoryReview | 管理员 | 历史审核记录 |

**权限控制**：

- 路由跳转时检查 `localStorage` 中的 token 和用户角色
- 未登录自动跳转至 `/login`
- 商户无权访问 `/admin-home` 路由

---

## 六、类型定义（Types）

**文件**：`src/types/index.ts`

**核心类型**：

```typescript
// 用户
interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'merchant' | 'admin';
  avatar?: string;
  realName?: string;
  idCard?: string;
}

// 酒店
interface Hotel {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  ownerId: string;
  status: 'pending' | 'published' | 'rejected' | 'offline';
  publishStatus: 'draft' | 'published';
  rejectReason?: string;
  roomTypes: RoomType[];
  createdAt: string;
  updatedAt: string;
}

// 房型
interface RoomType {
  name: string;
  description: string;
  price: number;
  capacity: number;
  count: number;
  bedType?: string;
  area?: number;
  images: string[];
  amenities?: string[];
}

// API 响应
interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

// 分页数据
interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**常量定义**：

- `SUPPORTED_CITIES`：可选城市列表（如 北京、上海、杭州、成都等）
- `AVAILABLE_AMENITIES`：可选设施列表（停车场、WiFi、早餐、健身房、游泳池等）
- `LIMITS`：数量限制（酒店图片最多 9 张、房型图片最多 3 张、房型最多 10 种）

---

## 七、接口调用规范

### 1. 基础配置

- **Base URL**：`http://localhost:8080/api`
- **请求头**：
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```

### 2. 文件上传

- 使用 `multipart/form-data` 格式
- 由 Ant Design Upload 组件配合 Base64 转换实现

### 3. 核心接口示例

```typescript
import axios from 'axios';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

// 登录
axios.post('/api/auth/login', { username, password });

// 获取酒店列表
axios.get('/api/hotel/list', { params: { city: '北京', status: 'published' } });

// 创建酒店
axios.post('/api/hotel/create', formData, { headers });

// 更新酒店
axios.put('/api/hotel/update/:id', formData, { headers });

// 删除酒店
axios.delete('/api/hotel/:id', { headers });

// 提交审核
axios.post('/api/hotel/:id/submit', {}, { headers });

// 审核酒店（管理员）
axios.put('/api/hotel/:id/review', { approved: true }, { headers });
```

---

## 八、页面截图与功能对应（演示建议）

| 功能模块 | 页面/组件 | 演示要点 | 建议截图位置 |
|----------|------------|----------|-------------|
| 登录/注册 | Login/Register | 邮箱验证码流程、角色选择 | 登录页、注册页 |
| 商户管理 | InfoManage | 酒店列表、状态标签、操作按钮 | 酒店列表页 |
| 新增酒店 | InfoEntry + HotelForm | 图片上传、房型添加、表单验证 | 新增酒店表单 |
| 编辑酒店 | EditManage | 数据回显、图片替换、房型修改 | 编辑表单 |
| 管理员审核 | HotelReview | 待审核列表、审核操作弹窗 | 审核页面 |
| 审核历史 | HistoryReview | 历史记录筛选、分页 | 历史记录页 |

---

## 九、常见问题与排查

1. **登录失败**：
   - 检查后端服务是否启动（8080 端口）
   - 检查用户名、密码是否正确
   - 查看浏览器 Network 面板的响应信息

2. **图片上传失败**：
   - 检查后端 `uploads/` 目录是否有写入权限
   - 检查图片大小是否超过限制（Base64 过大）
   - 查看后端 `multer` 配置

3. **权限不足**：
   - 检查 Token 是否过期
   - 检查当前用户角色是否有权访问对应路由

4. **审核操作 404**：
   - 确认后端路由顺序（`/:id/publish` 需在 `/:id` 之前注册）
   - 检查前端请求路径是否与后端一致

---

## 十、后续扩展建议

- ✅ 引入 Redux / Zustand 进行全局状态管理
- ✅ 增加数据统计 Dashboard（酒店数量、订单量、收入等）
- ✅ 增加管理员对用户、商户的管理功能
- ✅ 集成 Excel 导入/导出酒店数据
- ✅ 增加消息通知中心（审核结果推送）

---

**维护人**：携程大作业项目组  
**更新时间**：2026-03
