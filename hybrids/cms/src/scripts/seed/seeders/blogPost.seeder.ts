import { type Payload } from 'payload'

import z, { ZodError } from 'zod'
import { faker } from '@faker-js/faker'

import { getCoverImageFromFaker } from '../util/getImageFromFaker'
import { Author } from '@/payload-types'
import {
	convertMarkdownToLexical,
	convertHTMLToLexical,
	editorConfigFactory,
} from '@payloadcms/richtext-lexical'

import config from '@/payload.config'
import { slugify } from 'payload/shared'

export async function seedBlogPosts(
	payloadClient: Payload,
	author: Author,
) {
	try {
		for (let i = 0; i < 10; i++) {
			const paragraphs = faker.lorem.paragraphs(3)
			const contentLexical = convertMarkdownToLexical({
				markdown: paragraphs,
				editorConfig: await editorConfigFactory.default({
					config: await config,
				}),
			})

			const picture = await getCoverImageFromFaker()

			const coverImage = await payloadClient.create({
				collection: 'media',
				...picture,
			})

			const title = faker.lorem.sentence()

			const slug =
				slugify(title) || title.replace(' ', '-').toLowerCase()

			await payloadClient.create({
				collection: 'blogPosts',
				data: {
					author: author.id,
					title,
					content: contentLexical,
					contentSummary: faker.lorem.sentences(3),
					slug,
					status: 'draft',
					coverImage: coverImage.id,
				},
			})
		}
	} catch (err) {
		if (err instanceof ZodError) {
			console.error(z.flattenError(err))
		} else if (err instanceof Error) {
			console.error(
				'Error! seeding articles: ',
				JSON.stringify(err, null, 2),
			)
		} else {
			console.error(err)
		}
	}
}
