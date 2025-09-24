import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // process.env.NODE_ENV = 'production';

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.tsx',
                refresh: true,
                // buildDirectory: 'build',
            }),
            react(),
        ],
        // build: {
        //     minify: true,
        //     outDir: 'public/build',
        //     rollupOptions: {
        //         output: {
        //             manualChunks: undefined,
        //         },
        //     },
        // },
        resolve: {
            alias: {
                url: false
            }
        }
    };
});
