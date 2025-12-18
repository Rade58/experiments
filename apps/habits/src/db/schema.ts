import {
	pgTable,
	//
	uuid,
	varchar,
	text,
	timestamp,
	boolean,
	integer,
	//
	primaryKey,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

// todo: (drizzle-zod)
import {
	createInsertSchema,
	createSelectSchema /* , createUpdateSchema  */,
} from 'drizzle-zod'

/**
 * Users table - core authentication and profile
 */
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	username: varchar('username', { length: 50 }).unique().notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	firstName: varchar('first_name', { length: 50 }),
	lastName: varchar('last_name', { length: 50 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * Habits table - core habit definitions
 */
export const habits = pgTable('habits', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description'),
	// dayly, weekly, monthly (why enum isn't used here?)
	// frequency: varchar('frequency', { length: 20 }).notNull(),
	frequency: varchar('frequency', {
		length: 20,
		enum: ['daily', 'weekly', 'monthly', 'yearly'],
	}).notNull(),
	// how many time per frequency
	targetCount: integer('target_count').default(1),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * Entries table - individual habit completions
 */
export const entries = pgTable('entries', {
	id: uuid('id').primaryKey().defaultRandom(),
	habitId: uuid('habit_id')
		.references(() => habits.id, { onDelete: 'cascade' })
		.notNull(),
	completionDate: timestamp('completion_date').defaultNow().notNull(),
	note: varchar({ length: 255 }),
})

/**
 * Tgs table - categorization
 */
export const tags = pgTable('tags', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 50 }).unique().notNull(),
	color: varchar('color', { length: 10 }).default('#7f728a'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Many tags can have many habits and vice versa
/**
 * HabitTags table - many-to-many between Habits and Tags
 */
export const habitTags = pgTable(
	'habit_tags',
	{
		// instead of having new id as primary key
		// we can have composite primary key
		// id: uuid('id').primaryKey().defaultRandom(),
		habitId: uuid('habit_id')
			.references(() => habits.id, { onDelete: 'cascade' })
			.notNull(),
		tagId: uuid('tag_id')
			.references(() => tags.id, { onDelete: 'cascade' })
			.notNull(),
	},
	// constraints
	// composite key (this is a constraint, primary key)
	/* (table) => ({
    // this syntax is deprecated
    // we must return array
		pk: primaryKey({
			// drizzle auto generates contraint names
			// so I won't name it here
			// name: 'habit_tags_pk',
			columns: [table.habitId, table.tagId],
		}),
	}), */
	(table) => [
		primaryKey({ name: 'habit_tags_pk', columns: [table.habitId, table.tagId] }),
	],
)

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------ Relationships ---------------------------
// Imortant to know it is not SQL related
// This is additional stuff for type safty during joins
// Drizzle's relation system enables type-safe joins
// we are defining these for every table that is
// involved in relations (no matter if
// they have foreign keys or not), and all that to have
// type safety when we do joins in queries
// ------------------------------------------------------------
// ------------------------------------------------------------

// where ever you have - one -  relation you must define
// what field is a foreign key and what it references

// User can have many Habits (no foreign key on habits table)
export const usersRelations = relations(users, ({ many }) => ({
	habits: many(habits),
}))

// Habit can have many Entries (foreign key on entries table)
// Habit can have many habitTags (foreign key on habitTags table) (many-to-many)
// but Habit can have only one User
export const habitsRelations = relations(habits, ({ many, one }) => ({
	entries: many(entries),
	habitTags: many(habitTags),
	// since habit has a foreign key
	user: one(users, {
		fields: [habits.userId],
		references: [users.id],
	}),
}))

// Entry can have only one Habit (foreign key on entries table)
export const entriesRelations = relations(entries, ({ one }) => ({
	habit: one(habits, {
		fields: [entries.habitId],
		references: [habits.id],
	}),
}))

// Tags can have many habitTags (foreign key on habitTags)
export const tagsRelations = relations(tags, ({ many }) => ({
	habitTags: many(habitTags),
}))

// JUNCTION TABLE, or many-to-many between Habits and Tags
// so habitTags can have only one Habit (foreign key on habitTags table)
// and habitTags can have only one Tag (foreign key on habitTags table)
export const habitTagsRelations = relations(habitTags, ({ one }) => ({
	habit: one(habits, {
		fields: [habitTags.habitId],
		references: [habits.id],
	}),
}))

// -------------------- Types --------------------------
// -----------------------------------------------------
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Habit = typeof habits.$inferSelect
export type NewHabit = typeof habits.$inferInsert
export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
export type Entry = typeof entries.$inferSelect
export type NewEntry = typeof entries.$inferInsert
export type HabitTag = typeof habitTags.$inferSelect
export type NewHabitTag = typeof habitTags.$inferInsert

// ------------------- Zod Schemas --------------------
// ----------------------------------------------------
// for example you don't need to validate id (it is auto generated)
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
// todo: updateUserSchema

export const insertHabitSchema = createInsertSchema(habits)
export const selectHabitSchema = createSelectSchema(habits)

export const insertTagSchema = createInsertSchema(tags)
export const selectTagSchema = createSelectSchema(tags)

export const insertEntrySchema = createInsertSchema(entries)
export const selectEntrySchema = createSelectSchema(entries)

export const insertHabitTagSchema = createInsertSchema(habitTags)
export const selectHabitTagSchema = createSelectSchema(habitTags)
