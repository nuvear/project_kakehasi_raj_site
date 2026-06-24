import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        framework: 'framework.html',
        blogs: 'blogs.html',
        'enterprise-ai-reference-guide': 'enterprise-ai-reference-guide.html',
        'ai-executive-talking-points': 'ai-executive-talking-points.html',
        'responsible-ai-governance-adoption': 'responsible-ai-governance-adoption.html',
        'responsible-ai-infographic': 'responsible-ai-infographic.html',
        'ai-talking-points-infographic': 'ai-talking-points-infographic.html',
        'singapore-ai-strategy-status': 'singapore-ai-strategy-status.html',
        'singapore-ai-strategy-infographics': 'singapore-ai-strategy-infographics.html',
        'blood-pressure-app-design': 'blood-pressure-app-design.html',
        'bp-chart-infographic': 'bp-chart-infographic.html',
        'bp': 'bp.html',
        'deployment-guide': 'deployment-guide.html',
        'ai-transformation-command-center': 'ai-transformation-command-center.html',
      },
    },
  },
})