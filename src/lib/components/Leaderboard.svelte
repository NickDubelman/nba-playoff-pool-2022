<script lang="ts">
	import * as d3 from 'd3'
	const greenRedInterpolator = d3.interpolateHsl(
		'rgba(255, 0, 0, 0.5)',
		'rgba(0, 255, 0, 0.5)'
	)

	export let participantScores

	let sortBy = 'points'

	const pointsColor = d3
		.scaleSequential()
		// @ts-ignore
		.domain(d3.extent(participantScores.map(p => p.points)))
		.interpolator(greenRedInterpolator)

	const playersRemainingColor = d3
		.scaleSequential()
		// @ts-ignore
		.domain(d3.extent(participantScores.map(p => p.remainingPlayers)))
		.interpolator(greenRedInterpolator)

	const gamesPlayedColor = d3
		.scaleSequential()
		// @ts-ignore
		.domain(d3.extent(participantScores.map(p => p.gamesPlayed)))
		.interpolator(greenRedInterpolator)

	const ppgColor = d3
		.scaleSequential()
		.domain(
			// @ts-ignore
			d3.extent(
				participantScores.map(p => (p.points ? p.points / p.gamesPlayed : 0))
			)
		)
		.interpolator(greenRedInterpolator)

	const sortedScores = participantScores.sort((a, b) => {
		switch (sortBy) {
			case 'points':
				if (a.points !== b.points) {
					return a.points > b.points ? -1 : 1
				}

			case 'players remaining':
				if (a.remainingPlayers !== b.remainingPlayers) {
					return a.remainingPlayers > b.remainingPlayers ? -1 : 1
				}

			case 'games played':
				if (a.gamesPlayed !== b.gamesPlayed) {
					return a.gamesPlayed > b.gamesPlayed ? -1 : 1
				}

			case 'ppg': {
				const aPPG = a.points / a.gamesPlayed
				const bPPG = b.points / b.gamesPlayed

				if (aPPG !== bPPG) {
					return aPPG > bPPG ? -1 : 1
				}
			}
		}

		return a.name < b.name ? -1 : 1
	})
</script>

<table>
	<tr>
		<th style="width: 132px">Participant</th>
		<th style="width: 64px">Points</th>
		<th style="width: 100px">Players Remaining</th>
		<th style="width: 70px">Games Played</th>
		<th>PPG</th>
	</tr>

	{#each sortedScores as { name, points, gamesPlayed, remainingPlayers }}
		<tr>
			<td>{name}</td>
			<td style="background: {pointsColor(points)}">{points}</td>
			<td style="background: {playersRemainingColor(remainingPlayers)}">
				{remainingPlayers}
			</td>
			<td style="background: {gamesPlayedColor(gamesPlayed)}">
				{gamesPlayed}
			</td>
			<td style="background: {ppgColor(points && points / gamesPlayed)}">
				{points && Math.round((points / gamesPlayed) * 100) / 100}
			</td>
		</tr>
	{/each}
</table>

<style>
	table {
		border-collapse: collapse;
		min-width: 432px;
	}

	tr:not(:last-child) {
		border-bottom: solid 1px #eee;
	}

	tr th {
		text-align: left;
	}
</style>
