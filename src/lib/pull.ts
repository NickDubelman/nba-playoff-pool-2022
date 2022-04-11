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

const formatDate = (date: Date) => date.toISOString().split('T')[0]
