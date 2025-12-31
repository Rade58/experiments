import { faker } from '@faker-js/faker'

export async function getAvatarImageFromFaker() {
	const imageUrl = faker.image.personPortrait({
		sex: 'female',
		size: 256,
	})
	const res = await fetch(imageUrl)
	const arrBuff = await res.arrayBuffer()
	const buff = Buffer.from(arrBuff)

	const mimeType = res.headers.get('content-type') || 'image/jpeg'

	const fileSize = buff.length
	const fileName = res.url.split('/').pop()?.split('?')[0]

	// console.log({ mimeType, fileSize, fileName })

	if (!fileName) {
		// fileName = randomBytes(12).toString('hex')
		throw new Error('Failed to extract name of the image from faker')
	}
	//

	return {
		data: { alt: faker.lorem.words(2) },
		file: {
			mimetype: mimeType,
			name: fileName,
			data: buff,
			size: fileSize,
		},
	}
}

export async function getCoverImageFromFaker() {
	const imageUrl = faker.image.urlPicsumPhotos({
		width: 800,
		height: 400,
	})
	const res = await fetch(imageUrl)
	const arrBuff = await res.arrayBuffer()
	const buff = Buffer.from(arrBuff)

	const mimeType = res.headers.get('content-type') || 'image/jpeg'

	const fileSize = buff.length
	const fileName = res.url.split('/').pop()?.split('?')[0]

	// console.log({ mimeType, fileSize, fileName })

	if (!fileName) {
		// fileName = randomBytes(12).toString('hex')
		throw new Error('Failed to extract name of the image from faker')
	}
	//

	return {
		data: { alt: faker.lorem.words(2) },
		file: {
			mimetype: mimeType,
			name: fileName,
			data: buff,
			size: fileSize,
		},
	}
}
