import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../_lib/supabase";

/**
 * PUT    /api/fabrics/:id    更新面料
 * DELETE /api/fabrics/:id    删除面料
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  if (req.method === "PUT") {
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
      .from("fabrics").update(updateData).eq("id", id).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({
      id: data.id, name: data.name, category: data.category,
      weight: data.weight, tags: data.tags,
      imageUrl: data.image_url, type: data.type,
      isFeatured: data.is_featured,
    });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("fabrics").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
