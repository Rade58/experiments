import { getPayloadCliet } from '@/lib/client'
import { seedAdmin } from './seeders/admin.seeder'
import { seedArticleAuthor } from './seeders/articleAuthor.seeder'

async function main() {
	const client = await getPayloadCliet()
	try {
		await seedAdmin(client)
		await seedArticleAuthor(client)
		process.exit(0)
	} catch (err) {
		console.error('Seeding error: ', err)
		process.exit(1)
	}
}

void main()
