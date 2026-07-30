import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            api_lib: path.resolve(__dirname, 'src/app/api/_lib'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
    },
})
