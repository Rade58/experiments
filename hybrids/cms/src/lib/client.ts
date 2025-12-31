import { getPayload } from 'payload'
import config from '@/payload.config'

let payloadClient: Awaited<ReturnType<typeof getPayload>> | null =
	null

export async function getPayloadCliet() {
	if (!payloadClient) {
		payloadClient = await getPayload({ config })
	}
	return payloadClient
}
