import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

/**
 * 获取面料列表
 * 支持查询参数：category（分类筛选）、featured（是否精选）
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;

    let query = supabase
      .from("fabrics")
      .select("*")
      .order("created_at", { ascending: false });

    // 分类筛选
    if (category && typeof category === "string" && category !== "all") {
      query = query.eq("category", category);
    }

    // 精选筛选
    if (featured === "true") {
      query = query.eq("is_featured", true);
    } else if (featured === "false") {
      query = query.eq("is_featured", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("获取面料列表失败:", error);
      return res.status(500).json({ error: error.message });
    }

    // NOTE: 转换数据库字段命名为前端 camelCase 格式
    const formatted = data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      weight: item.weight,
      tags: item.tags,
      imageUrl: item.image_url,
      type: item.type,
      isFeatured: item.is_featured,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("获取面料列表异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 创建新面料
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, category, weight, tags, imageUrl, type, isFeatured } = req.body;

    const { data, error } = await supabase
      .from("fabrics")
      .insert({
        name,
        category,
        weight,
        tags: tags || [],
        image_url: imageUrl,
        type,
        is_featured: isFeatured || false,
      })
      .select()
      .single();

    if (error) {
      console.error("创建面料失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      id: data.id,
      name: data.name,
      category: data.category,
      weight: data.weight,
      tags: data.tags,
      imageUrl: data.image_url,
      type: data.type,
      isFeatured: data.is_featured,
    });
  } catch (err) {
    console.error("创建面料异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 更新面料
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, weight, tags, imageUrl, type, isFeatured } = req.body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (weight !== undefined) updateData.weight = weight;
    if (tags !== undefined) updateData.tags = tags;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (type !== undefined) updateData.type = type;
    if (isFeatured !== undefined) updateData.is_featured = isFeatured;

    const { data, error } = await supabase
      .from("fabrics")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("更新面料失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      id: data.id,
      name: data.name,
      category: data.category,
      weight: data.weight,
      tags: data.tags,
      imageUrl: data.image_url,
      type: data.type,
      isFeatured: data.is_featured,
    });
  } catch (err) {
    console.error("更新面料异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 删除面料
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("fabrics")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("删除面料失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("删除面料异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
