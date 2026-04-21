import type { VercelRequest, VercelResponse } from "@vercel/node";

/** GET /api/health — 健康检查端点 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
