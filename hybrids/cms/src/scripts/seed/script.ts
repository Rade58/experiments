import { getPayloadCliet } from '@/lib/client'
import { seedAdmin } from './seeders/admin.seeder'
import { seedAuthor } from './seeders/author.seeder'
import { seedBlogPosts } from './seeders/blogPost.seeder'

async function main() {
	const client = await getPayloadCliet()
	try {
		await seedAdmin(client)
		const author = await seedAuthor(client)
		if (author) {
			await seedBlogPosts(client, author)
		}
		process.exit(0)
	} catch (err) {
		console.error('Seeding error: ', err)
		process.exit(1)
	}
}

void main()
