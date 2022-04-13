<script lang="ts">
	export let gameStats

	let numPlayers = 8

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
	{#each topScorers as { player, pts }}
		<tr>
			<td>{player.first_name} {player.last_name}</td>
			<td>{pts}</td>
		</tr>
	{/each}
</table>

<style>
	.num-players-selector {
		display: flex;
		margin-bottom: 8px;
	}

	.num-players-selector input {
		margin: 0;
		margin-right: 8px;
	}
</style>
