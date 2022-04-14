<script lang="ts">
	import participants from '$lib/participants'
	import { fullName, getGamesPlayed, nameDifferences } from '$lib/utils'

	export let gameStats

	let numPlayers = 8

	const playerStats = {} // a map from player name to corresponding stats

	gameStats.forEach(({ player, team, pts }) => {
		const name = fullName(player)

		// First time we see a player, initialize an entry in the map for them
		if (!playerStats[name]) {
			// Determine which participant picked the player
			const pickedBy = Object.entries(participants).find(([_, players]) =>
				players.map(p => nameDifferences[p] || p).includes(name)
			)

			playerStats[name] = {
				team: team.abbreviation,
				pickedBy: pickedBy ? pickedBy[0] : null,
				pts: 0
			}
		}

		playerStats[name].pts += pts
	})

	$: topPlayers = Object.entries(playerStats)
		// @ts-ignore
		.map(([name, { team, pickedBy, pts }]) => ({
			name,
			team,
			pickedBy,
			pts,
			gamesPlayed: getGamesPlayed(name, gameStats)
		}))
		.sort((a, b) => {
			if (a.pts !== b.pts) {
				return a.pts > b.pts ? -1 : 1
			}

			return a.name < b.name ? -1 : 1
		})
		.slice(0, numPlayers)
</script>

<h2>Top Scorers Overall</h2>

<div class="num-players-selector">
	<input type="range" min="3" max="81" bind:value={numPlayers} />
	<span>showing top {numPlayers}</span>
</div>

<table>
	<tr>
		<th>Player</th>
		<th style="width: 42px">Team</th>
		<th>Picked by</th>
		<th style="width: 56px">Points</th>
		<th style="width: 56px">Games Played</th>
		<th>PPG</th>
	</tr>

	{#each topPlayers as { name, team, pickedBy, pts, gamesPlayed }}
		<tr>
			<td>{name}</td>
			<td>{team}</td>
			<td class:red={!pickedBy}>
				{pickedBy || 'Not picked'}
			</td>
			<td>{pts}</td>
			<td>{gamesPlayed}</td>
			<td>{gamesPlayed ? Math.round((pts / gamesPlayed) * 100) / 100 : 0}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		width: 100%;
		font-size: 0.86em;
		border-collapse: collapse;
	}

	td {
		border: 1px solid #ddd;
		border-collapse: collapse;
	}

	tr th {
		text-align: left;
	}

	tr td {
		padding: 8px 4px 8px 4px;
	}

	.red {
		color: red;
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
