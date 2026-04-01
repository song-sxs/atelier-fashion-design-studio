import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR 在 AI Studio 中通过 DISABLE_HMR 环境变量禁用
      hmr: process.env.DISABLE_HMR !== 'true',
      // NOTE: 将 /api 请求代理到 Express 后端服务
      proxy: {
        '/api': {
          target: `http://localhost:${env.API_PORT || 3001}`,
          changeOrigin: true,
        },
      },
    },
  };
});
