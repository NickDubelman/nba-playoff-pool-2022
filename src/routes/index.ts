import getStats, { getParticipantScores } from '$lib/pull'

export async function get() {
	const gameStats = await getStats()
	const participantScores = getParticipantScores(gameStats)

	return {
		body: { gameStats, participantScores }
	}
}
