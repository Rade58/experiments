import type { CollectionConfig } from 'payload'
import { generateBlurImageData } from './hooks/generateBluDataImage'
import { blurPlaceholder } from '@/misc/blurPlaceholder'

export const Media: CollectionConfig = {
	slug: 'media',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			required: true,
		},
		// Rade: Added this because we want to
		// generate blured base64 for every image that is
		// published
		// I only like to have this herebecause of type
		{
			name: 'blurDataURI',
			type: 'text',
			// required: true,
			// can't be saved it is too big
			// defaultValue: blurPlaceholder,
			// will do
			// defaultValue: '',
			admin: {
				hidden: true,
			},
		},
	],
	// instead of this
	upload: true,
	// we can define additional options for uplaod like the image sizes
	/* upload: {
		staticDir: 'media',
		imageSizes: [
			{
				name: 'thumbnail',
				width: 400,
				height: 300,
				position: 'centre',
			},
			{
				name: 'card',
				width: 768,
				height: 1024,
				position: 'centre',
			},
			{
				name: 'tablet',
				width: 1024,
				// By specifying `undefined` or leaving a height undefined,
				// the image will be sized to a certain width,
				// but it will retain its original aspect ratio
				// and calculate a height automatically.
				height: undefined,
				position: 'centre',
			},
		],
		// adminThumbnail: 'thumbnail',
		mimeTypes: ['image/*'],
	}, */
	// document lelvel hook
	hooks: {
		beforeChange: [generateBlurImageData],
	},
}
