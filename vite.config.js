import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const isCI = !!process.env.GITHUB_ACTIONS
  const base = isCI && repo ? `/${repo}/` : '/'
  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
