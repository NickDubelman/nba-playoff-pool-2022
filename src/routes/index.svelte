<script lang="ts">
	import Leaderboard from '$lib/components/Leaderboard.svelte'
	import TodaysTopPerformers from '$lib/components/TodaysTopPerformers.svelte'
	import ScoringBreakdown from '$lib/components/ScoringBreakdown/index.svelte'
	import TopScorersOverall from '$lib/components/TopScorersOverall.svelte'
	import TeamBreakdown from '$lib/components/TeamBreakdown.svelte'

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

	<Leaderboard {participantScores} />
	<TodaysTopPerformers {gameStats} />
	<ScoringBreakdown {gameStats} />
	<TopScorersOverall {gameStats} />
	<TeamBreakdown {gameStats} />
</div>

<style>
	.content {
		font-family: 'Source Serif Pro';
		width: 464px;
		margin: auto;
		margin-bottom: 24px;
	}
</style>
