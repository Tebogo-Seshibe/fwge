import { sveltekit } from '@sveltejs/kit/vite';
import { esbuildDecorators } from '@anatine/esbuild-decorators';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		esbuildDecorators(),
		sveltekit(),
	],
	esbuild:{
		loader: 'ts'
	}
});
