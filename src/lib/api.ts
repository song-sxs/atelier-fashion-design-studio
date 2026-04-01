import { Inspiration, Fabric, Project } from "../types";

const API_BASE = "/api";

/**
 * 通用请求封装，统一处理错误
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  // DELETE 返回 204 无内容
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ============================================
// 灵感看板 API
// ============================================

export const inspirationApi = {
  /**
   * 获取灵感列表
   * @param tag 标签筛选
   * @param search 搜索关键词
   */
  getAll: (tag?: string, search?: string): Promise<Inspiration[]> => {
    const params = new URLSearchParams();
    if (tag && tag !== "全部") params.set("tag", tag);
    if (search) params.set("search", search);
    const qs = params.toString();
    return request(`/inspirations${qs ? `?${qs}` : ""}`);
  },

  create: (data: Omit<Inspiration, "id">): Promise<Inspiration> =>
    request("/inspirations", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Inspiration>): Promise<Inspiration> =>
    request(`/inspirations/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    request(`/inspirations/${id}`, { method: "DELETE" }),
};

// ============================================
// 面料库 API
// ============================================

export const fabricApi = {
  /**
   * 获取面料列表
   * @param category 分类筛选
   * @param featured 是否精选
   */
  getAll: (category?: string, featured?: boolean): Promise<Fabric[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (featured !== undefined) params.set("featured", String(featured));
    const qs = params.toString();
    return request(`/fabrics${qs ? `?${qs}` : ""}`);
  },

  create: (data: Omit<Fabric, "id">): Promise<Fabric> =>
    request("/fabrics", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Fabric>): Promise<Fabric> =>
    request(`/fabrics/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    request(`/fabrics/${id}`, { method: "DELETE" }),
};

// ============================================
// 项目管理 API
// ============================================

export const projectApi = {
  /**
   * 获取项目列表
   * @param status 状态筛选（active | archived）
   */
  getAll: (status?: string): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const qs = params.toString();
    return request(`/projects${qs ? `?${qs}` : ""}`);
  },

  create: (data: Omit<Project, "id">): Promise<Project> =>
    request("/projects", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Project>): Promise<Project> =>
    request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    request(`/projects/${id}`, { method: "DELETE" }),
};
