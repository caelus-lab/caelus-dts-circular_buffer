import {defineConfig} from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "index.ts",
            name: "@caelus-dts/circular-buffer",
            formats: ['es', 'cjs'],
            fileName: (format) => (format === "es" ? `index.mjs` : `index.cjs`),
        },
        rollupOptions: {
            external: ['@caelus-dts/iterable'],
            output: {
                globals: {
                    '@caelus-dts/iterable': 'iterable',
                },
                dir: "dist",
                entryFileNames: (chunkInfo) => chunkInfo.facadeModuleId?.endsWith('.ts') ? '[format]/index.js' : `[format]/${chunkInfo.name}.js`,
            }
        }
    }, plugins: [
        dtsPlugin({
            outDir: "dist/types",
            insertTypesEntry: true,
            rollupTypes: true,
            include: ["src/**/*.ts", "index.ts"],
        })
    ]
})