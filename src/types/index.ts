/**
 * ==========================================
 * 酒店管理系统 - 数据类型规范
 * ==========================================
 */

// ==================== 用户相关类型 ====================

/** 用户角色类型 */
export type UserRole = 'merchant' | 'admin';

/** 用户状态 */
export type UserStatus = 'active' | 'inactive';

/** 用户基础信息 */
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

/** 用户注册请求 */
export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRole;
}

/** 用户登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 用户登录响应 */
export interface LoginResponse {
  user: User;
  token: string;
}

// ==================== 酒店相关类型 ====================

/** 酒店审核状态 */
export type HotelReviewStatus = 'pending' | 'approved' | 'rejected';

/** 酒店发布状态 */
export type HotelPublishStatus = 'published' | 'unpublished';

/** 酒店基础信息 */
export interface Hotel {
  // 基础信息
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  
  // 价格与评分
  price: number;
  rating: number;
  
  // 图片与设施
  images: string[];
  amenities: string[];
  
  // 关联信息
  ownerId: string;
  ownerName: string;
  
  // 状态管理
  status: HotelReviewStatus;
  publishStatus: HotelPublishStatus;
  rejectReason?: string;
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
  
  // 扩展信息
  roomTypes: RoomType[];
  contactPhone: string;
  checkInTime: string;
  checkOutTime: string;
}

// ==================== 房型相关类型 ====================

/** 房型信息 */
export interface RoomType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  count: number;
  amenities: string[];
}

// ==================== API 响应类型 ====================

/** 通用 API 响应 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/** 分页数据 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 分页请求参数 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ==================== 请求参数类型 ====================

/** 创建酒店请求 */
export interface CreateHotelRequest {
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  roomTypes: Omit<RoomType, 'id'>[];
  contactPhone: string;
  checkInTime: string;
  checkOutTime: string;
}

/** 更新酒店请求 */
export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
  id: string;
}

/** 酒店审核请求 */
export interface ReviewHotelRequest {
  approved: boolean;
  reason?: string;
}

/** 酒店发布请求 */
export interface PublishHotelRequest {
  publish: boolean;
}

// ==================== 数据校验规则 ====================

/**
 * 数据校验规范
 * 
 * 1. 用户名：3-20位，支持字母、数字、下划线
 * 2. 密码：至少6位
 * 3. 酒店名称：2-50位，不能为空
 * 4. 价格：0-999999，单位：元
 * 5. 评分：0-5，精度：0.1
 * 6. 城市：必须是中国主要城市之一
 * 7. 图片：URL格式，支持 jpg、png、webp
 */

// ==================== 常量定义 ====================

/** 支持的城市列表 */
export const SUPPORTED_CITIES = [
  '北京', '上海', '广州', '深圳', '杭州',
  '成都', '武汉', '西安', '南京', '重庆',
  '苏州', '天津', '长沙', '青岛', '厦门',
  '昆明', '大连', '沈阳', '哈尔滨', '济南'
] as const;

/** 可选便利设施列表 */
export const AVAILABLE_AMENITIES = [
  'WiFi', '游泳池', '健身房', '餐厅', '停车场',
  'SPA', '江景', '早餐', '接机服务', '行李寄存',
  '24小时前台', '空调', '电视', '浴缸', '阳台',
  '电梯', '会议室', '商务中心', '儿童游乐场', '宠物友好'
] as const;

/** 默认图片 */
export const DEFAULT_HOTEL_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

/** 默认房型图片 */
export const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';

