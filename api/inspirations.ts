import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

/**
 * GET  /api/inspirations        获取灵感列表（支持 tag/search 筛选）
 * POST /api/inspirations        新增灵感
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 允许跨域（前端同域时无需此配置，防御性保留）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { tag, search } = req.query;

    let query = supabase
      .from("inspirations")
      .select("*")
      .order("created_at", { ascending: false });

    if (tag && typeof tag === "string" && tag !== "全部") {
      query = query.contains("tags", [tag]);
    }
    if (search && typeof search === "string") {
      query = query.or(`title.ilike.%${search}%,type.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.json(
      data.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        imageUrl: item.image_url,
        colors: item.colors,
        height: item.height,
        tags: item.tags,
      }))
    );
  }

  if (req.method === "POST") {
    const { title, type, imageUrl, colors, height, tags } = req.body;

    const { data, error } = await supabase
      .from("inspirations")
      .insert({ title, type, image_url: imageUrl, colors: colors || [], height, tags: tags || [] })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({
      id: data.id, title: data.title, type: data.type,
      imageUrl: data.image_url, colors: data.colors,
      height: data.height, tags: data.tags,
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
