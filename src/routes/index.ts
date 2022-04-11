import getStats from '$lib/pull'

export async function get() {
	return {
		body: { stats: await getStats() }
	}
}
