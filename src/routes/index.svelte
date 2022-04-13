<script>
	import Leaderboard from '$lib/components/Leaderboard.svelte'

	export let gameStats, participantScores

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
		.slice(0, 24)
</script>

<svelte:head>
	<title>Scoring Pool</title>
</svelte:head>

<div class="content">
	<h1>NBA Playoffs 2022 Scoring Pool</h1>

	<p>
		These stats should update every 10 minutes or so. You need to refresh your page
		for the stats to update.
	</p>

	<h2>Leaderboard</h2>
	<Leaderboard {participantScores} />

	<h2>Today's Top Performers</h2>
	<table>
		{#each topScorers as { player, pts }}
			<tr>
				<td>{player.first_name} {player.last_name}</td>
				<td>{pts}</td>
			</tr>
		{/each}
	</table>

	<!-- <h2>Top Scorers Overall</h2>

	<h2>Scoring Breakdown</h2>

	<h2>Team Breakdown</h2> -->
</div>

<style>
	.content {
		font-family: 'Source Serif Pro';
		width: 464px;
		margin: auto;
	}

	table {
		margin-bottom: 16px;
	}
</style>
