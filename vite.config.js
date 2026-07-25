import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readdirSync } from 'fs';

const BASE = '/rating-pistol/';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function iconManifestPlugin() {
  const directories = ['set', 'echo'];

  function writeManifests() {
    for (const directory of directories) {
      const dir = path.resolve(
        __dirname,
        `public/wuthering-waves/${directory}`,
      );

      const files = readdirSync(dir)
        .filter(file => file.endsWith('.webp'))
        .map(file => `${BASE}wuthering-waves/${directory}/${file}`);

      writeFileSync(
        path.resolve(dir, 'manifest.json'),
        JSON.stringify(files),
      );
    }
  }

  return {
    name: 'generate-icon-manifests',
    buildStart: writeManifests,

    configureServer(server) {
      writeManifests();

      for (const directory of directories) {
        const dir = path.resolve(
          __dirname,
          `public/wuthering-waves/${directory}`,
        );

        server.watcher.add(dir);
      }

      server.watcher.on('change', file => {
        if (file.includes('public/wuthering-waves/set') ||
            file.includes('public/wuthering-waves/echo')) {
          writeManifests();
        }
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