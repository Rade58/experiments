import { type Payload } from 'payload'

import z, { ZodError } from 'zod'

import { faker } from '@faker-js/faker'

// import { env } from '@/env/server'
import { getImageFromFaker } from '../util/getImageFromFaker'

export async function seedArticleAuthor(payloadClient: Payload) {
	try {
		// todo:
		// 1 - insert medai file for avatar
		// 2 - insert author

		const result = await getImageFromFaker()

		if ('error' in result && result.error) {
			throw new Error('Faker error')
		}

		const avatarMedia = await payloadClient.create({
			collection: 'media',
			// data: {
			// 	alt: faker.lorem.words(2),
			// },
			// file: {
			// 	data: buff,
			// 	name: fileName,
			// 	mimetype: mimeType,
			// 	size: fileSize,
			// 	//
			// },
			...result,
		})

		// console.log({ avatarMedia })

		const author = await payloadClient.create({
			collection: 'authors',
			data: {
				avatar: avatarMedia.id,
				name: faker.person.fullName(),
				role: 'staffWriter',
			},
		})
	} catch (err) {
		if (err instanceof ZodError) {
			console.error(z.flattenError(err))
		} else if (err instanceof Error) {
			console.error(
				'Error! seeding author: ',
				JSON.stringify(err, null, 2),
			)
		} else {
			console.error(err)
		}
	}
}
