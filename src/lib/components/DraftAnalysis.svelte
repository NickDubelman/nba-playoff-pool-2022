<script lang="ts">
	import * as d3 from 'd3'

	import participants from '$lib/participants'
	import { fullName } from '$lib/utils'

	export let gameStats

	let numPlayers = 24

	const playerStats = {}

	// Create a map we can use to look up points for a player
	gameStats.forEach(({ player, pts }) => {
		const name = fullName(player)

		// First time we see a player, initialize an entry in the map for them
		if (!playerStats[name]) {
			playerStats[name] = { pts: 0 }
		}

		playerStats[name].pts += pts
	})

	// Snake through the participants to determine where each player was drafted
	let round = 0 // 0..7 (8 rounds)
	const picks = []
	while (round < 8) {
		if (round % 2 === 0) {
			// Even round means pick from start
			let numPicks = 0 // 0..11 (12 picks)
			while (numPicks < 12) {
				const participant = Object.keys(participants)[numPicks]
				const player = participants[participant][round]
				const { pts } = playerStats[player]
				picks.push({
					player,
					pts,
					pickedBy: participant,
					drafted: picks.length + 1
				})
				numPicks++
			}
		} else {
			// Odd round means pick from back
			let numPicks = 11 // 11..0 (12 picks)
			while (numPicks >= 0) {
				const participant = Object.keys(participants)[numPicks]
				const player = participants[participant][round]
				const { pts } = playerStats[player]
				picks.push({
					player,
					pts,
					pickedBy: participant,
					drafted: picks.length + 1
				})
				numPicks--
			}
		}

		round++
	}

	$: sortedPicks = picks
		.sort((a, b) => {
			if (a.pts === b.pts) {
				return a.player < b.player ? -1 : 1
			}

			return a.pts > b.pts ? -1 : 1
		})
		.map((pick, i) => ({ ...pick, rank: i + 1, net: i + 1 - pick.drafted }))
		.sort((a, b) => {
			if (a.net === b.net) {
				return a.rank > b.rank ? -1 : 1
			}

			return a.net < b.net ? -1 : 1
		})

	$: sortedPicksSlice = sortedPicks.slice(0, numPlayers)

	const redGreenInterpolator = d3.interpolateHsl(
		'rgba(0, 255, 0, 0.5)',
		'rgba(255, 0, 0, 0.5)'
	)

	$: netColor = d3
		.scaleSequential()
		// @ts-ignore
		.domain(d3.extent(sortedPicks.map(p => p.net)))
		.interpolator(redGreenInterpolator)
</script>

<h2>Draft Analysis</h2>

<div class="num-players-selector">
	<input type="range" min="3" max="96" bind:value={numPlayers} />
	<span>showing top {numPlayers}</span>
</div>

<table>
	<tr>
		<th>Player</th>
		<th>Picked by</th>
		<th>Drafted</th>
		<th>Rank</th>
		<th>Net</th>
	</tr>

	{#each sortedPicksSlice as { player, pts, pickedBy, drafted, rank, net }}
		<tr>
			<td>{player}</td>
			<td>{pickedBy}</td>
			<td>{drafted}</td>
			<td>{rank}</td>
			<td style="background: {netColor(net)}">{net}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 432px;
	}

	tr:not(:last-child) {
		border-bottom: solid 1px #eee;
	}

	tr th {
		text-align: left;
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
