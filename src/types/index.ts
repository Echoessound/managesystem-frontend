/**
 * ==========================================
 * 酒店管理系统 - 数据类型规范
 * ==========================================
 */

// ==================== 通用类型 ====================

/** 图片格式类型 */
export type ImageFormat = 'url' | 'base64' | 'file';

/** 图片数据类型 */
export interface ImageData {
    url?: string;           // URL 地址
    base64?: string;       // Base64 编码
    file?: File;           // 文件对象（仅前端使用）
    format?: ImageFormat;  // 图片格式类型
}

/** 酒店图片信息 */
export interface HotelImage {
    url: string;           // 图片地址
    format: ImageFormat;  // 图片格式
    isExternal: boolean;  // 是否是外部URL
}

// ==================== 用户相关类型 ====================

/** 用户角色类型 */
export type UserRole = 'merchant' | 'admin'|'user';

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
export type HotelReviewStatus = 'pending' | 'published' | 'rejected' | 'offline';

/** 酒店审核状态中文映射 */
export const HotelReviewStatusText: Record<HotelReviewStatus, string> = {
    'pending': '待审核',
    'published': '已通过',
    'rejected': '已拒绝',
    'offline': '已下线'
};

/** 酒店审核状态颜色映射 */
export const HotelReviewStatusColor: Record<HotelReviewStatus, string> = {
    'pending': 'orange',
    'published': 'green',
    'rejected': 'red',
    'offline': 'default'
};

/** 酒店是否可以进行上下线操作 */
export const canTogglePublish = (status: HotelReviewStatus): boolean => {
    return status === 'published' || status === 'offline';
};

/** 酒店发布状态 */
export type HotelPublishStatus = 'published' | 'draft';/*发布状态：已发布、未发布*/

/** 酒店发布状态颜色映射 */
export const HotelPublishStatusColor: Record<HotelPublishStatus, string> = {
    'published': 'green',
    'unpublished': 'orange'
};

/** 酒店发布状态中文映射 */
export const HotelPublishStatusText: Record<HotelPublishStatus, string> = {
    'published': '已发布',
    'unpublished': '未发布'
};



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
    images: string[];          // 图片URL数组
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
    id?: string;
    name: string;
    description?: string;              // 房型简介
    images: string[];                  // 房型图片数组（支持多张，最多3张）
    price: number;
    capacity: number;
    count: number;
    amenities?: string[];
}

// ==================== 表单相关类型 ====================

/** 酒店表单数据（用于录入和编辑） */
export interface HotelFormData {
    // 基础信息
    name: string;
    description?: string;
    address?: string;
    city: string;
    contactPhone?: string;
    price: number;
    rating?: number;
    
    // 设施
    amenities: string[];
    
    // 房型
    roomTypes: RoomTypeFormData[];
    
    // 图片文件（仅前端使用，提交时转换为Base64或文件）
    images: UploadFile[];
}

/** 房型表单数据（用于录入和编辑） */
export interface RoomTypeFormData {
    id?: string;
    name: string;
    description?: string;
    images: UploadFile[];          // 房型图片数组（最多3张）
    price: number;
    capacity: number;
    count: number;
    amenities?: string[];
}

/** 上传文件类型（Ant Design Upload 文件对象） */
export interface UploadFile {
    uid: string;
    name: string;
    status?: 'done' | 'uploading' | 'error' | 'removed';
    url?: string;                   // 预览URL
    preview?: string;              // Base64预览
    originFileObj?: File;          // 原始文件对象
    [key: string]: any;
}

// ==================== API 响应类型 ====================

/** 通用 API 响应 */
export interface ApiResponse<T> {
    code: number;
    message?: string;
    data?: T;
    success?: boolean;
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
    city?: string;
    status?: HotelReviewStatus;
    ownerId?: string;
}

// ==================== 请求参数类型 ====================

/** 创建酒店请求 */
export interface CreateHotelRequest {
    ownerId: string;               // 酒店所有者id
    ownerName?: string;             // 酒店所有者名称
    name: string;                   // 酒店名称
    description?: string;           // 酒店描述
    address?: string;               // 酒店地址
    city: string;                   // 酒店城市
    price: number;                  // 酒店价格
    rating?: number;                // 酒店评分
    images: string[];               // 酒店图片（Base64或URL）
    amenities?: string[];           // 酒店设施
    roomTypes: CreateRoomTypeRequest[]; // 酒店房型
    contactPhone?: string;          // 酒店联系电话
    checkInTime?: string;           // 酒店入住时间
    checkOutTime?: string;          // 酒店退房时间
}

/** 创建房型请求 */
export interface CreateRoomTypeRequest {
    name: string;
    description?: string;
    images?: string[];              // 房型图片（Base64或URL）
    price: number;
    capacity: number;
    count: number;
    amenities?: string[];
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
 * 7. 图片：URL格式或Base64，支持 jpg、png、webp
 * 8. 酒店图片：最多9张
 * 9. 房型图片：每种房型最多3张
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

/** 限制常量 */
export const LIMITS = {
    HOTEL_IMAGES_MAX: 9,           // 酒店图片最多9张
    ROOM_IMAGES_MAX: 3,            // 每个房型图片最多3张
    ROOM_TYPES_MAX: 10,            // 最多10种房型
} as const;

/** 默认图片 */
export const DEFAULT_HOTEL_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

/** 默认房型图片 */
export const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w://800';

/** Base64 图片正则表达式 */
export const BASE64_REGEX = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;

/** 判断是否为Base64图片 */
export const isBase64Image = (str: string): boolean => {
    return BASE64_REGEX.test(str);
};

/** 获取Base64图片的MIME类型 */
export const getBase64MimeType = (base64: string): string | null => {
    const match = base64.match(/^data:image\/(\w+);base64,/);
    return match ? match[1] : null;
};
