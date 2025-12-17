import { db } from './connection.ts'
import { eq, count } from 'drizzle-orm'
import { users, habits, entries, tags, habitTags } from './schema.ts'
import { hashPassword } from '../utils/auth/password.ts'

async function seed() {
	console.log('🪴 Starting database seed...')

	try {
		// Step 1: Clear existing data (must done in order)
		console.log('Clearing existing data ...')

		// we delete first one by one
		// to respect foreign key constraints
		await db.delete(entries) // all entries (foreign keys)
		await db.delete(habitTags) // junction (double foreign keys)
		await db.delete(habits)
		await db.delete(tags)
		await db.delete(users)

		// Step 2: Create demo user
		console.log('Creating demo user ...')
		const pass = 'foobar420'
		const passwordHash = await hashPassword(pass)

		const [fooUser] = await db
			.insert(users)
			.values({
				email: 'lorem@habits.com',
				password: passwordHash,
				username: 'johndoe5',
				firstName: 'Jay',
				lastName: 'Torio',
			})
			.returning()

		// Step 3: Create tags for categorization
		console.log('Creating demo tags ...')
		const [wellbeingTag] = await db
			.insert(tags)
			.values({ name: 'Wellbeing', color: '#5db497ff' })
			.returning()

		/* const [creativityTag] = */ await db
			.insert(tags)
			.values({ name: 'Creativity', color: '#4f1ad3ff' })
		// .returning()

		// Step 4: Create habits with relationships (user)
		console.log('Creating demo habits ...')
		const [workoutHabit] = await db
			.insert(habits)
			.values({
				userId: fooUser.id,
				name: 'Workout',
				description: 'Errday bro pushups and stuff.',
				frequency: 'daily',
				targetCount: 1,
			})
			.returning()

		// Step 5: junction (many to many relationships)
		await db.insert(habitTags).values({
			habitId: workoutHabit.id,
			tagId: wellbeingTag.id,
		})

		// Step 6: completion (creating entry record)
		console.log('Adding completion entries for 7 days...')

		const today = new Date()
		today.setHours(12 /*, 0, 0, 0 */)

		// Workout Habit
		for (let i = 0; i < 7; i++) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)

			await db.insert(entries).values({
				habitId: workoutHabit.id,
				completionDate: date,
				note: i === 0 ? 'Nice! You did some exercise.' : null,
			})
		}

		// Step 7: Testing some queries with joins
		console.log('\n🔦 Testing some queries with joins...')

		// it's an array
		const myDbData = await db
			.select()
			.from(users)
			.innerJoin(habits, eq(habits.userId, users.id))
			.innerJoin(entries, eq(entries.habitId, habits.id))
			.innerJoin(habitTags, eq(habitTags.habitId, habits.id))
			.innerJoin(tags, eq(tags.id, habitTags.tagId))
			.where(eq(users.email, fooUser.email))

		console.log(JSON.stringify({ myDbData }, null, 2))

		const [habitWithCount] = await db
			.select({ count: count(habits.id) })
			.from(habits)
			.innerJoin(users, eq(users.id, habits.userId))
			.where(eq(users.email, myDbData[0].users.email))

		console.log('Datbase seeded successfully! 🎉')
		console.log('\n📖 seed summary:')
		console.log(`Demo user has ${habitWithCount.count} habit(s).`)
		console.log(
			'\n🦸🏻 Fake User credentials: ',
			`\nemail: ${myDbData[0].users.email}`,
			`\npassword: ${pass}`,
			`\npassword hash: ${passwordHash}`,
		)
	} catch (err) {
		console.error('‼️ Seed failed:', err)
		throw err
	}
}

// console.log(import.meta.url, process.argv[1])

// making sure this script wouldn't be run anywhere
// seed function is imported
// we only want this file to be executed against node executable
// since our db:seed script is doing just that

if (import.meta.url === `file://${process.argv[1]}`) {
	seed()
		.then(() => {
			return process.exit(0)
		})
		.catch((err: unknown) => {
			console.error(err)
			process.exit(1)
		})
}
// so, why export it then?
// well, for potential testing purposes

export default seed
