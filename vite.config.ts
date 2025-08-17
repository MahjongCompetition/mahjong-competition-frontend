import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        // 代理所有 /api 开头的请求到后端服务器
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080', // 从环境变量读取后端地址
          changeOrigin: true, // 改变请求头中的 origin
          secure: false, // 如果是 https 接口，需要配置这个参数
          rewrite: (path) => path.replace(/^\/api/, '/api'), // 路径重写，保持 /api 前缀
          // 如果需要调试，可以添加以下配置
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        // 如果需要代理其他路径，可以添加更多配置
        // '/other-api': {
        //   target: 'http://localhost:8081',
        //   changeOrigin: true,
        //   secure: false,
        // },
      },
    },
  }
})
