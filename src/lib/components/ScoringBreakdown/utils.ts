import * as d3 from 'd3'

import participants from '$lib/participants'
import { haventPlayedYet, nameDifferences, teamColors } from '$lib/utils'

export function getScoring(gameStats) {
	const scoring = {}
	Object.entries(participants).forEach(([name, playerNames]) => {
		scoring[name] = playerNames.map(playerName => {
			// Get team and points for player
			playerName = nameDifferences[playerName] || playerName

			const playerStats = gameStats.filter(({ player }) => {
				const fullName = `${player.first_name} ${player.last_name}`
				return fullName === playerName
			})

			const player = haventPlayedYet.find(p => p.name === playerName)
			if (player) {
				return { name: playerName, team: player.team, points: 0 }
			}

			if (playerStats.length === 0) {
				return { name: playerName, team: '', points: 0 } // FIXME:
				throw new Error(`could not retrieve stats for ${playerName}`)
			}

			return {
				name: playerName,
				team: playerStats[0].team.abbreviation,
				points: d3.sum(playerStats.map(({ pts }) => pts))
			}
		})
	})
	return scoring
}

// Creates a set of bars for the given data node, at the specified index.
function bar(svg, down, d, selector, xScale, xAxis, width) {
	const g = svg
		.insert('g', selector)
		.attr('class', 'enter')
		.attr('transform', `translate(0,${margin.top + barStep * barPadding})`)
		.attr('text-anchor', 'end')
		.style('font', '10px sans-serif')

	const bar = g
		.selectAll('g')
		.data(d.children)
		.join('g')
		.attr('cursor', d => (!d.children ? null : 'pointer'))
		.on('click', (event, d) => down(svg, d, true, xScale, xAxis, width))

	bar
		.append('text')
		.attr('x', margin.left - 6)
		.attr('y', (barStep * (1 - barPadding)) / 2)
		.attr('dy', '.35em')
		.text(d => d.data.name)

	bar
		.append('rect')
		.attr('x', xScale(0))
		.attr('width', d => xScale(d.value) - xScale(0))
		.attr('height', barStep * (1 - barPadding))

	return g
}

export function up(svg, d, xScale, xAxis, width) {
	if (!d.parent || !svg.selectAll('.exit').empty()) return

	// Rebind the current node to the background.
	svg.select('.background').datum(d.parent)

	// Define two sequenced transitions.
	const transition1 = svg.transition().duration(duration)
	const transition2 = transition1.transition()

	// Mark any currently-displayed bars as exiting.
	const exit = svg.selectAll('.enter').attr('class', 'exit')

	// Update the x-scale domain.
	xScale.domain([0, d3.max(d.parent.children, d => d.value)])

	const participantColor = d3
		.scaleSequential()
		// @ts-ignore
		.domain([0, d3.max(d.parent.children, d => d.value)])
		.interpolator(d3.interpolateYlGnBu)

	// Update the x-axis.
	svg.selectAll('.x-axis').transition(transition1).call(xAxis)

	// Transition exiting bars to the new x-scale.
	exit.selectAll('g').transition(transition1).attr('transform', stagger(xScale))

	// Transition exiting bars to the parent’s position.
	exit
		.selectAll('g')
		.transition(transition2)
		.attr('transform', stack(d.index, xScale))

	// Transition exiting rects to the new scale and fade to parent color.
	exit
		.selectAll('rect')
		.transition(transition1)
		.attr('width', d => xScale(d.value) - xScale(0))
		.attr('fill', d => color(d.data.team, participantColor(d.value)))

	// Transition exiting text to fade out.
	// Remove exiting nodes.
	exit.transition(transition2).attr('fill-opacity', 0).remove()

	// Enter the new bars for the clicked-on data's parent.
	const enter = bar(svg, down, d.parent, '.exit', xScale, xAxis, width).attr(
		'fill-opacity',
		0
	)

	enter.selectAll('g').attr('transform', (d, i) => `translate(0,${barStep * i})`)

	// Transition entering bars to fade in over the full duration.
	enter.transition(transition2).attr('fill-opacity', 1)

	// Color the bars as appropriate.
	// Exiting nodes will obscure the parent bar, so hide it.
	// Transition entering rects to the new x-scale.
	// When the entering parent rect is done, make it visible!
	enter
		.selectAll('rect')
		.attr('fill', d => color(d.data.team, participantColor(d.value)))
		.attr('fill-opacity', p => (p === d ? 0 : null))
		.transition(transition2)
		.attr('width', d => xScale(d.value) - xScale(0))
		.on('end', function (p) {
			d3.select(this).attr('fill-opacity', 1)
		})
}

export function down(svg, d, doAnimation, xScale, xAxis, width) {
	if (!d.children || d3.active(svg.node())) return

	// Rebind the current node to the background.
	svg.select('.background').datum(d)

	// Define two sequenced transitions.
	const transition1 = svg.transition().duration(doAnimation ? duration : 0)
	const transition2 = transition1.transition()

	// Mark any currently-displayed bars as exiting.
	const exit = svg.selectAll('.enter').attr('class', 'exit')

	// Entering nodes immediately obscure the clicked-on bar, so hide it.
	exit.selectAll('rect').attr('fill-opacity', p => (p === d ? 0 : null))

	// Transition exiting bars to fade out.
	exit.transition(transition1).attr('fill-opacity', 0).remove()

	// Enter the new bars for the clicked-on data.
	// Per above, entering bars are immediately visible.
	const enter = bar(svg, down, d, '.y-axis', xScale, xAxis, width).attr(
		'fill-opacity',
		0
	)

	// Have the text fade-in, even though the bars are visible.
	enter.transition(transition1).attr('fill-opacity', 1)

	// Transition entering bars to their new y-position.
	enter
		.selectAll('g')
		.attr('transform', stack(d.index, xScale))
		.transition(transition1)
		.attr('transform', stagger(xScale))

	// Update the x-scale domain.
	xScale.domain([0, d3.max(d.children, d => d.value)])

	const participantColor = d3
		.scaleSequential()
		.domain([0, d3.max(d.children, d => d.value)])
		.interpolator(d3.interpolateYlGnBu)

	// Update the x-axis.
	svg
		.selectAll('.x-axis')
		.transition(transition2)
		.call(g =>
			g
				.attr('class', 'x-axis')
				.attr('transform', `translate(0,${margin.top})`)
				.call(d3.axisTop(xScale).ticks(width / 80))
				.call(g => (g.selection ? g.selection() : g).select('.domain').remove())
		)

	// Transition entering bars to the new x-scale.
	enter
		.selectAll('g')
		.transition(transition2)
		.attr('transform', (d, i) => `translate(0,${barStep * i})`)

	enter
		.selectAll('rect')
		.attr('fill', d => color(d.data.team, participantColor(d.value)))
		.attr('fill-opacity', 1)
		.transition(transition2)
		.attr('fill', d => color(d.data.team, participantColor(d.value)))
		.attr('width', d => xScale(d.value) - xScale(0))
}

function stack(i, xScale) {
	let value = 0
	return d => {
		const t = `translate(${xScale(value) - xScale(0)}, ${barStep * i})`
		value += d.value
		return t
	}
}

function stagger(xScale) {
	let value = 0
	return (d, i) => {
		const t = `translate(${xScale(value) - xScale(0)}, ${barStep * i})`
		value += d.value
		return t
	}
}

export const margin = { top: 0, right: 0, bottom: 8, left: 86 }
const duration = 480
export const barStep = 32
const barPadding = 0.09375

const color = (team, participantColor) => {
	return team ? teamColors[team] : participantColor
}
