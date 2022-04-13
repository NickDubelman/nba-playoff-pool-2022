<script lang="ts">
	import * as d3 from 'd3'

	import participants from '$lib/participants'
	import {
		allTeams,
		fullName,
		haventPlayedYet,
		nameDifferences,
		remainingTeams,
		teamNameDifferences
	} from '$lib/utils'

	export let gameStats

	let breakdownTeam = 'BRK'

	$: playersForTeam = Object.entries(participants)
		.map(([participant, players]) =>
			players.map(name => {
				name = nameDifferences[name] || name

				let points = 0
				let gamesPlayed = 0
				let team

				const playerStats = gameStats.filter(
					({ player }) => name === fullName(player)
				)

				if (playerStats.length > 0) {
					points = d3.sum(playerStats.map(s => s.pts))
					gamesPlayed = playerStats.filter(s => s.min && s.min !== '0:00').length
					team = playerStats[0].team.abbreviation
				} else {
					// See if the player hasn't played yet
					const player = haventPlayedYet.find(p => p.name === name)
					// if (!player) {
					// 	throw new Error(`could not find ${name}`)
					// }
					team = player ? player.team : ''
				}

				return {
					name,
					team,
					points,
					gamesPlayed,
					pickedBy: participant
				}
			})
		)
		.flat()
		.filter(({ team }) => (teamNameDifferences[team] || team) === breakdownTeam)
		.sort((a, b) => (a.points > b.points ? -1 : 1))

	$: teamIsEliminated = !remainingTeams.includes(
		teamNameDifferences[breakdownTeam] || breakdownTeam
	)

	const greenInterpolator = d3.interpolateHsl('white', '#38c434CC')

	$: pointsColor = d3
		.scaleSequential()
		.domain([0, d3.max((playersForTeam || []).map(p => p.points))])
		.interpolator(greenInterpolator)

	$: gamesPlayedColor = d3
		.scaleSequential()
		.domain([0, d3.max((playersForTeam || []).map(p => p.gamesPlayed))])
		.interpolator(greenInterpolator)

	$: ppgColor = d3
		.scaleSequential()
		.domain([0, d3.max((playersForTeam || []).map(p => p.points / p.gamesPlayed))])
		.interpolator(greenInterpolator)
</script>

<h2>Team Breakdown</h2>

<div style="margin-bottom: 8px">
	<span style="margin-right: 4px">Select a team</span>

	<select bind:value={breakdownTeam}>
		{#each allTeams as team}
			<option value={team}>{team}</option>
		{/each}
	</select>
</div>

{#if playersForTeam.length === 0}
	<span style="color: red">Nobody from {breakdownTeam} to show data for</span>
{:else}
	{#if teamIsEliminated}
		<div style="color: red">{breakdownTeam} has been eliminated</div>
	{/if}

	<table>
		<tr>
			<th>Player</th>
			<th>Picked by</th>
			<th>Total Points</th>
			<th>Games</th>
			<th>PPG</th>
		</tr>

		{#each playersForTeam as { name, pickedBy, points, gamesPlayed }}
			<tr>
				<td>{name}</td>
				<td>{pickedBy}</td>
				<td style="background: {pointsColor(points)}">{points}</td>
				<td style="background: {gamesPlayedColor(gamesPlayed)}">{gamesPlayed}</td>
				<td style="background: {ppgColor(points / gamesPlayed || 0)}">
					{points > 0 ? Math.round((points / gamesPlayed) * 100) / 100 : 0}
				</td>
			</tr>
		{/each}
	</table>
{/if}

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

	@media (max-width: 768px) {
		select {
			font-size: 1.32em;
		}
	}
</style>
