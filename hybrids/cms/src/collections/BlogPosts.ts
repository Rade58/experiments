import type { CollectionConfig } from 'payload'
import { generateSlugHook } from './hooks/generateSlugHook'
import { generateContentSummaryHook } from './hooks/generateContentSummaryHook'
import { generateReadingTime } from './hooks/generateReadingTime'
import { showDateWhenPublished } from './hooks/showDateWhenPublished'

// title
// slug - auto generated
// content -- rich text
// content_summary   --- ato filled from content (for SEO and article cards)
// read time     minutes
// cover image
// author    (relation Authors collection)
// status   (draft or published)
// published at

export const BlogPosts: CollectionConfig = {
	slug: 'blogPosts',
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
			unique: true,
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			hooks: {
				beforeValidate: [generateSlugHook],
			},
		},
		{
			name: 'content',
			type: 'richText',
			required: true,
		},
		{
			name: 'contentSummary',
			type: 'textarea',
			required: true,
			hooks: {
				beforeValidate: [generateContentSummaryHook],
			},
		},
		// this is called Virtual Field or computed field
		// doesn't get stored in db (well not true)
		// we will compute always what it returns but
		// in datbase column will be defined and have default of 0
		{
			name: 'readingTime', // minutes
			type: 'number',
			defaultValue: 0,
			admin: {
				hidden: true,
			},
			hooks: {
				beforeChange: [
					({ siblingData }) => {
						// make sure that isn't stored in db
						delete siblingData.readingTime
					},
				],
				// computing it
				afterRead: [generateReadingTime],
			},
		},
		{
			name: 'coverImage',
			type: 'upload',
			// relations are also auto generated
			relationTo: 'media',
			required: true,
		},
		{
			name: 'author',
			type: 'relationship',
			relationTo: 'authors',
			required: true,
		},
		{
			name: 'status',
			type: 'select',
			required: true,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Published', value: 'published' },
			],
			defaultValue: 'draft',
		},
		{
			name: 'publishedAt',
			type: 'date',
			required: true,
			admin: {
				condition: showDateWhenPublished,
				date: {
					pickerAppearance: 'dayAndTime',
				},
			},
		},
	],
}
