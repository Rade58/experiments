#!/bin/bash

prettier --write packages/*/{src,tests}/**/*.{ts,svelte} \
 apps/*/{src,tests}/**/*.{ts,svelte} \
 packages/*/{tailwind.config.js,postcss.config.cjs,vite.config.ts,svelte.config.js} \
 apps/*/{tailwind.config.js,postcss.config.cjs,vite.config.ts,svelte.config.js}