import { Router, Request, Response } from "express";
import { supabase } from "../supabase";

const router = Router();

/**
 * 获取项目列表
 * 支持查询参数：status（active | archived）
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    // 状态筛选
    if (status && typeof status === "string") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("获取项目列表失败:", error);
      return res.status(500).json({ error: error.message });
    }

    // NOTE: 转换数据库字段命名为前端 camelCase 格式
    const formatted = data.map((item) => ({
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      progress: item.progress,
      daysLeft: item.days_left,
      status: item.status,
      imageUrl: item.image_url,
      phase: item.phase,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("获取项目列表异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 创建新项目
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, subtitle, progress, daysLeft, status, imageUrl, phase } = req.body;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        subtitle,
        progress: progress || 0,
        days_left: daysLeft,
        status: status || "active",
        image_url: imageUrl,
        phase,
      })
      .select()
      .single();

    if (error) {
      console.error("创建项目失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      id: data.id,
      name: data.name,
      subtitle: data.subtitle,
      progress: data.progress,
      daysLeft: data.days_left,
      status: data.status,
      imageUrl: data.image_url,
      phase: data.phase,
    });
  } catch (err) {
    console.error("创建项目异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 更新项目
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, subtitle, progress, daysLeft, status, imageUrl, phase } = req.body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (progress !== undefined) updateData.progress = progress;
    if (daysLeft !== undefined) updateData.days_left = daysLeft;
    if (status !== undefined) updateData.status = status;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (phase !== undefined) updateData.phase = phase;

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("更新项目失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      id: data.id,
      name: data.name,
      subtitle: data.subtitle,
      progress: data.progress,
      daysLeft: data.days_left,
      status: data.status,
      imageUrl: data.image_url,
      phase: data.phase,
    });
  } catch (err) {
    console.error("更新项目异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 删除项目
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("删除项目失败:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("删除项目异常:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
