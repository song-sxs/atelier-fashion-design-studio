import express from "express";
import dotenv from "dotenv";
import inspirationsRouter from "./routes/inspirations";
import fabricsRouter from "./routes/fabrics";
import projectsRouter from "./routes/projects";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// 中间件
app.use(express.json());

// API 路由
app.use("/api/inspirations", inspirationsRouter);
app.use("/api/fabrics", fabricsRouter);
app.use("/api/projects", projectsRouter);

// 健康检查端点
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API 服务已启动: http://localhost:${PORT}`);
});
