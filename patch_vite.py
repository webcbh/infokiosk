import re

with open("vite.config.ts", "r") as f:
    content = f.read()

replacement = """    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) {
                return 'lucide-icons';
              }
              if (id.includes('framer-motion') || id.includes('motion')) {
                return 'motion';
              }
              if (id.includes('react-dom') || id.includes('react')) {
                return 'react-vendor';
              }
              if (id.includes('firebase')) {
                return 'firebase';
              }
              if (id.includes('@vis.gl') || id.includes('google-maps')) {
                return 'google-maps';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {"""

content = content.replace("    server: {", replacement)

with open("vite.config.ts", "w") as f:
    f.write(content)
