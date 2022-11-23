import React from 'react'
import * as d3 from 'd3'
// import * as mm from '@magenta/music'

const margin = { top: 30, right: 30, bottom: 30, left: 30 }
let loaded = false

// let player

const marker = [{ string: 3, tab: 3 }, { string: 3, tab: 5 }, { string: 3, tab: 7 }, { string: 3, tab: 9 }, { string: 2, tab: 12 }, { string: 4, tab: 12 }]

const fretboardOpen = ['', 'E', 'B', 'G', 'D', 'A', 'E', ''].reverse()
const tabLines = ['E', 'B', 'G', 'D', 'A', 'E'].reverse()

const MIDI_NOTES = [
  { pitch: 52, name: 'E', octave: 3, label: 'E3', guitar: [{ string: 1, tab: 0 }] },
  { pitch: 53, name: 'F', octave: 3, label: 'F3', guitar: [{ string: 1, tab: 1 }] },
  { pitch: 54, name: 'F#', octave: 3, label: 'F#3', guitar: [{ string: 1, tab: 2 }] },
  { pitch: 55, name: 'G', octave: 3, label: 'G3', guitar: [{ string: 1, tab: 3 }] },
  { pitch: 56, name: 'G#', octave: 3, label: 'G#3', guitar: [{ string: 1, tab: 4 }] },
  { pitch: 57, name: 'A', octave: 3, label: 'A3', guitar: [{ string: 1, tab: 5 }, { string: 2, tab: 0 }] },
  { pitch: 58, name: 'A#', octave: 3, label: 'A#3', guitar: [{ string: 1, tab: 6 }, { string: 2, tab: 1 }] },
  { pitch: 59, name: 'B', octave: 3, label: 'B3', guitar: [{ string: 1, tab: 7 }, { string: 2, tab: 2 }] },
  { pitch: 60, name: 'C', octave: 4, label: 'C4', guitar: [{ string: 1, tab: 8 }, { string: 2, tab: 3 }] },
  { pitch: 61, name: 'C#', octave: 4, label: 'C#4', guitar: [{ string: 1, tab: 9 }, { string: 2, tab: 4 }] },
  { pitch: 62, name: 'D', octave: 4, label: 'D4', guitar: [{ string: 1, tab: 10 }, { string: 2, tab: 5 }, { string: 3, tab: 0 }] },
  { pitch: 63, name: 'D#', octave: 4, label: 'D#4', guitar: [{ string: 1, tab: 11 }, { string: 2, tab: 6 }, { string: 3, tab: 1 }] },
  { pitch: 64, name: 'E', octave: 4, label: 'E4', guitar: [{ string: 1, tab: 12 }, { string: 2, tab: 7 }, { string: 3, tab: 2 }] },
  { pitch: 65, name: 'F', octave: 4, label: 'F4', guitar: [{ string: 2, tab: 8 }, { string: 3, tab: 3 }] },
  { pitch: 66, name: 'F#', octave: 4, label: 'F#4', guitar: [{ string: 2, tab: 9 }, { string: 3, tab: 4 }] },
  { pitch: 67, name: 'G', octave: 4, label: 'G4', guitar: [{ string: 2, tab: 10 }, { string: 3, tab: 5 }, { string: 4, tab: 0 }] },
  { pitch: 68, name: 'G#', octave: 4, label: 'G#4', guitar: [{ string: 2, tab: 11 }, { string: 3, tab: 6 }, { string: 4, tab: 1 }] },
  { pitch: 69, name: 'A', octave: 4, label: 'A4', guitar: [{ string: 2, tab: 12 }, { string: 3, tab: 7 }, { string: 4, tab: 2 }] },
  { pitch: 70, name: 'A#', octave: 4, label: 'A#4', guitar: [{ string: 3, tab: 8 }, { string: 4, tab: 3 }] },
  { pitch: 71, name: 'B', octave: 4, label: 'B4', guitar: [{ string: 3, tab: 9 }, { string: 4, tab: 4 }, { string: 5, tab: 0 }] },
  { pitch: 72, name: 'C', octave: 5, label: 'C5', guitar: [{ string: 3, tab: 10 }, { string: 4, tab: 5 }, { string: 5, tab: 1 }] },
  { pitch: 73, name: 'C#', octave: 5, label: 'C#5', guitar: [{ string: 3, tab: 11 }, { string: 4, tab: 6 }, { string: 5, tab: 2 }] },
  { pitch: 74, name: 'D', octave: 5, label: 'D5', guitar: [{ string: 3, tab: 12 }, { string: 4, tab: 7 }, { string: 5, tab: 3 }] },
  { pitch: 75, name: 'D#', octave: 5, label: 'D#5', guitar: [{ string: 4, tab: 8 }, { string: 5, tab: 4 }] },
  { pitch: 76, name: 'E', octave: 5, label: 'E5', guitar: [{ string: 4, tab: 9 }, { string: 5, tab: 5 }, { string: 6, tab: 0 }] },
  { pitch: 77, name: 'F', octave: 5, label: 'F5', guitar: [{ string: 4, tab: 10 }, { string: 5, tab: 6 }, { string: 6, tab: 1 }] },
  { pitch: 78, name: 'F#', octave: 5, label: 'F#5', guitar: [{ string: 4, tab: 11 }, { string: 5, tab: 7 }, { string: 6, tab: 2 }] },
  { pitch: 79, name: 'G', octave: 5, label: 'G5', guitar: [{ string: 4, tab: 12 }, { string: 5, tab: 8 }, { string: 6, tab: 3 }] },
  { pitch: 80, name: 'G#', octave: 5, label: 'G#5', guitar: [{ string: 5, tab: 9 }, { string: 6, tab: 4 }] },
  { pitch: 81, name: 'A', octave: 5, label: 'A5', guitar: [{ string: 5, tab: 10 }, { string: 6, tab: 5 }] },
  { pitch: 82, name: 'A#', octave: 5, label: 'A#5', guitar: [{ string: 5, tab: 11 }, { string: 6, tab: 6 }] },
  { pitch: 83, name: 'B', octave: 5, label: 'B5', guitar: [{ string: 5, tab: 12 }, { string: 6, tab: 7 }] },
  { pitch: 84, name: 'C', octave: 6, label: 'C6', guitar: [{ string: 6, tab: 8 }] },
  { pitch: 85, name: 'C#', octave: 6, label: 'C#6', guitar: [{ string: 6, tab: 9 }] },
  { pitch: 86, name: 'D', octave: 6, label: 'D6', guitar: [{ string: 6, tab: 10 }] },
  { pitch: 87, name: 'D#', octave: 6, label: 'D#6', guitar: [{ string: 6, tab: 11 }] },
  { pitch: 88, name: 'E', octave: 6, label: 'E6', guitar: [{ string: 6, tab: 12 }] }
]

class Fretboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = { ...this.state }

    loaded = false
  }

  componentDidMount () {
    loaded = true
    this.render()
  }

  render () {
    try {
      const heightBox = this.props.height
      const widthBox = this.props.width - margin.left
      const notes = this.props.data.notes
      const darkmode = this.props.darkmode
      // const getBPM = this.props.getBPM
      const selection = parseInt(this.props.selection)
      const callbackData = this.props.callback

      const display = this.props.display

      let tabsOfNotes = notes[0]

      const width = this.props.width - margin.left
      const height = this.props.height * 0.8 // - margin.top;

      // Init SVG
      const svgChart = d3.select('#fretboard')
      svgChart.selectAll('*').remove()

      const tabNotation = d3.select('#tabNotation')
      tabNotation.selectAll('*').remove()

      const x = d3.scaleLinear()
        .domain([-1, 12])
        .range([margin.left, width - margin.right])

      const y = d3.scaleLinear()
        .domain([6.5, 0.5])
        .range([margin.top, height - margin.top - margin.bottom])

      const noteheight = (y(1) - y(2))
      const notelength = x(2) - x(1)
      const radius = Math.min(noteheight, notelength) / 2

      if (loaded && display) {
      // Init Axis
        const xAxis = d3.axisBottom().scale(x).ticks(12)
          .tickSize(-height + 2 * margin.top + margin.bottom)
          .tickFormat('')

        const yAxis = d3.axisLeft().scale(y).ticks(8)
          .tickSizeInner(0)
          .tickSizeOuter(-width + margin.left + margin.right)
          .tickFormat((a) => fretboardOpen[a])
        // .attr('id', (a) => a)

        const xLabel = d3.scaleLinear()
          .domain([-0.5, 12.5])
          .range([margin.left, width - margin.right])

        const xAxisLabel = d3.axisBottom().scale(xLabel).ticks(26)
          .tickSize(0)
          .tickFormat((a) => a % 1 === 0 ? (a === 0 ? 'open' : a) : '')

        /*
            svg.append('g')
            .style('opacity','0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(0,${height - margin.top})`)
            .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom)
            .tickFormat('').tickValues(smallbeats))
            */

        svgChart.append('g')
          .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
          .call(xAxis)

        svgChart.append('g')
          .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
          .call(xAxisLabel)

        svgChart.append('g')
          .attr('class', 'gy')
          .attr('transform', `translate(${margin.left}, 0)`)
          .call(yAxis)

        d3.selectAll('g.gy g.tick')
          .append('line')
          .attr('class', 'tick')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', width - margin.left - margin.right)
          .attr('y2', 0)
          .attr('id', d => 'guitarString' + d)
          .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')

        svgChart.append('g')
          .selectAll('circle')
          .attr('transform', `translate(${margin.left}, 0)`)
          .data(marker)
          .enter()
          .append('circle')
          .attr('class', 'marker')
          .attr('cx', d => x(d.tab - 0.5))
          .attr('cy', d => y(d.string + 0.5))
          .attr('r', radius * 0.6)
          .attr('fill', 'grey')
          .attr('opacity', 0.3)

        function calcOptimalFromTabs (tabs, pre, note, mean) {
          const result = note
          let tab
          let cost
          if (!Array.isArray(tabs)) { tabs = [tabs] }
          tabs.forEach(e => {
          // open string gets very high prio as their diff is always 0
            const meanDiff = e.tab === 0 ? 0 : Math.abs(e.tab - mean)
            const stringDiff = Math.abs(e.string - pre.string)
            const tabDiff = e.tab === 0 ? 0 : Math.abs(e.tab - pre.tab)
            const tempCost = meanDiff + stringDiff + tabDiff
            if (cost === undefined) {
              cost = tempCost
              tab = e
            } else {
              if (cost > tempCost) { tab = e }
            }
          })

          result.guitar = tab
          return result
        }

        function calcTabsFromNotes (notes) {
          let previous = { string: 0, tab: 0 }
          const guitarTabs = []
          let meantab = 0
          for (let i = 0; i < notes.length; i++) {
            let pitch = notes[i].pitch
            while (pitch > 88) {
              pitch -= 12
            }
            while (pitch < 52) {
              pitch += 12
            }
            const tabs = MIDI_NOTES.filter(e => e.pitch === pitch)[0].guitar
            const tab = calcOptimalFromTabs(tabs, previous, notes[i], i > 0 ? meantab / (i) : meantab)
            previous = tab.guitar
            meantab += previous.tab
            guitarTabs.push(tab)
          }
          return guitarTabs
        }
        // note = tab 9, string 4

        function calcNoteSeq (notes, sel) {
          if (sel === undefined || sel === 0) { return notes[0] } else if (sel > 0) {
            let internotes = []
            notes.forEach(seq => {
              internotes = internotes.concat(seq)
            })
            return internotes
          }
        }

        if (notes !== undefined && notes.length > 0) {
          const internotes = calcNoteSeq(notes, selection)
          tabsOfNotes = calcTabsFromNotes(internotes)
          callbackData([tabsOfNotes, radius, x, y])

          if (selection > 0) {
            drawTabNotation(tabsOfNotes)
          }

          svgChart
          /* .append('g')
            .selectAll('rect')
            .data(tabsOfNotes)
            .enter()
            */
            .append('circle')
            .attr('id', 'note1')
            .attr('stroke', 'black')
            .attr('fill', 'blue')
            .attr('cx', x(0) + 1) // tab
            .attr('cy', y(1) + 1) // string
            .attr('r', 0)
        }
      }

      function drawTabNotation (notes) {
        function calcMaxStep (data, max) {
          let result = max
          if (data.length !== 0) {
            data.forEach(obj => {
              if (obj.quantizedEndStep > result) {
                result = obj.quantizedEndStep
              }
            })
          }
          return result
        }

        const marginNot = { top: 10, right: 30, bottom: 10, left: 30 }

        const duration = calcMaxStep(notes, 0)

        const x = d3.scaleLinear()
          .domain([0, duration])
          .range([marginNot.left, width - marginNot.right])

        const y = d3.scaleLinear()
          .domain([6, 1])
          .range([marginNot.top, height * 0.25 - marginNot.top - marginNot.bottom])

        // const noteheight = (y(1) - y(2))
        // const notelength = x(2) - x(1)

        const bars = [0]
        for (let step = 1; step <= duration; step++) {
          if (step % 16 === 0) {
            bars.push(step)
          }
        }
        const xAxis = d3.axisTop().scale(x).tickValues(bars)
          .tickSize(-height * 0.25 + 2 * marginNot.top + marginNot.bottom)
          .tickFormat((a) => a / 16)

        const yAxis = d3.axisLeft().scale(y).ticks(6)
          .tickSize(-width + marginNot.left + marginNot.right)
          .tickFormat((a) => tabLines[a - 1])

        tabNotation.append('g')
          .attr('transform', `translate(0, ${2 * marginNot.top})`)
          .call(xAxis)

        tabNotation.append('g')
          .attr('transform', `translate(${marginNot.left}, ${marginNot.top})`)
          .call(yAxis)

        const tabHeight = Math.floor(((height * 0.25) - (2 * marginNot.top) - marginNot.bottom) / 5) //y(2) - y(3)
        const tabLength = x(2) - x(1)

        console.log(tabHeight, (height * 0.25) - (2 * marginNot.top) - marginNot.bottom, y(6), y(1))

        const selection = tabNotation.append('g')
          .selectAll('rect')
          .data(notes)
          .enter()

        selection.append('rect')
          .classed('data', true)
          .attr('transform', `translate(${tabLength / 2}, ${-tabHeight / 2})`)
          .attr('width', tabLength * 0.6)
          .attr('x', d => x(d.quantizedStartStep))
          .attr('y', function (d) { return y(d.guitar.string) })
          .attr('height', tabHeight)
          .attr('fill', function (d) { return darkmode === 'LightMode' ? 'white' : '#333' })

        selection
          .append('text')
          .classed('data', true)
          .attr('transform', d => `translate(${(tabLength / 2) + (tabLength * 0.3)}, ${-4})`)
          .attr('x', d => x(d.quantizedStartStep))
          .attr('y', function (d) { return y(d.guitar.string) })
          .attr('fill', function (d) { return darkmode === 'LightMode' ? 'black' : 'white' })
          .attr('stroke-width', 1)
        // .style({'font-size':'18px','z-index':'999999999'})
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'hanging')
          .text(function (d) { return d.guitar.tab })
      }
      /**
    function playbackGuitar (note, tabsOfNotes) {
      let seq = mm.sequences.createQuantizedNoteSequence(4)
      seq.notes = [note]
      seq = mm.sequences.quantizeNoteSequence(seq, 4)
      note = seq.notes[0]
      const guitar = tabsOfNotes.filter((guitarnote) =>
        guitarnote.pitch === note.pitch &&
            guitarnote.quantizedStartStep === note.quantizedStartStep &&
            guitarnote.quantizedEndStep === note.quantizedEndStep
      )
      const d = guitar[0]
      d3.select('#note1')
        .transition(200).duration(75)
        .attr('stroke', 'black')
        .attr('fill', 'blue')
        .attr('r', radius)
        .attr('cx', x(d.guitar.tab - 0.25))
        .attr('cy', y(d.guitar.string))
    }

    function PlayGuitar () {
      if (tabsOfNotes !== undefined && tabsOfNotes.length > 0) {
        if (player !== undefined) {
          if (!player.isPlaying()) {
            noteheight = (y(1) - y(2))
            notelength = x(2) - x(1)
            radius = Math.min(noteheight, notelength) / 2
            const bpm = getBPM()
            const seq = mm.sequences.createQuantizedNoteSequence(4)
            seq.notes = tabsOfNotes
            player.loadSamples(seq).then(() => {
              player.start(seq, bpm)
            })
          } else {
            player.stop()
            d3.select('#note1')
              .transition(200).duration(100)
              .attr('r', 0)
          }
        } else {
          player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander')
          player.callbackObject = {
            run: (note) => {
              playbackGuitar(note, tabsOfNotes)
            },
            stop: () => {
              d3.select('#note1')
                .transition(200).duration(100)
                .attr('r', 0)
            }
          }
          PlayGuitar()
        }
      }
    }
     */
      try {
        return (
          <div>
            <div width={widthBox} height={heightBox} style={{ height: heightBox + 'px', width: widthBox + 'px', overflow: 'hidden' }} className='viewDiv'>
              <div className='fretboard-container'>
                <svg id='tabNotation' width={width} height={height * 0.25} />
                <svg id='fretboard' width={width} height={height} />
              </div>
              {/**
                  <IconButton color='primary' onClick={PlayGuitar}>
                      <PlayArrowIcon />
                  </IconButton>
                  */}
            </div>
          </div>
        )
      } catch (e) {
        console.log(e)
        return null
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
export default Fretboard
