# Experiments monorepo

A monorepo containing my personal portfolio projects and experiments. Each project is self-contained in its own directory with its own documentation.

<!-- ## Projects

- **[Project Name 1]** - Brief description
- **[Project Name 2]** - Brief description
- **[Project Name 3]** - Brief description -->

## Structure

Each project directory contains its own README with setup instructions, tech stack details, and usage information.

## Root dependencies

dev:

```bash
pnpm add -D -w @eslint/js @manypkg/cli @vitest/ui eslint knip prettier prettier-plugin-svelte syncpack typescript typescript-eslint vite vitest concurrently
```

```bash
# need this because nodejs code inside eslint config
pnpm add -D -w @types/node
```
