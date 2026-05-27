import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import { resolve } from 'node:path';

const webFormsPackage = JSON.parse(
  readFileSync(resolve(__dirname, './node_modules/@getodk/web-forms/package.json'), 'utf-8')
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  define: {
    __WEB_FORMS_VERSION__: JSON.stringify(webFormsPackage.version)
  },
})
