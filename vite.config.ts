import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// На GitHub Pages сайт живёт в подпапке /school-crm/, локально — в корне.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.BASE_PATH ?? '/school-crm/') : '/',
  plugins: [react(), tailwindcss()],
}))
