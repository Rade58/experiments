import { AUTHOR_ROLE_OPTIONS } from '@/constants'
import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
	slug: 'authors',
	fields: [
		{ name: 'name', type: 'text', required: true, unique: true },
		{
			name: 'avatar',
			type: 'upload',
			required: true,
			relationTo: 'media',
		},
		{
			name: 'role',
			type: 'select',
			// required: true,
			options: Object.values(AUTHOR_ROLE_OPTIONS),
			required: true,
			// defaultValue: 'staffWriter',
			defaultValue: AUTHOR_ROLE_OPTIONS.staffWriter.value,
		},
	],
}
