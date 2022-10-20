import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import pkg from './package.json';

process.env.VITE_APP_BUILD_EPOCH = new Date().getTime();
process.env.VITE_APP_VERSION = pkg.version;


export default defineConfig({
	plugins: [
		vue(),
	],
	build: {
		outDir: path.resolve(__dirname, './dist'),
		emptyOutDir: true,

		rollupOptions: {
			input: ['./src/main.ts'],
		},
	},

	server: {
		cors: true,
		strictPort: true,
		port: 3000,
		hmr: {
			host: 'localhost',
		},
	},
});
