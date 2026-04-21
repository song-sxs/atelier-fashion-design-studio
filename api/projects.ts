import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

/**
 * GET  /api/projects    获取项目列表（支持 status 筛选）
 * POST /api/projects    新增项目
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { status } = req.query;

    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && typeof status === "string") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.json(
      data.map((item) => ({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle,
        progress: item.progress,
        daysLeft: item.days_left,
        status: item.status,
        imageUrl: item.image_url,
        phase: item.phase,
      }))
    );
  }

  if (req.method === "POST") {
    const { name, subtitle, progress, daysLeft, status, imageUrl, phase } = req.body;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name, subtitle,
        progress: progress || 0,
        days_left: daysLeft,
        status: status || "active",
        image_url: imageUrl,
        phase,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({
      id: data.id, name: data.name, subtitle: data.subtitle,
      progress: data.progress, daysLeft: data.days_left,
      status: data.status, imageUrl: data.image_url, phase: data.phase,
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
