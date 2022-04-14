import { getGames, getParticipantScores, getStats } from '$lib/pull'

let cachedStats = null

const shouldRefetch = () => {
	if (!cachedStats) return true
	if (cachedStats.fetching) return false

	// Data is considered out-of-date if its more than 60 seconds old
	const now = new Date()
	return (now.getTime() - cachedStats.time.getTime()) / 1000 > 60
}

export async function get() {
	let games, gameStats
	if (shouldRefetch()) {
		cachedStats = { ...cachedStats, fetching: true }
		games = await getGames()
		gameStats = await getStats(games)

		cachedStats = {
			data: { games, gameStats },
			time: new Date(),
			fetching: false
		}
	} else {
		gameStats = cachedStats.data.gameStats
		games = cachedStats.data.games
	}

	const participantScores = getParticipantScores(gameStats)
	return {
		body: {
			games,
			gameStats,
			participantScores
		}
	}
}
