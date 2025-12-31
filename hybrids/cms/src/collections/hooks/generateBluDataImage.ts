import type {
	CollectionBeforeChangeHook,
	// CollectionAfterChangeHook,
} from 'payload'
import { type Media } from '@/payload-types'
// import path from 'node:path'

// import sharp from 'sharp'
import { generateBlurDataURI } from '../util/generateBlurDataURI'

export const generateBlurImageData: CollectionBeforeChangeHook<
	Media
> = async ({ operation, req, data }) => {
	if (operation !== 'create') {
		return data
	}

	// console.log({ operation })

	//
	const { /* blurDataURI, */ filename, mimeType } = data

	if (!filename || !mimeType) {
		return data
	}

	if (mimeType && !mimeType.startsWith('image/')) {
		return data
	}

	// const filepath = path.join(process.cwd(), 'media', filename)
	// console.log({ filepath })

	const imageBuff = req.file

	if (!imageBuff) {
		return data
	}

	try {
		const base64 = await generateBlurDataURI(imageBuff.data)

		if (!base64) {
			return data
		}

		data.blurDataURI = base64

		// await req.payload.update({
		// 	collection: 'media',
		// 	id,
		// 	data: {
		// 		blurDataURI: base64,
		// 	},
		// })
		return data
	} catch (err) {
		req.payload.logger.error(
			// eslint-disable-next-line
			`Failed to generate blur for ${filename}: ${err instanceof Error ? err.message : err}`,
		)

		return data
	}
}
