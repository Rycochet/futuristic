/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), eslint({ failOnError: false, failOnWarning: false }), react()],
    build: {
        minify: true,
        reportCompressedSize: true,
    },
    css: {
        transformer: "lightningcss",
        modules: {
            localsConvention: "camelCaseOnly",
        },
    },
    test: {
        coverage: {
            include: ["src/**"],
            reporter: ["cobertura", "html", "text"],
        },
        reporters: ["junit", "default"],
        outputFile: "junit-reports/TEST-vitest.xml",
    },
});
