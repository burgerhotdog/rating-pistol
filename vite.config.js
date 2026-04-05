import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readdirSync } from 'fs';

const BASE = '/rating-pistol/';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function iconManifestPlugin() {
  function writeManifest() {
    const dir = path.resolve(__dirname, 'public/wuthering-waves/set');
    const files = readdirSync(dir)
      .filter(f => f.endsWith('.webp'))
      .map(f => `${BASE}wuthering-waves/set/${f}`);
    writeFileSync(
      path.resolve(__dirname, 'public/wuthering-waves/set/manifest.json'),
      JSON.stringify(files)
    );
  }

  return {
    name: 'generate-icon-manifest',
    buildStart: writeManifest,
    configureServer(server) {
      writeManifest();
      server.watcher.add(path.resolve(__dirname, 'public/wuthering-waves/set'));
      server.watcher.on('change', (file) => {
        if (file.includes('wuthering-waves/set')) writeManifest();
      });
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), iconManifestPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
