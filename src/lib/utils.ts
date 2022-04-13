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

// { name: 'Will Barton', team: "DEN" }[]
export const haventPlayedYet: { name: string; team: string }[] = []
