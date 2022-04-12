import { getParticipantScores, getStats } from '$lib/pull'

let cachedStats = null

const shouldRefetch = () => {
	if (!cachedStats) return true
	if (cachedStats.fetching) return false

	// Data is considered out-of-date if its more than 60 seconds old
	const now = new Date()
	return (now.getTime() - cachedStats.time.getTime()) / 1000 > 60
}

export async function get() {
	let gameStats
	if (shouldRefetch()) {
		cachedStats = { ...cachedStats, fetching: true }
		gameStats = await getStats()

		cachedStats = {
			data: gameStats,
			time: new Date(),
			fetching: false
		}
	} else {
		gameStats = cachedStats.data
	}

	const participantScores = getParticipantScores(gameStats)
	return {
		body: {
			gameStats,
			participantScores
		}
	}
}
