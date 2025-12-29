import { type BlogPost } from '@/payload-types'
import type { Condition } from 'payload'

export const showDateWhenPublished: Condition<BlogPost> = ({
	status,
}) => {
	return status !== undefined && status === 'published'
}
