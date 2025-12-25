import { seedAdmin } from './seeders/admin.seeder'

async function main() {
	try {
		await seedAdmin()
		process.exit(0)
	} catch (err) {
		console.error('Seeding error: ', err)
		process.exit(1)
	}
}

void main()
