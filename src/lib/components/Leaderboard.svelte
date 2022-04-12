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
				return a.points > b.points ? -1 : 1
			case 'players remaining':
				return a.remainingPlayers > b.remainingPlayers ? -1 : 1
			case 'games played':
				return a.gamesPlayed > b.gamesPlayed ? -1 : 1
			case 'ppg': {
				const aPPG = a.points / a.gamesPlayed
				const bPPG = b.points / b.gamesPlayed
				return aPPG > bPPG ? -1 : 1
			}
		}
	})
</script>

<table>
	<tr>
		<th>Participant</th>
		<th>Points</th>
		<th>Players Remaining</th>
		<th>Games Played</th>
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
		width: 100%;
	}

	tr:not(:last-child) {
		border-bottom: solid 1px #eee;
	}

	tr th {
		text-align: left;
	}
</style>
