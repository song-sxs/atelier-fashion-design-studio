-- ============================================
-- Atelier 时尚设计工作室 — Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 启用 uuid 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 灵感看板表
-- ============================================
CREATE TABLE IF NOT EXISTS inspirations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT,
  colors TEXT[] DEFAULT '{}',
  height TEXT NOT NULL CHECK (height IN ('tall', 'short', 'medium')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 面料库表
-- ============================================
CREATE TABLE IF NOT EXISTS fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  weight TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  type TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 项目管理表
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  days_left INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  image_url TEXT NOT NULL,
  phase TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 自动更新 updated_at 触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inspirations_updated_at
  BEFORE UPDATE ON inspirations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fabrics_updated_at
  BEFORE UPDATE ON fabrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 种子数据 — 灵感看板
-- ============================================
INSERT INTO inspirations (title, type, image_url, colors, height, tags) VALUES
  ('2024 春夏丝绸系列', 'Runway / Silk', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRJH_2M7OP3BTKhXZ9SgKYtO7gGa5Aq_LK8SJfEO7XPtZJHvUi05zBNM1_x7_KlXX0IY9xhN9RITRi4GZ_TJeJvrw2PvMS7S5TCGRCuI5CwP-qlxWF-2mYaOB0XelYR0ocypeemnamKzgYJ0Urb2wyfzn0xxeQBzINb1OFoq56wP7hWunM6JXuXiVBZyz0nn9WI6OvRTPGVrvpeOW5Qz4WmCthuxWwamZ7XOrvF_3vYPa6wgN3PIsbIn1iwirKZH35H6KB85XvOk', '{}', 'tall', ARRAY['现代', '艺术']),
  ('精纺羊毛斜纹', 'Material / Wool', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMUww_ooIY4KiwRuxjb6L0SHrdb3AiVkK6Ka7ZW0t2kD-xxRw13pCWgcJE4NLUcSeA1Gq5WO4UEFp5YpoPwKcL5gRJq1zx9Q2OCF8uuyxqCu1BDddY_U41TwII3SgXk0bSoO7svZdvyRKzKGrat3r7Nsmt0zhCaHHU5cEEmWWpvOiR0kwR4yvp_eNs201ZeR5VaYgnbJ1qbCeGyHr2Suprn-1WiVQkkTAudCm5x6nlX4Xx7jTmi7PlteE1iZfc0-C6reuyB5Kq9s0', '{}', 'short', ARRAY['极简', '复古']),
  ('结构化廓形手稿', 'Design / Silhouette', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyDgeQ1k1YOW-EghH0A0wFUMkw-H8paq8rDrznUiGTxy3EDO3aun6uB0DS8OzR0sWKnIbt7ApFeDyg8_8ppKaQ3cU0r7z6aWmsEP8kiiPKYJIG8SrZ-QHVEAxdaDhqVMbnJE2EUuC8m4M_LSOnDEQbmvQ64erPL_GNxCakvlu25RVvldDGkZ3VnQWwjoqNBS8BgxOgwxdLl4Uf1z2NUBSlipFrgQS7RylAjc8wnCdlH86ng3DUlBQRsNitXJsHaNMJSVLrYuhA3LU', '{}', 'tall', ARRAY['艺术', '现代']),
  ('极简主义基本款', 'Mood / Minimal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN85td_PjxMWrYtLhP6fPl18fjfSfwtTL65VznqzKeFCUthmGBx6Dx5iKzx7dVT87qpk2RcBvjpHkt1dRVfcTIaCYuFnwfP4fo4ycCXoo-iSAreZlntebNlERZEUqUeDOp1EpV2_tR8ZgwXpdRgwDP4zoMy_jEe8vNYCJafe2UVwFIhg7sfyoXyBv6M-PayYRyxGD6LcSxenaoTVhMiY0cuyYzzEv0A7atbL5uZD_J3324K8ZfpehzV__QbQO-Qfub9nhvhBfuTeA', '{}', 'medium', ARRAY['极简', '现代']),
  ('晚秋调色盘', 'Palette / Autumn', NULL, ARRAY['#715858', '#fcdbda', '#e4e9ea', '#2d3435'], 'short', ARRAY['复古', '艺术']),
  ('街头潮流涂鸦', 'Street / Art', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRJH_2M7OP3BTKhXZ9SgKYtO7gGa5Aq_LK8SJfEO7XPtZJHvUi05zBNM1_x7_KlXX0IY9xhN9RITRi4GZ_TJeJvrw2PvMS7S5TCGRCuI5CwP-qlxWF-2mYaOB0XelYR0ocypeemnamKzgYJ0Urb2wyfzn0xxeQBzINb1OFoq56wP7hWunM6JXuXiVBZyz0nn9WI6OvRTPGVrvpeOW5Qz4WmCthuxWwamZ7XOrvF_3vYPa6wgN3PIsbIn1iwirKZH35H6KB85XvOk', '{}', 'medium', ARRAY['街头', '现代']);

-- ============================================
-- 种子数据 — 面料库（精选面料）
-- ============================================
INSERT INTO fabrics (name, category, weight, image_url, is_featured) VALUES
  ('精纺亚麻', 'Natural Fiber', '180 g/m²', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiet1O1BqAKGmAdo4eHqXUk-DyHt9NLkPNaoaVh3b__aYvFYTF7UiQgx3vctCqLpgtqpLEpAE0pzWL0_rdDPJQN3xkRM6k8qr-x5uudKKiuHysFIrUdc6UAYxlO-vNSiqv0rX-8xeZkOmuD1DD7Ud1iPOULkjBv3jX5LGuuuLzMMzLIsXH4-uXgieVaWsrPi06wn3FbdT_5qXNFQbS_BV934PLSK_ypgpH4XrEijqLoh_V-hGAXLj2crHgY4IvkojwdPLw04QR1MA', TRUE),
  ('有机棉', 'Cotton', '220 g/m²', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6pkADyEJEZaEudmKMIOaQx-X42h4DcVUV8vyv2aA3BUu6L3vl2awdzi8xBuYsNLPv19XjZ1ymsJnWRwOPX-E0WYUplD073S6SSboMPm1SiS0r1EUtUT_6UyFXNlQlNt7e5DsG4pHOKa6u6890p2r7KYqn3BBo7nTvmywiqMyV3QmasKiFyJEWA6c4ym2bpqtop7dNm2IHXbh6Qv18Qu6LuU5R7vJ1UD25DP74xUnribI_JorRkZ1Nz2TldXzSNJ9Qb0MSdYKtZc8', TRUE),
  ('真丝缎面', 'Silk', '80 g/m²', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbKmG1z0NL5OluzVMHVrFoSa2c0JgZfABMTo_yWDqtqqhCm8Nto39qE6NXhBSeV6aLO9AZQhWEpKm95l0oG3ERKlr8MgrO83JtqmkNZ_ueXY1Scj4vvL3HKPJpEGriugyg0_TAx0P5r7JMqML0G0cAOIqvueN0Ii5xYF-nSzY_B0K2bk4CP2f9c3I8Pa-ENSbkWjE8oyrCiI9-gWRnX3AzIyllSqNgAzryENlJ-gh6hTDymsMKW8F67OXjz1piHocEHLxYKWPnSzM', TRUE),
  ('意式羊毛', 'Wool', '320 g/m²', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBDf57wEj0WRDLqcuskh_kvlWIv2u8LSk5SqkIh82nza9pp-ASPzRDjiv_7lPewdwd5nNjAhm-Pug0exRNQ5Ol3hfkTJKOUEzIZ95svzTslEO3HFWT5Dp7c38iXxKJ1-FoyOyD4JwGyEcMONML88J16igI8IZQ8ww_Eal2A_aVR-F77ACfsM7mTdjrEfMmOAOwF40TN53DqAy54LsYkVzDUd2OMtHGtquNwi-gXLeM8rysY4kn-pI6GZGF6RMu9RrDe7skA3Lyo6I', TRUE);

-- ============================================
-- 种子数据 — 面料库（目录面料）
-- ============================================
INSERT INTO fabrics (name, category, weight, type, image_url, is_featured) VALUES
  ('重磅粗布', 'Natural Fiber', '380 g/m²', '帆布', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW_XUeTIcI3qBrTDGFbMeU3rLXWOPOVW30jQFjs2WcX0sk2o-WWCONQfuWF86l1dfNba1-Lzaid8gsnDRVJpZ8XkMHShMril-aaIc5zodM68cHP57EMTV-wtPCO1yYj3-l_2xrUbdupxmljRpKozRe7bf4Sug-629qJIpDpWPnr9AIK0AIMW9mBUWBc0HWFQQwikql8M1hMD8J4yGNEKD9Pab7hR2f6anly--FjadETb50ejy2QfrIbmk4BuhkTvUJg2zjSGnqGk0', FALSE),
  ('羊绒针织', 'Wool', '210 g/m²', '毛类', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPLFWszfxIA0GCnpKhhpGvNWrcavu6g4M5wbN1YqClCaI_N0Wqsrg_nL2SOVGj04tjyX2Cs__TmzRXRCMlDlVnuAyllP2RwQCBpyn3JuxNu1uCUzcAeEiZdRtdp5OWHOduuLWTWZpB7j63g3_2j_VPF1FiDxNQeIoq91x6AAwjJzA1UuxOWeBXHZGOWuFtIX92ZELtUsvGJg3pbDaDtPrXlToIAw5-o5fEoTIHAvyDouf13hNWqutZDqXi-EetVmd8fXCDKwjI2TE', FALSE),
  ('抗撕裂锦纶', 'Technical', '120 g/m²', '功用', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeAL-ZbySZOte4HjZcUmqdYolVBr7FSMqrOBR1GadAW7p3GFrynBEmOYUD31-rd2jF7MEbpZK_q2ayj25BOnI3ErcF7E2Xkdy3edpUnS7RZkOanB2dSkWbg2P7-fPa-fn5E-wFBx0paK3u28qeeppNilwF-Owo0ifVJ23D2sD21bAQ0vlkU6Fm2nHVJJ2tI8GBLN78JTHfGj7MFqA9Fe4d-5IqtFduVg1gmC-h9oKa9ySqb78OGWR8cEaA45MNNfa3SYFCUQYm4OI', FALSE),
  ('水洗牛仔', 'Cotton', '12.5 oz', '棉类', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSW42orrEsIZBHdwOfk5QUKZh3og1mL7nZH8S-dK2LpokVVcJKAQzvalQ8i5ygDHm4ugpFIh84sGFBPUXZz98S3QfmWQEO9AFviZtQK5LcBWRH8XHKc4AzmoCQgpnwXDNVUFUeoCh437jbXQh82rlkBCK9dkh2rtiInshN8oO3u9GjY63rm4xTV0LeTXXtMWXgNeiWAXt_15BHFN0jWLEuJrneVItWuXutZm5U1AZ-c10Hmin1iCULZ0WFVwIRLG3PwlW25SVZqaE', FALSE),
  ('真丝双绉', 'Silk', '16 momme', '丝绸', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbKmG1z0NL5OluzVMHVrFoSa2c0JgZfABMTo_yWDqtqqhCm8Nto39qE6NXhBSeV6aLO9AZQhWEpKm95l0oG3ERKlr8MgrO83JtqmkNZ_ueXY1Scj4vvL3HKPJpEGriugyg0_TAx0P5r7JMqML0G0cAOIqvueN0Ii5xYF-nSzY_B0K2bk4CP2f9c3I8Pa-ENSbkWjE8oyrCiI9-gWRnX3AzIyllSqNgAzryENlJ-gh6hTDymsMKW8F67OXjz1piHocEHLxYKWPnSzM', FALSE),
  ('植鞣牛皮', 'Leather', '2.0 mm', '皮革', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTIX66mbCuH1T8EkhlVcNgoPYTlb4CUSdXAFtm_Gz1JO3ZUgh2lXam2SP8sGMh2E7xKSD7bGasXgOpdEm1o4KYWgL9FM_J6KJ7oFQDMVSVoOHVWGfk7zqoCmSlgBYD_BLboYbvzrvuGFBG8V1dgzL0EAUE40BPrlxP_fjmfjSp4cPislpvLMeUfWC7ULSCgk9ZhEJKYAXyNSfR3f5yjwRKi_q9H9Morg1wJ5OcN6lywysSIaJO24zMcThWNY4CvX8Vur8J0EyyNB8', FALSE);

-- ============================================
-- 种子数据 — 项目管理（活跃项目）
-- ============================================
INSERT INTO projects (name, subtitle, progress, days_left, status, phase, image_url) VALUES
  ('2024 夏季系列', 'Summer Collection ''24', 65, 12, 'active', '打样阶段', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC74mOgqVsNAQHzml89rk56ozdkvqMpfbn1fbtEn4XT3WeWWkYgds6X5QpQd0_LsbNCaPehzq0JKERMswImf6cav1K1HrqW9fBSRUC0TD0LZIWn9T2MMzwpuJeh2cvLitZloB2ZMfvCYkXSywtKt5lVh9Ny_0XZN4Yec0m05Fikli_Jz5qa34iOTJLpi6bWcROGKDME_4VJTKN5yoWT6o-dIXZHUqxnkU44wuF1hT7OUMsw1cWwv6ZQiDvUhsbaoSrC3xBvRIB_Mh8'),
  ('胶囊衣橱项目', 'Capsule Essentials', 90, 4, 'active', '生产确认', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmlNw068vzpHknij5GoclYpX2WYqIWNguHGjp_47GFFybV6ct816NM-6b2aRKQCxN4gJfPc2eAT-gbtNAkFkMZHSQ5IbcMLLP5sHYf_U7uka5cNG-iVcZZe9Sl-6eUNdtnb55Tnxdpij3T6y3W2N2VlTNsf9vuaQ4Ai5upNPGiMjFyTmqOFDQ7Fj9qQMuUzlWiwH4iQTRPq-gNVpy38KiRRLvIqrvahe7UlsfuxBGyLQRLujPq24_CZkKa32gQuF1pfc2rIObigSs'),
  ('秋季高定系列', 'Autumn Haute Couture', 25, NULL, 'active', '初稿草图', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm8dfrM2L2G9iIMHlmLT48ILTWzw79N3ddTXZCkIigUhBvbEtIVottjw8IfZpttAMzxxW3EANY1_O8Pgj5AY0uX18Qg6KNI9oOxK11GHntW4E0DOfNYz_A20SCvihIdrIBnsEGBgXKJ0SiAnYZ47TdIqngnEAQfEdscwgyOm0qytrXwLDM02iq9ljGv3G7tOx9AeRt9JjgIHNdwjbIQt1cTs_q6yZrx54IbF5DKTAfRlWw-WzqWpcQMikhR9NidYBM-R6W2SPUPts');

-- ============================================
-- 种子数据 — 项目管理（归档项目）
-- ============================================
INSERT INTO projects (name, subtitle, progress, status, phase, image_url) VALUES
  ('2023 冬季大衣系列', 'Completed Jan 2024', 100, 'archived', '已完成', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1q4aynFUsAfpVADwcaCfckbPGykPrTtENZjO7-UxG6XeOQF7A5Bxt2d_09nUUjFYsG4_I8fUnHxV9K9yUCOHE3_CMgdQ-2sYR7BMO1lD_oz_GY1gYVA0_ytnWlEAIHDi7wywjwL7UzpRyRivhDP4BMLr8zniNScm2dvalO71jXCpHq1DwGb8NfeEqgshhZ3PhZFhMw8vAiuip-C3B58wmc4DUnz-UUXaDlEivHfVlBalJ3ploz1EoHPgoMwgRXAFnqUWi1kwvSeU'),
  ('环保单宁实验', 'Completed Nov 2023', 100, 'archived', '已完成', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1J5ifH3yQndqdMhhgCnjSptTbE8BiQaG4agOMPCrFhH-QUWFSkVxUFvjK5PjQoUYu4NeLx9RJ0hp2UKEp7C236KAi1NmxfTegkoglOOGpSLsAluXbhXXhEXFXoMycuxdt8CaYzgiwcfzG7GA6fD9M-WfuWIftC0kymzjFkytHRTr1rBhZRj8WlwpzUfYc1pozgr8QAVv2HKc8B0BlMl7osnnzfabFJ-NQjLPC6k3nTx3PjruyJG6_XA_nWwjlW-H2L8hhUcuM8c4');

-- ============================================
-- 为所有表启用 RLS（Row Level Security）
-- NOTE: 当前为简化设置，允许所有操作
-- 生产环境应根据认证用户设置更严格的策略
-- ============================================
ALTER TABLE inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户完整 CRUD 操作（开发阶段策略）
CREATE POLICY "Allow all operations on inspirations" ON inspirations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fabrics" ON fabrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
