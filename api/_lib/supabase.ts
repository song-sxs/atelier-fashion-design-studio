import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Vercel Serverless Functions 共用的 Supabase 客户端
 * 使用 Service Role Key，绕过 RLS 限制
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
