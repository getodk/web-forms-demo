import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import { resolve } from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const webFormsPackage = JSON.parse(
  readFileSync(resolve(__dirname, './node_modules/@getodk/web-forms/package.json'), 'utf-8')
);

const copyConfigFile = viteStaticCopy({
	targets: [
		{
			src: 'src/config.json',
			dest: '', // root
		},
	],
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), copyConfigFile],
	base: './',
  define: {
    __WEB_FORMS_VERSION__: JSON.stringify(webFormsPackage.version)
  },
})
