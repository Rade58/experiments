import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig(
	js.configs.recommended,
	tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname /* process.cwd() */,
			},
		},
	},
	{
		files: [
			'packages/**/src/**/*.ts',
			'packages/**/tests/**/*.ts',
			'apps/**/src/**/*.ts',
			'apps/**/tests/**/*.ts',
		],
		//
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{ allowNumber: true, allowBoolean: true },
			],
			'@typescript-eslint/no-non-null-assertion': 'warn',
		},
	},
	{
		ignores: ['**/assets/**/*', '**/dist/**/*'],
	},
	{
		files: ['**/tailwind.config.js'],
		rules: {},
	},
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
)
