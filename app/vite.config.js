import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose GEMINI_* (e.g. GEMINI_API_KEY) from .env to import.meta.env for local demo.
  envPrefix: ['VITE_', 'GEMINI_'],
  define: {
    // Set by Playwright webServer so E2E builds stay on the local mock classifier.
    'import.meta.env.VITE_PLAYWRIGHT': JSON.stringify(process.env.PLAYWRIGHT || ''),
  },
})
