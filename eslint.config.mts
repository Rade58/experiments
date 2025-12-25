import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

export default defineConfig(
	// Base configs
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
	},
	// General monorepo rules (excluding Next.js app)
	{
		files: [
			'packages/**/src/**/*.ts',
			'packages/**/tests/**/*.ts',
			'apps/**/src/**/*.ts',
			'apps/**/tests/**/*.ts',
		],
		ignores: ['hybrids/cms/**'],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{ allowNumber: true, allowBoolean: true },
			],
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/no-unnecessary-type-parameters': 'warn',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'no-useless-catch': 'off',
			'@typescript-eslint/no-empty-object-type': 'warn',
		},
	},
	// Next.js specific configs - scoped to hybrids/cms only
	...compat
		.extends('next/core-web-vitals', 'next/typescript')
		.map((config) => ({
			...config,
			files: ['hybrids/cms/**/*.{js,jsx,ts,tsx}'],
		})),
	// Next.js custom rules and overrides
	{
		files: ['hybrids/cms/**/*.{js,jsx,ts,tsx}', '**/next.config.mjs'],
		rules: {
			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/no-empty-object-type': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: false,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^(_|ignore)',
				},
			],
			// '@typescript-eslint/no-unsafe-argument': 'warn',
			// '@typescript-eslint/no-unsafe-member-access': 'warn',
			// '@typescript-eslint/no-unsafe-call': 'warn',
			// '@typescript-eslint/no-misused-spread': 'warn',
		},
	},
	// Tailwind config files
	{
		files: ['**/tailwind.config.js'],
		rules: {},
	},
	// PostCSS config files
	{
		files: ['**/postcss.config.cjs'],
		languageOptions: {
			globals: {
				require: 'readonly',
				module: 'readonly',
				exports: 'readonly',
				process: 'readonly',
				console: 'readonly',
			},
		},
	},
	// Global ignores
	{
		ignores: [
			'**/assets/**/*',
			'**/dist/**/*',
			'**/.next/**/*',
			'apps/habits/tests',
		],
	},
)
