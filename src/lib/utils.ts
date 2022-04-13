export const formatDate = (date: Date) => date.toISOString().split('T')[0]

export const teamNameDifferences = {
	BKN: 'BRK',
	PHX: 'PHO'
}

export const nameDifferences = {
	'Luka Dončić': 'Luka Doncic',
	'Nikola Jokić': 'Nikola Jokic',
	'Bogdan Bogdanović': 'Bogdan Bogdanovic',
	'Goran Dragić': 'Goran Dragic',
	'Bojan Bogdanović': 'Bojan Bogdanovic'
}

export const remainingTeams = [
	// West
	'PHO',
	'MEM',
	'GSW',
	'DAL',
	'UTA',
	'DEN',
	'MIN',
	'LAC',
	'NOP',
	'SAS',

	// East
	'MIA',
	'BOS',
	'MIL',
	'PHI',
	'TOR',
	'CHI',
	'BRK',
	'CLE',
	'ATL',
	'CHO'
]

export const teamColors = {
	CLE: '#ffc322',
	MIN: '#71b64c',
	UTA: '#2b5134',
	HOU: '#ce1141',
	LAL: '#fec42f',
	DEN: '#0d2240',
	LAC: '#1d428a',
	MIL: '#00471a',
	MIA: '#8b2231',
	DAL: '#0064b1',
	TOR: '#ce1141',
	BOS: '#008348',
	OKC: '#ef5133',
	ORL: '#0077c0',
	PHI: '#006ab6',
	POR: '#e03a3e',
	IND: '#fcb424',
	BRK: '#2d2925',
	GSW: '#04529c',
	WAS: '#c60c31',
	ATL: '#c9082a',
	NYK: '#ed8025',
	PHO: '#e25301'
}

export const allTeams = [
	// West
	'PHO',
	'MEM',
	'GSW',
	'DAL',
	'UTA',
	'DEN',
	'MIN',
	'LAC',
	'NOP',
	'SAS',

	// East
	'MIA',
	'BOS',
	'MIL',
	'PHI',
	'TOR',
	'CHI',
	'BRK',
	'CLE',
	'ATL',
	'CHO'
].sort()

export const fullName = ({ first_name, last_name }) => `${first_name} ${last_name}`

export const getGamesPlayed = (playerName, gameStats) =>
	gameStats
		.filter(({ player }) => {
			playerName = nameDifferences[playerName] || playerName
			return fullName(player) === playerName
		})
		.filter(({ min }) => min && min !== '0:00').length

// { name: 'Will Barton', team: "DEN" }[]
export const haventPlayedYet: { name: string; team: string }[] = []
