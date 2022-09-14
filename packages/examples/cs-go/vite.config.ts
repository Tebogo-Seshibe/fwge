import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import swc from 'rollup-plugin-swc'

export default defineConfig(
{
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ]
        }
    },
    plugins:
    [
        swc(
        {
            jsc:
            {
                parser:
                {
                    syntax: 'typescript',
                    dynamicImport: true,
                    decorators: true
                },
                target: 'es2021',
                transform:
                {
                    decoratorMetadata: true
                }
            }
        })
    ],
    esbuild: false
})
