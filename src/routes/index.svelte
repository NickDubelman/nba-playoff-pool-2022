<script>
	import Leaderboard from '$lib/components/Leaderboard.svelte'
	import TodaysTopPerformers from '$lib/components/TodaysTopPerformers.svelte'
	import ScoringBreakdown from '$lib/components/ScoringBreakdown/index.svelte'

	export let gameStats, participantScores
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

	<TodaysTopPerformers {gameStats} />

	<ScoringBreakdown {gameStats} />

	<!-- <h2>Top Scorers Overall</h2> -->

	<!-- <h2>Team Breakdown</h2> -->
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
