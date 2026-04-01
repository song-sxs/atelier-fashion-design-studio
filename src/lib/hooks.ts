import { useState, useEffect, useCallback } from "react";
import { Inspiration, Fabric, Project } from "../types";
import { inspirationApi, fabricApi, projectApi } from "./api";

/**
 * 通用数据加载状态
 */
interface UseDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ============================================
// 灵感看板 Hook
// ============================================

/**
 * 管理灵感数据的加载、筛选和搜索
 * @param tag 标签筛选
 * @param search 搜索关键词
 */
export function useInspirations(tag?: string, search?: string): UseDataState<Inspiration> {
  const [data, setData] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await inspirationApi.getAll(tag, search);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载灵感数据失败";
      setError(message);
      console.error("useInspirations error:", err);
    } finally {
      setLoading(false);
    }
  }, [tag, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// 面料库 Hook
// ============================================

/**
 * 管理面料数据的加载和分类筛选
 * @param category 分类筛选
 * @param featured 是否精选
 */
export function useFabrics(category?: string, featured?: boolean): UseDataState<Fabric> {
  const [data, setData] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fabricApi.getAll(category, featured);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载面料数据失败";
      setError(message);
      console.error("useFabrics error:", err);
    } finally {
      setLoading(false);
    }
  }, [category, featured]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// 项目管理 Hook
// ============================================

/**
 * 管理项目数据的加载和状态筛选
 * @param status 状态筛选（active | archived）
 */
export function useProjects(status?: string): UseDataState<Project> {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await projectApi.getAll(status);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载项目数据失败";
      setError(message);
      console.error("useProjects error:", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
