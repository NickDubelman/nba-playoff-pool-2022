import * as d3 from 'd3'

import participants from './participants'
import {
	formatDate,
	haventPlayedYet,
	nameDifferences,
	remainingTeams,
	teamNameDifferences
} from './utils'

const startDate = new Date(2022, 3, 10) // first day of play-in tournament

async function getGames() {
	let allData = []

	const baseURL = 'https://www.balldontlie.io/api/v1/games'
	const query = `?start_date=${formatDate(startDate)}&per_page=100`
	const url = baseURL + query

	const response = await fetch(url)
	let { data, meta } = await response.json()
	allData = [...allData, ...data]

	// If there are more pages, fetch them until all the data has been retrieved
	while (meta.next_page) {
		const response = await fetch(`${url}&page=${meta.next_page}`)
		const json = await response.json()
		data = json.data
		meta = json.meta
		allData = [...allData, ...data]
	}

	return allData
}

export default async function getStats() {
	const games = await getGames()

	let allData = []

	const baseURL = 'https://www.balldontlie.io/api/v1/stats'
	const gameIDs = games.map(g => g.id).join('&game_ids[]=')

	const url = `${baseURL}?game_ids[]=${gameIDs}&per_page=100`
	const response = await fetch(url)

	let { data, meta } = await response.json()
	allData = [...allData, ...data]

	// If there are more pages, fetch them until all the data has been retrieved
	while (meta.next_page) {
		const response = await fetch(`${url}&page=${meta.next_page}`)
		const json = await response.json()
		data = json.data
		meta = json.meta
		allData = [...allData, ...data]
	}

	return allData
}

export const getParticipantScores = gameStats =>
	Object.entries(participants)
		.map(([name, players]) => ({
			name,
			points: d3.sum(
				players.map(playerName => {
					const statsForPlayer = gameStats.filter(({ player }) => {
						const fullName = `${player.first_name} ${player.last_name}`
						return fullName === (nameDifferences[playerName] || playerName)
					})

					// if (
					// 	statsForPlayer.length === 0 &&
					// 	!haventPlayedYet.find(p => p.name === playerName)
					// ) {
					// 	throw new Error('Could not find stats for ' + playerName)
					// }

					return d3.sum(statsForPlayer.map(p => p.pts))
				})
			),
			gamesPlayed: d3.sum(
				players.map(playerName => getGamesPlayed(playerName, gameStats))
			),
			remainingPlayers: players.filter(playerName => {
				const player = gameStats.find(({ player }) => {
					const fullName = `${player.first_name} ${player.last_name}`
					return fullName === (nameDifferences[playerName] || playerName)
				})

				if (!player) return true
				const { abbreviation } = player.team
				const teamAlias = teamNameDifferences[abbreviation] || abbreviation

				return remainingTeams.includes(teamAlias)
			}).length
		}))
		.sort((a, b) => (a.points > b.points ? -1 : 1))

const getGamesPlayed = (playerName, gameStats) =>
	gameStats
		.filter(({ player }) => {
			const fullName = `${player.first_name} ${player.last_name}`
			playerName = nameDifferences[playerName] || playerName

			return fullName === playerName
		})
		.filter(({ min }) => min && min !== '0:00').length
