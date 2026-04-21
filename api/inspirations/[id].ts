import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../_lib/supabase";

/**
 * PUT    /api/inspirations/:id    更新灵感
 * DELETE /api/inspirations/:id    删除灵感
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  if (req.method === "PUT") {
    const { title, type, imageUrl, colors, height, tags } = req.body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (colors !== undefined) updateData.colors = colors;
    if (height !== undefined) updateData.height = height;
    if (tags !== undefined) updateData.tags = tags;

    const { data, error } = await supabase
      .from("inspirations").update(updateData).eq("id", id).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({
      id: data.id, title: data.title, type: data.type,
      imageUrl: data.image_url, colors: data.colors,
      height: data.height, tags: data.tags,
    });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("inspirations").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
