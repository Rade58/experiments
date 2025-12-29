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
			options: [
				// "lorem",
				// "ipsum"
				{ value: 'guestWriter', label: 'Guest Writer' },
				{ value: 'staffWriter', label: 'Staff Writer' },
				{ value: 'contributor', label: 'Contributor' },
				{ value: 'editor', label: 'Editor' },
			],
			required: true,
			defaultValue: 'staffWriter',
		},
	],
}
