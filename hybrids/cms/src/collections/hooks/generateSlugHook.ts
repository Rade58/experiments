import { slugify } from 'payload/shared'
import { type BlogPost } from '@/payload-types'
import type { FieldHook } from 'payload'

// In order to use type BlogPost
// BlogPost collection must
// be specified in payload config
// then run payload generate:types
// (pnpm --filter=@lab/cms generate:types)
// and then you can use BlogPost type

export const generateSlugHook: FieldHook<
	BlogPost,
	BlogPost['slug']
> = ({ value, data }) => {
	// if slug is enterd by user
	if (value && typeof value === 'string') {
		return slugify(value.trim()) || ''
	}
	// if not we generate it from title

	if (
		data &&
		'title' in data &&
		data.title &&
		typeof data.title === 'string'
	) {
		return slugify(data.title.trim()) || ''
	}

	return ''
}
