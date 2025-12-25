import { type BlogPost } from '@/payload-types'
import type { FieldHook } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

const MAX_SUMMART_LENGTH = 160 // best practice for SEO

export const generateContentSummaryHook: FieldHook<
	BlogPost,
	BlogPost['contentSummary']
> = ({ value, data }) => {
	// console.log({ content: JSON.stringify(data?.content, null, 2) })

	if (value && typeof value === 'string') {
		return value.trim()
	}

	if (data && data.content) {
		const summary = convertLexicalToPlaintext({ data: data.content })

		let result: string = ''

		if (summary.length <= MAX_SUMMART_LENGTH) {
			result = summary
		} else {
			result = summary.slice(0, MAX_SUMMART_LENGTH - 3)
			result = result + '...'
			// const emptyInd = result.lastIndexOf(' ')
			// result = result.slice(0, emptyInd)
		}

		return result
	}

	return ''
}
