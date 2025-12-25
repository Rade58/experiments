import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'

import { createJiti } from 'jiti'

const jiti = createJiti(fileURLToPath(import.meta.url))

async function loadEnv() {
	await jiti.import('./src/env/server.ts')
	await jiti.import('./src/env/client.ts')
}

await loadEnv()

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Your Next.js config here
	webpack: (webpackConfig) => {
		// eslint-disable-next-line
		webpackConfig.resolve.extensionAlias = {
			'.cjs': ['.cts', '.cjs'],
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.mjs': ['.mts', '.mjs'],
		}

		// Suppress jiti cache warning
		// eslint-disable-next-line
		webpackConfig.infrastructureLogging = {
			// eslint-disable-next-line
			...webpackConfig.infrastructureLogging,
			level: 'error',
		}

		// eslint-disable-next-line
		return webpackConfig
	},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
