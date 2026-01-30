/**
 * ==========================================
 * 酒店管理系统 - API 接口服务
 * ==========================================
 *
 * 本模块提供完整的 CRUD 操作和业务逻辑接口
 * 对接后端 RESTful API
 */

import type {
  User,
  Hotel,
  RoomType,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiResponse,
  CreateHotelRequest,
  UpdateHotelRequest,
  ReviewHotelRequest,
  PublishHotelRequest
} from '../types';

// ==================== API 基础配置 ====================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Token 存储键名
const TOKEN_KEY = 'hotel_token';
const CURRENT_USER_KEY = 'hotel_current_user';

// ==================== Token 管理 ====================

/** 获取认证 Token */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/** 设置认证 Token */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** 清除认证 Token */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/** 获取认证请求头 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==================== 请求封装 ====================

/**
 * 发送 API 请求
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        error: data.error || '请求失败'
      };
    }

    return data;
  } catch (error) {
    console.error('API 请求错误:', error);
    return {
      success: false,
      code: 500,
      error: '网络请求失败，请检查服务器是否启动'
    };
  }
}

// ==================== API 服务类 ====================

export const api = {
  // ==================== 用户认证模块 ====================

  /**
   * 用户登录
   * POST /api/auth/login
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (response.success && response.data) {
      setToken(response.data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * 用户注册
   * POST /api/auth/register
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<Omit<User, 'password'>>> => {
    return request<Omit<User, 'password'>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * 用户登出
   * POST /api/auth/logout
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await request<void>('/api/auth/logout', {
      method: 'POST'
    });

    if (response.success) {
      removeToken();
      localStorage.removeItem(CURRENT_USER_KEY);
    }

    return response;
  },

  /**
   * 获取当前登录用户
   * GET /api/auth/me
   */
  getCurrentUser: async (): Promise<ApiResponse<Omit<User, 'password'>>> => {
    return request<Omit<User, 'password'>>('/api/auth/me');
  },

  /**
   * 获取本地缓存的当前用户
   */
  getLocalCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * 验证 Token 有效性
   * GET /api/auth/verify
   */
  verifyToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
    return request<{ valid: boolean }>('/api/auth/verify');
  },

  // ==================== 酒店管理模块 ====================

  /**
   * 获取所有已发布酒店
   * GET /api/hotels
   */
  getHotels: async (params?: { page?: number; pageSize?: number; city?: string; keyword?: string }): Promise<ApiResponse<{ items: Hotel[]; total: number; page: number; pageSize: number; totalPages: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.city) queryParams.set('city', params.city);
    if (params?.keyword) queryParams.set('keyword', params.keyword);

    const query = queryParams.toString();
    const endpoint = `/api/hotels${query ? `?${query}` : ''}`;

    return request(endpoint);
  },

  /**
   * 获取指定酒店详情
   * GET /api/hotels/:id
   */
  getHotelById: async (id: string): Promise<ApiResponse<Hotel>> => {
    return request<Hotel>(`/api/hotels/${id}`);
  },

  /**
   * 获取当前用户的酒店列表
   * GET /api/hotels/my/list
   */
  getMyHotels: async (): Promise<ApiResponse<Hotel[]>> => {
    return request<Hotel[]>('/api/hotels/my/list');
  },

  /**
   * 创建酒店
   * POST /api/hotels
   */
  createHotel: async (data: CreateHotelRequest): Promise<ApiResponse<Hotel>> => {
    return request<Hotel>('/api/hotels', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * 更新酒店信息
   * PUT /api/hotels/:id
   */
  updateHotel: async (id: string, data: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
    return request<Hotel>(`/api/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * 删除酒店
   * DELETE /api/hotels/:id
   */
  deleteHotel: async (id: string): Promise<ApiResponse<void>> => {
    return request<void>(`/api/hotels/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * 获取当前商户待审核的酒店
   * GET /api/hotels/my/pending
   */
  getMyPendingHotels: async (): Promise<ApiResponse<Hotel[]>> => {
    return request<Hotel[]>('/api/hotels/my/pending');
  },

  // ==================== 管理员模块 ====================

  /**
   * 获取所有酒店（管理员）
   * GET /api/admin/hotels
   */
  getAllHotels: async (params?: { page?: number; pageSize?: number; status?: string }): Promise<ApiResponse<{ items: Hotel[]; total: number; page: number; pageSize: number; totalPages: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.status) queryParams.set('status', params.status);

    const query = queryParams.toString();
    const endpoint = `/api/admin/hotels${query ? `?${query}` : ''}`;

    return request(endpoint);
  },

  /**
   * 获取待审核酒店列表
   * GET /api/admin/hotels/pending
   */
  getPendingHotels: async (): Promise<ApiResponse<Hotel[]>> => {
    return request<Hotel[]>('/api/admin/hotels/pending');
  },

  /**
   * 获取所有已发布酒店
   * GET /api/admin/hotels/published
   */
  getPublishedHotels: async (): Promise<ApiResponse<Hotel[]>> => {
    return request<Hotel[]>('/api/admin/hotels/published');
  },

  /**
   * 审核酒店
   * POST /api/admin/hotels/:id/review
   */
  reviewHotel: async (id: string, data: ReviewHotelRequest): Promise<ApiResponse<Hotel>> => {
    return request<Hotel>(`/api/admin/hotels/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * 发布/下线酒店
   * POST /api/admin/hotels/:id/publish
   */
  publishHotel: async (id: string, data: PublishHotelRequest): Promise<ApiResponse<Hotel>> => {
    return request<Hotel>(`/api/admin/hotels/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * 删除酒店（管理员）
   * DELETE /api/admin/hotels/:id
   */
  adminDeleteHotel: async (id: string): Promise<ApiResponse<void>> => {
    return request<void>(`/api/admin/hotels/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * 获取统计摘要
   * GET /api/admin/stats/summary
   */
  getStatsSummary: async (): Promise<ApiResponse<{
    totalHotels: number;
    pendingHotels: number;
    approvedHotels: number;
    publishedHotels: number;
    totalUsers: number;
    totalMerchants: number;
    totalAdmins: number;
  }>> => {
    return request('/api/admin/stats/summary');
  },

  /**
   * 获取城市分布统计
   * GET /api/admin/stats/cities
   */
  getCityStats: async (): Promise<ApiResponse<{ city: string; count: number }[]>> => {
    return request('/api/admin/stats/cities');
  }
};

export default api;
