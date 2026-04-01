import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

/**
 * 获取灵感列表
 * 支持查询参数：tag（标签筛选）、search（搜索关键词）
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { tag, search } = req.query;

    let query = supabase
      .from("inspirations")
      .select("*")
      .order("created_at", { ascending: false });

    // 标签筛选：使用 PostgreSQL 数组包含操作
    if (tag && typeof tag === "string" && tag !== "全部") {
      query = query.contains("tags", [tag]);
    }

    // 搜索：模糊匹配标题或类型
    if (search && typeof search === "string") {
      query = query.or(`title.ilike.%${search}%,type.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("获取灵感列表失败:", error);
      return res.status(500).json({ error: error.message });
    }

    // NOTE: 将数据库字段命名风格(snake_case)转换为前端期望格式(camelCase)
    const formatted = data.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      imageUrl: item.image_url,
      colors: item.colors,
      height: item.height,
      tags: item.tags,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("获取灵感列表异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 创建新灵感
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, type, imageUrl, colors, height, tags } = req.body;

    const { data, error } = await supabase
      .from("inspirations")
      .insert({
        title,
        type,
        image_url: imageUrl,
        colors: colors || [],
        height,
        tags: tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error("创建灵感失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      id: data.id,
      title: data.title,
      type: data.type,
      imageUrl: data.image_url,
      colors: data.colors,
      height: data.height,
      tags: data.tags,
    });
  } catch (err) {
    console.error("创建灵感异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 更新灵感
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, imageUrl, colors, height, tags } = req.body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (colors !== undefined) updateData.colors = colors;
    if (height !== undefined) updateData.height = height;
    if (tags !== undefined) updateData.tags = tags;

    const { data, error } = await supabase
      .from("inspirations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("更新灵感失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      id: data.id,
      title: data.title,
      type: data.type,
      imageUrl: data.image_url,
      colors: data.colors,
      height: data.height,
      tags: data.tags,
    });
  } catch (err) {
    console.error("更新灵感异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 删除灵感
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("inspirations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("删除灵感失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("删除灵感异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
