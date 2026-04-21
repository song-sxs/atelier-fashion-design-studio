import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../_lib/supabase";

/**
 * PUT    /api/projects/:id    更新项目
 * DELETE /api/projects/:id    删除项目
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  if (req.method === "PUT") {
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
      .from("projects").update(updateData).eq("id", id).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({
      id: data.id, name: data.name, subtitle: data.subtitle,
      progress: data.progress, daysLeft: data.days_left,
      status: data.status, imageUrl: data.image_url, phase: data.phase,
    });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
