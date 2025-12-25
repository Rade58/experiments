import { type BlogPost } from '@/payload-types'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import type { FieldHook } from 'payload'

const WORDS_PER_MINUTE = 200

export const generateReadingTime: FieldHook<
	BlogPost,
	BlogPost['readingTime']
> = ({ data }) => {
	if (data && data.content) {
		const text = convertLexicalToPlaintext({ data: data.content })

		const words = text.split(/\s+/)

		// reading time
		const readingTime = Math.max(
			1,
			Math.ceil(words.length / WORDS_PER_MINUTE),
		)
		// console.log({ readingTime })
		return readingTime
	}

	return 0
}
