import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "缺少 Supabase 环境变量。请在 .env 文件中配置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY"
  );
}

/**
 * 后端使用 Service Role Key 访问 Supabase
 * NOTE: Service Role Key 拥有绕过 RLS 的完整权限，仅在后端使用
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
