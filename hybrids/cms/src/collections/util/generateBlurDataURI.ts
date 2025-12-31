import sharp from 'sharp'

export const generateBlurDataURI = async (buff?: Buffer) => {
	if (!buff) {
		console.warn(
			'Failed to generate blur data image URI: buffer is missing',
		)
		return null
	}

	const b = await sharp(buff)
		.resize(10, 10, { fit: 'inside' })
		.blur()
		.jpeg({ quality: 50 })
		.toBuffer()

	// const bufferString = b.toString('base64')
	// console.log({ bufferString })
	// const base64 = `data:image/jpeg;base64,${b.toString('base64')}`

	return `data:image/jpeg;base64,${b.toString('base64')}`
}
