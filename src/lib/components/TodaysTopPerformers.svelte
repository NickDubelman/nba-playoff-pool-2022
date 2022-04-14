<script lang="ts">
	import * as d3 from 'd3'

	export let games
	export let gameStats

	let numPlayers = 8

	// Get the top scorers from the most recent day that has games recorded
	const startedGames = games
		.filter(game => game.home_team_score > 0 || game.visitor_team_score > 0)
		.sort((a, b) => (a.date > b.date ? -1 : 1))

	if (startedGames.length === 0) {
		throw new Error('could not get any games')
	}

	const { date } = startedGames[0]
	const gameIDs = games.filter(game => game.date === date).map(game => game.id)
	const statsForGames = gameStats.filter(stats => gameIDs.includes(stats.game.id))

	$: topPerformances = statsForGames
		.sort((a, b) => (a.pts > b.pts ? -1 : 1))
		.slice(0, numPlayers)
	if (topPerformances.length === 0) {
		throw new Error('could not get top performers')
	}

	const lastPerformance = topPerformances[topPerformances.length - 1]
	const maxPoints = d3.max(topPerformances.map(p => p.pts))
	const pointsColor = d3
		.scaleSequential()
		.domain([Math.min(lastPerformance.pts - 2, maxPoints / 2), maxPoints])
		.interpolator(d3.interpolateHsl('white', '#38c434CC'))

	$: topScorers = gameStats
		.sort((a, b) => {
			if (a.pts !== b.pts) {
				return a.pts > b.pts ? -1 : 1
			}

			const aName = `${a.player.first_name} ${a.player.last_name}`
			const bName = `${b.player.first_name} ${b.player.last_name}`
			return aName < bName ? -1 : 1
		})
		.filter(player => player.pts)
		.slice(0, numPlayers)
</script>

<h2>Today's Top Performers</h2>

<div class="num-players-selector">
	<input type="range" min="3" max="81" bind:value={numPlayers} />
	<span>showing top {numPlayers}</span>
</div>

<table>
	<tr>
		<th>Player</th>
		<th>Team</th>
		<th>Points</th>
		<th>Game Status</th>
	</tr>

	{#each topPerformances as { player, pts, game, team }}
		<tr>
			<td>{player.first_name} {player.last_name}</td>
			<td>{team.abbreviation}</td>
			<td style="background: {pointsColor(pts)}">{pts}</td>
			<td>{game.status} {game.time}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		width: 100%;
	}

	.num-players-selector {
		display: flex;
		margin-bottom: 8px;
	}

	.num-players-selector input {
		margin: 0;
		margin-right: 8px;
	}
</style>
