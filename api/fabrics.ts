import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

/**
 * GET  /api/fabrics    获取面料列表（支持 category/featured 筛选）
 * POST /api/fabrics    新增面料
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { category, featured } = req.query;

    let query = supabase
      .from("fabrics")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && typeof category === "string" && category !== "all") {
      query = query.eq("category", category);
    }
    if (featured === "true") {
      query = query.eq("is_featured", true);
    } else if (featured === "false") {
      query = query.eq("is_featured", false);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.json(
      data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        weight: item.weight,
        tags: item.tags,
        imageUrl: item.image_url,
        type: item.type,
        isFeatured: item.is_featured,
      }))
    );
  }

  if (req.method === "POST") {
    const { name, category, weight, tags, imageUrl, type, isFeatured } = req.body;

    const { data, error } = await supabase
      .from("fabrics")
      .insert({
        name, category, weight,
        tags: tags || [],
        image_url: imageUrl,
        type,
        is_featured: isFeatured || false,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({
      id: data.id, name: data.name, category: data.category,
      weight: data.weight, tags: data.tags,
      imageUrl: data.image_url, type: data.type,
      isFeatured: data.is_featured,
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
