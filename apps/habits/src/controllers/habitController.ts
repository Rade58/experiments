import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'

import { db } from '../db/connection.ts'

import {
	// users,
	habits,
	entries,
	// tags,
	habitTags,
	type NewHabit,
	// type Habit,
} from '../db/schema.ts'
import { eq, and, desc /*,inArray , getTableColumns */ } from 'drizzle-orm'

export async function createHabit(
	req: AuthenticatedRequest<NewHabit, { tagIds?: string[] }>,
	res: Response,
) {
	try {
		const { id: userId } = req.user
		const { frequency, name, description, targetCount, tagIds } = req.body

		// why transaction
		// we are creating multiple records so I guess if
		// anything fails nothing will be inserted inside database
		// starting transaction for data consistency
		const result = await db.transaction(async (tx) => {
			// creating habit
			const [newHabit] = await tx
				.insert(habits)
				.values({
					userId,
					frequency,
					name,
					description,
					targetCount,
				})
				.returning()

			// this can also be handled inside
			// validation middleware
			// (to get rid of if here)
			// but for simplicity doing it here
			// inserting habit tags if any
			if (tagIds && tagIds.length > 0) {
				const habitTagsValuesList = tagIds.map((tagId) => ({
					tagId,
					habitId: newHabit.id,
				}))

				await tx.insert(habitTags).values(habitTagsValuesList)
			}

			return newHabit
		})

		res.status(201).json({
			message: 'Habit createt successfully',
			habit: result,
		})
	} catch (err) {
		console.error('Create habit error: ', err)
		return res.status(500).json({ error: 'Failed to create habit!' })
	}
}

export async function getUserHabits(req: AuthenticatedRequest, res: Response) {
	try {
		const { id: userId } = req.user

		// getting habbits and tags for a user
		/* 	const userHabitsWithTags = await db
			.select({
				habit: getTableColumns(habits),
				tag: getTableColumns(tags),
			})
			.from(habitTags)
			.innerJoin(habits, eq(habits.id, habitTags.habitId))
			.innerJoin(tags, eq(tags.id, habitTags.tagId))
			.where(eq(habits.userId, userId))
			.orderBy(desc(habits.createdAt)) */

		const userHabitsWithTags = await db.query.habits.findMany({
			where: eq(habits.userId, userId),
			with: {
				habitTags: {
					with: {
						tag: true,
					},
				},
			},
			orderBy: [desc(habits.createdAt)],
		})

		// transform data to include tags directly
		const habitsWithTags = userHabitsWithTags.map((hbt) => {
			return {
				...hbt,
				habitTags: undefined,
				tags: hbt.habitTags.map((ht) => ht.tag),
			}
		})

		res.json({
			habits: habitsWithTags,
		})
	} catch (err) {
		console.error('Getting habits error: ', err)
		return res.status(500).json({ error: 'Failed to get habits!' })
	}
}

export async function getHabitById(
	req: AuthenticatedRequest<{}, {}, { id: string }>,
	res: Response,
) {
	try {
		const { id } = req.params
		const { id: userId } = req.user

		const habit = await db.query.habits.findFirst({
			where: and(eq(habits.id, id), eq(habits.userId, userId)),
			with: {
				habitTags: {
					with: {
						tag: true,
					},
				},
				entries: {
					orderBy: [desc(entries.completionDate)],
					limit: 10,
				},
			},
		})

		if (!habit) {
			return res.status(404).json({ error: 'Habit not found!' })
		}

		// transform data to include tags directly
		const habitsWithTags = {
			...habit,
			habitTags: undefined,
			tags: habit.habitTags.map((ht) => ht.tag),
		}

		res.json({
			habit: habitsWithTags,
		})
	} catch (err) {
		console.error('Getting habit error: ', err)
		return res.status(500).json({ error: 'Failed to get habit!' })
	}
}

export async function updateHabit(
	req: AuthenticatedRequest<NewHabit, { tagIds?: string[] }, { id: string }>,
	res: Response,
) {
	try {
		const { id } = req.params
		const { id: userId } = req.user
		const { tagIds, ...updates } = req.body

		const result = await db.transaction(async (tx) => {
			const [updatedHabit] = await tx
				.update(habits)
				.set({
					...updates,
					updatedAt: new Date(),
				})
				.where(and(eq(habits.id, id), eq(habits.userId, userId)))
				.returning()

			// eslint-disable-next-line
			if (!updateHabit) {
				throw new Error('Habit not found')
			}

			if (tagIds !== undefined) {
				// rmove existing tags
				await tx.delete(habitTags).where(eq(habitTags.habitId, id))

				// add new tags
				if (tagIds.length > 0) {
					const habitTagsValuesList = tagIds.map((tagId) => ({
						tagId,
						habitId: id,
					}))

					await tx.insert(habitTags).values(habitTagsValuesList)
				}
			}

			return updatedHabit
		})

		res.json({
			message: 'Habit updated successfully',
			habit: result,
		})
	} catch (err) {
		console.error('Updating habit error: ', err)
		return res.status(500).json({ error: 'Failed to update habit!' })
	}
}

export async function deleteHabit(
	req: AuthenticatedRequest<{}, {}, { id: string }>,
	res: Response,
) {
	try {
		const { id } = req.params
		const { id: userId } = req.user

		const [deletedHabit] = await db
			.delete(habits)
			.where(and(eq(habits.id, id), eq(habits.userId, userId)))
			.returning()
		// eslint-disable-next-line
		if (!deletedHabit) {
			return res.status(404).json({ error: 'Habit not found!' })
		}

		res.json({ message: 'Habit deleted successfully' })
	} catch (err) {
		console.error('Deleting habit error: ', err)
		return res.status(500).json({ error: 'Failed to delete habit!' })
	}
}
