import React from 'react'
import * as d3 from 'd3'

const MIDI_NOTES = [
  { pitch: 0, name: 'C', octave: -1, label: 'C-1', frequency: 8.176 },
  { pitch: 1, name: 'C#', octave: -1, label: 'C#-1', frequency: 8.662 },
  { pitch: 2, name: 'D', octave: -1, label: 'D-1', frequency: 9.177 },
  { pitch: 3, name: 'D#', octave: -1, label: 'D#-1', frequency: 9.723 },
  { pitch: 4, name: 'E', octave: -1, label: 'E-1', frequency: 10.301 },
  { pitch: 5, name: 'F', octave: -1, label: 'F-1', frequency: 10.913 },
  { pitch: 6, name: 'F#', octave: -1, label: 'F#-1', frequency: 11.562 },
  { pitch: 7, name: 'G', octave: -1, label: 'G-1', frequency: 12.25 },
  { pitch: 8, name: 'G#', octave: -1, label: 'G#-1', frequency: 12.978 },
  { pitch: 9, name: 'A', octave: -1, label: 'A-1', frequency: 13.75 },
  { pitch: 10, name: 'A#', octave: -1, label: 'A#-1', frequency: 14.568 },
  { pitch: 11, name: 'B', octave: -1, label: 'B-1', frequency: 15.434 },
  { pitch: 12, name: 'C', octave: 0, label: 'C0', frequency: 16.352 },
  { pitch: 13, name: 'C#', octave: 0, label: 'C#0', frequency: 17.324 },
  { pitch: 14, name: 'D', octave: 0, label: 'D0', frequency: 18.354 },
  { pitch: 15, name: 'D#', octave: 0, label: 'D#0', frequency: 19.445 },
  { pitch: 16, name: 'E', octave: 0, label: 'E0', frequency: 20.602 },
  { pitch: 17, name: 'F', octave: 0, label: 'F0', frequency: 21.827 },
  { pitch: 18, name: 'F#', octave: 0, label: 'F#0', frequency: 23.125 },
  { pitch: 19, name: 'G', octave: 0, label: 'G0', frequency: 24.5 },
  { pitch: 20, name: 'G#', octave: 0, label: 'G#0', frequency: 25.957 },
  { pitch: 21, name: 'A', octave: 0, label: 'A0', frequency: 27.5 },
  { pitch: 22, name: 'A#', octave: 0, label: 'A#0', frequency: 29.135 },
  { pitch: 23, name: 'B', octave: 0, label: 'B0', frequency: 30.868 },
  { pitch: 24, name: 'C', octave: 1, label: 'C1', frequency: 32.703 },
  { pitch: 25, name: 'C#', octave: 1, label: 'C#1', frequency: 34.648 },
  { pitch: 26, name: 'D', octave: 1, label: 'D1', frequency: 36.708 },
  { pitch: 27, name: 'D#', octave: 1, label: 'D#1', frequency: 38.891 },
  { pitch: 28, name: 'E', octave: 1, label: 'E1', frequency: 41.203 },
  { pitch: 29, name: 'F', octave: 1, label: 'F1', frequency: 43.654 },
  { pitch: 30, name: 'F#', octave: 1, label: 'F#1', frequency: 46.249 },
  { pitch: 31, name: 'G', octave: 1, label: 'G1', frequency: 48.999 },
  { pitch: 32, name: 'G#', octave: 1, label: 'G#1', frequency: 51.913 },
  { pitch: 33, name: 'A', octave: 1, label: 'A1', frequency: 55 },
  { pitch: 34, name: 'A#', octave: 1, label: 'A#1', frequency: 58.27 },
  { pitch: 35, name: 'B', octave: 1, label: 'B1', frequency: 61.735 },
  { pitch: 36, name: 'C', octave: 2, label: 'C2', frequency: 65.406 },
  { pitch: 37, name: 'C#', octave: 2, label: 'C#2', frequency: 69.296 },
  { pitch: 38, name: 'D', octave: 2, label: 'D2', frequency: 73.416 },
  { pitch: 39, name: 'D#', octave: 2, label: 'D#2', frequency: 77.782 },
  { pitch: 40, name: 'E', octave: 2, label: 'E2', frequency: 82.407 },
  { pitch: 41, name: 'F', octave: 2, label: 'F2', frequency: 87.307 },
  { pitch: 42, name: 'F#', octave: 2, label: 'F#2', frequency: 92.499 },
  { pitch: 43, name: 'G', octave: 2, label: 'G2', frequency: 97.999 },
  { pitch: 44, name: 'G#', octave: 2, label: 'G#2', frequency: 103.826 },
  { pitch: 45, name: 'A', octave: 2, label: 'A2', frequency: 110 },
  { pitch: 46, name: 'A#', octave: 2, label: 'A#2', frequency: 116.541 },
  { pitch: 47, name: 'B', octave: 2, label: 'B2', frequency: 123.471 },
  { pitch: 48, name: 'C', octave: 3, label: 'C3', frequency: 130.813 },
  { pitch: 49, name: 'C#', octave: 3, label: 'C#3', frequency: 138.591 },
  { pitch: 50, name: 'D', octave: 3, label: 'D3', frequency: 146.832 },
  { pitch: 51, name: 'D#', octave: 3, label: 'D#3', frequency: 155.563 },
  { pitch: 52, name: 'E', octave: 3, label: 'E3', frequency: 164.814 },
  { pitch: 53, name: 'F', octave: 3, label: 'F3', frequency: 174.614 },
  { pitch: 54, name: 'F#', octave: 3, label: 'F#3', frequency: 184.997 },
  { pitch: 55, name: 'G', octave: 3, label: 'G3', frequency: 195.998 },
  { pitch: 56, name: 'G#', octave: 3, label: 'G#3', frequency: 207.652 },
  { pitch: 57, name: 'A', octave: 3, label: 'A3', frequency: 220 },
  { pitch: 58, name: 'A#', octave: 3, label: 'A#3', frequency: 233.082 },
  { pitch: 59, name: 'B', octave: 3, label: 'B3', frequency: 246.942 },
  { pitch: 60, name: 'C', octave: 4, label: 'C4', frequency: 261.626 },
  { pitch: 61, name: 'C#', octave: 4, label: 'C#4', frequency: 277.183 },
  { pitch: 62, name: 'D', octave: 4, label: 'D4', frequency: 293.665 },
  { pitch: 63, name: 'D#', octave: 4, label: 'D#4', frequency: 311.127 },
  { pitch: 64, name: 'E', octave: 4, label: 'E4', frequency: 329.628 },
  { pitch: 65, name: 'F', octave: 4, label: 'F4', frequency: 349.228 },
  { pitch: 66, name: 'F#', octave: 4, label: 'F#4', frequency: 369.994 },
  { pitch: 67, name: 'G', octave: 4, label: 'G4', frequency: 391.995 },
  { pitch: 68, name: 'G#', octave: 4, label: 'G#4', frequency: 415.305 },
  { pitch: 69, name: 'A', octave: 4, label: 'A4', frequency: 440 },
  { pitch: 70, name: 'A#', octave: 4, label: 'A#4', frequency: 466.164 },
  { pitch: 71, name: 'B', octave: 4, label: 'B4', frequency: 493.883 },
  { pitch: 72, name: 'C', octave: 5, label: 'C5', frequency: 523.251 },
  { pitch: 73, name: 'C#', octave: 5, label: 'C#5', frequency: 554.365 },
  { pitch: 74, name: 'D', octave: 5, label: 'D5', frequency: 587.33 },
  { pitch: 75, name: 'D#', octave: 5, label: 'D#5', frequency: 622.254 },
  { pitch: 76, name: 'E', octave: 5, label: 'E5', frequency: 659.255 },
  { pitch: 77, name: 'F', octave: 5, label: 'F5', frequency: 698.456 },
  { pitch: 78, name: 'F#', octave: 5, label: 'F#5', frequency: 739.989 },
  { pitch: 79, name: 'G', octave: 5, label: 'G5', frequency: 783.991 },
  { pitch: 80, name: 'G#', octave: 5, label: 'G#5', frequency: 830.609 },
  { pitch: 81, name: 'A', octave: 5, label: 'A5', frequency: 880 },
  { pitch: 82, name: 'A#', octave: 5, label: 'A#5', frequency: 932.328 },
  { pitch: 83, name: 'B', octave: 5, label: 'B5', frequency: 987.767 },
  { pitch: 84, name: 'C', octave: 6, label: 'C6', frequency: 1046.502 },
  { pitch: 85, name: 'C#', octave: 6, label: 'C#6', frequency: 1108.731 },
  { pitch: 86, name: 'D', octave: 6, label: 'D6', frequency: 1174.659 },
  { pitch: 87, name: 'D#', octave: 6, label: 'D#6', frequency: 1244.508 },
  { pitch: 88, name: 'E', octave: 6, label: 'E6', frequency: 1318.51 },
  { pitch: 89, name: 'F', octave: 6, label: 'F6', frequency: 1396.913 },
  { pitch: 90, name: 'F#', octave: 6, label: 'F#6', frequency: 1479.978 },
  { pitch: 91, name: 'G', octave: 6, label: 'G6', frequency: 1567.982 },
  { pitch: 92, name: 'G#', octave: 6, label: 'G#6', frequency: 1661.219 },
  { pitch: 93, name: 'A', octave: 6, label: 'A6', frequency: 1760 },
  { pitch: 94, name: 'A#', octave: 6, label: 'A#6', frequency: 1864.655 },
  { pitch: 95, name: 'B', octave: 6, label: 'B6', frequency: 1975.533 },
  { pitch: 96, name: 'C', octave: 7, label: 'C7', frequency: 2093.005 },
  { pitch: 97, name: 'C#', octave: 7, label: 'C#7', frequency: 2217.461 },
  { pitch: 98, name: 'D', octave: 7, label: 'D7', frequency: 2349.318 },
  { pitch: 99, name: 'D#', octave: 7, label: 'D#7', frequency: 2489.016 },
  { pitch: 100, name: 'E', octave: 7, label: 'E7', frequency: 2637.02 },
  { pitch: 101, name: 'F', octave: 7, label: 'F7', frequency: 2793.826 },
  { pitch: 102, name: 'F#', octave: 7, label: 'F#7', frequency: 2959.955 },
  { pitch: 103, name: 'G', octave: 7, label: 'G7', frequency: 3135.963 },
  { pitch: 104, name: 'G#', octave: 7, label: 'G#7', frequency: 3322.438 },
  { pitch: 105, name: 'A', octave: 7, label: 'A7', frequency: 3520 },
  { pitch: 106, name: 'A#', octave: 7, label: 'A#7', frequency: 3729.31 },
  { pitch: 107, name: 'B', octave: 7, label: 'B7', frequency: 3951.066 },
  { pitch: 108, name: 'C', octave: 8, label: 'C8', frequency: 4186.009 },
  { pitch: 109, name: 'C#', octave: 8, label: 'C#8', frequency: 4434.922 },
  { pitch: 110, name: 'D', octave: 8, label: 'D8', frequency: 4698.636 },
  { pitch: 111, name: 'D#', octave: 8, label: 'D#8', frequency: 4978.032 },
  { pitch: 112, name: 'E', octave: 8, label: 'E8', frequency: 5274.041 },
  { pitch: 113, name: 'F', octave: 8, label: 'F8', frequency: 5587.652 },
  { pitch: 114, name: 'F#', octave: 8, label: 'F#8', frequency: 5919.911 },
  { pitch: 115, name: 'G', octave: 8, label: 'G8', frequency: 6271.927 },
  { pitch: 116, name: 'G#', octave: 8, label: 'G#8', frequency: 6644.875 },
  { pitch: 117, name: 'A', octave: 8, label: 'A8', frequency: 7040 },
  { pitch: 118, name: 'A#', octave: 8, label: 'A#8', frequency: 7458.62 },
  { pitch: 119, name: 'B', octave: 8, label: 'B8', frequency: 7902.133 },
  { pitch: 120, name: 'C', octave: 9, label: 'C9', frequency: 8372.018 },
  { pitch: 121, name: 'C#', octave: 9, label: 'C#9', frequency: 8869.844 },
  { pitch: 122, name: 'D', octave: 9, label: 'D9', frequency: 9397.273 },
  { pitch: 123, name: 'D#', octave: 9, label: 'D#9', frequency: 9956.063 },
  { pitch: 124, name: 'E', octave: 9, label: 'E9', frequency: 10548.08 },
  { pitch: 125, name: 'F', octave: 9, label: 'F9', frequency: 11175.3 },
  { pitch: 126, name: 'F#', octave: 9, label: 'F#9', frequency: 11839.82 },
  { pitch: 127, name: 'G', octave: 9, label: 'G9', frequency: 12543.85 }
]

const margin = { top: 30, right: 50, bottom: 30, left: 30 }
let cop = [{ pitch: -1 }, -1]
let size = 1
let autoUpdate = true
let provenanceVis = false
let brushactive = [margin.left, margin.left, false, margin.top, margin.top]
const diff = []
let singledrag = true
let selected = []

class PianoChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = { ...this.state }
  }

  // total end step of data
  dataLength (data) {
    let result = 0
    data.length !== 0 ? data.forEach(arr => arr.forEach(obj => { if (obj.quantizedEndStep > result) result = obj.quantizedEndStep })) : result = 64
    return result > 64 ? result : 64
  }

  componentDidMount () {
    this.render()
  }

  render () {
    try {
      d3.select('#chartSvg').selectAll('*').remove()

      const numViews = this.props.partialGrid
      const guitarView = this.props.guitarView
      const width = (this.props.width - margin.left) * size
      const data = this.props.data.notes
      const ai = this.props.data.ai
      const color = this.props.data.color
      const callback = this.props.callback
      const minmaxpitch = this.props.minmaxpitch
      const indizes = this.props.data.index
      const colormode = this.props.colormode
      const selectInDropdown = this.props.selectInDropdown
      const mainmelo = this.props.melodies
      const indexesOfView = this.props.indexesOfView
      // const lastnotai = this.props.data.lastnotai
      let height = this.props.height// (minmaxpitch.highest-minmaxpitch.lowest)*13 + margin.top + margin.bottom;
      height = (numViews === 0 || guitarView) ? height / 2 : height / 4

      const svg = d3.select('#chartSvg').attr('width', width).attr('height', height)
      // let div = document.querySelector('#divsvg')
      const darkmode = this.props.darkmode
      autoUpdate = this.props.autoUpdate

      numViews === 0
        ? provenanceVis = this.props.provVis
        : provenanceVis = false

      let datalength = this.dataLength(data)

      const smallbeats = getBeats(true)
      const bars = getBeats(false)
      const that = this

      let onceEv = false
      let once = true

      svg.append('rect').attr('height', height)
        .attr('width', width)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', darkmode === 'LightMode' ? 'white' : '#333')

      if (!onceEv) {
        d3.select('#chartSvg')
          .on('wheel', (e) => resizeByWheel(e), { passive: false })
      }
      onceEv = true

      if (minmaxpitch.adjust) { adapt() }

      async function adapt () {
        const a = () => {
          if (data.length > 0) {
            const pitch = []
            data.forEach((seq) => seq.forEach((note) => {
              pitch.push(note.pitch)
            }))
            minmaxpitch.lowest = Math.min(...pitch) - 1
            minmaxpitch.highest = Math.max(Math.max(...pitch) + 1, minmaxpitch.lowest + 13)
          } else {
            minmaxpitch.lowest = 48
            minmaxpitch.highest = 72
          }/*
            if((minmaxpitch.highest-minmaxpitch.lowest)%7!==2){
              var diff = 2-((minmaxpitch.highest-minmaxpitch.lowest)%7)
              diff<0?diff+=7:diff+=0;
              console.log(diff)
              minmaxpitch.highest+= diff
            } */
        }
        await a()
      }

      const pitchesWc = getPitches(false, true)
      const pitches = getPitches(true, false)

      // resize with  ctrl + wheel
      function resizeByWheel (e) {
        if (once && e.ctrlKey) {
          once = false
          e.preventDefault()
          size = Math.max(Math.min(size - (e.deltaY / 100), 14), 1)
          onceEv = false
          that.render()
        }
      }

      function getLabName (name) {
        const i = name.toString()
        const note = MIDI_NOTES.filter(obj => obj.label === i)
        return note[0].pitch
      }

      // label of midi note
      function getLabel (max, min) {
        const labels = []
        for (let i = max; i >= min; i--) {
          const note = MIDI_NOTES.find(obj => {
            return obj.pitch === i
          })
          if (note !== undefined) {
            labels[max - i] = note.label
          }
        }
        return labels
      }

      const provCol = (i) => d3.interpolateRdBu(((4 - i) / 4)) // -Turbo; -Plasma; -Cividis , plasma shows best gradient, turbo high variance colors, cividis hard to distinguish

      const x = d3.scaleLinear()
        .domain([0, datalength])
        .range([margin.left, width - margin.right])

      const y = d3.scaleBand()
        .domain(getLabel(minmaxpitch.highest, minmaxpitch.lowest))
        .rangeRound([margin.top, height - margin.bottom])

      const yPitch = d3.scaleLinear()
        .domain([minmaxpitch.highest, minmaxpitch.lowest - 1])
        .range([margin.top, height - margin.bottom])

      function xAxis (g) {
        g
          .attr('transform', `translate(0,${margin.top})`)
          .call(d3.axisTop(x).tickValues(bars).tickFormat(d => d / 16))
      }

      function yAxis (g) {
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(minmaxpitch.highest - minmaxpitch.lowest).tickSize(0)
            .tickFormat((t) => {
              if (tickDependOnSize(getLabName(t), barHeight)) {
                return t// getLab(t).label;
              }
            }))
      }

      function tickDependOnSize (tick, space) {
        if (space < 2) {
          return tick % 12 === 0
        } else if (space < 5) {
          return tick % 12 === 0 || tick % 12 === 5
        } else if (space < 10) {
          return tick % 12 === 0 || tick % 12 === 5 || tick % 12 === 9
        } else {
          return tick % 12 === 0 || tick % 12 === 2 || tick % 12 === 4 || tick % 12 === 5 || tick % 12 === 7 || tick % 12 === 9 || tick % 12 === 11
        }
      }

      // beat ticks
      function getBeats (small) {
        const beat = []
        for (let i = 0; i < (datalength + 1) / 4; i++) {
          if (i % 4 !== 0 && small) { beat.push(i * 4) } else if (i % 4 === 0 && i !== 0 && !small) { beat.push(i * 4) }
        }
        return beat
      }

      function getLab (i) {
        const note = MIDI_NOTES.filter(obj => obj.pitch === i)
        return note[0]
      }

      // list of pitches with C or without C for ticks
      function getPitches (withoutC, notAll) {
        const pitche = []
        if (notAll) {
          let a = 0
          for (let i = minmaxpitch.lowest; i < minmaxpitch.highest + 1; i++) {
            const bla = getLab(i).name
            const wc = withoutC ? !(bla.includes('C')) : bla.includes('C')
            if (!(bla.includes('#')) && wc) {
              pitche[a] = getLab(i).label
              a++
            }
          }
        } else {
          for (let i = minmaxpitch.lowest; i < minmaxpitch.highest + 1; i++) {
            pitche.push(getLab(i).label)
          }
        }
        return pitche
      }

      const barHeight = y.bandwidth()

      svg.append('g').call(xAxis)
      svg.append('g').call(yAxis)

      svg.append('g')
        .style('opacity', '0.25')
        .attr('class', 'x axis-grid')
        .attr('transform', `translate(0,${height - margin.top})`)
        .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom)
          .tickFormat('').tickValues(smallbeats))

      svg.append('g')
        .style('opacity', '0.25')
        .attr('class', 'x axis-grid')
        .attr('transform', `translate(0,${height - margin.top})`)
        .attr('stroke-width', 2)
        .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom)
          .tickFormat('').tickValues(bars))

      // shift to bars (translate) --> grey inbetween added
      // all line except C black
      /*
    svg.append('g')
    .style("opacity","0.25")
    .attr('class', 'y axis-grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right)
          .tickFormat("").tickValues(pitchesWoc));
    */

      const ef = []
      // rectangles for pattern
      svg.append('g')
        .selectAll('rect')
        .style('opacity', '0.25')
        .attr('class', 'y axis-grid')
        .attr('transform', `translate(${margin.left},0)`)
        .data(pitches)
        .enter()
        .append('rect')
        .attr('stroke-width', 0.8)
      // .attr("stroke-opacity",0.4)
      // .attr("stroke","black")
        .attr('height', y(getLab(minmaxpitch.lowest + 1).label) - y(getLab(minmaxpitch.lowest + 2).label))
        .attr('width', d => width - margin.left - margin.right)
        .attr('x', d => { if (d.includes('F') && !d.includes('#')) { ef.push(d) } return margin.left })
        .attr('y', d => y(d))
        .attr('opacity', d => d.includes('#') ? 0.2 : 0.1)
        .attr('fill', d => 'grey')

      /*
    svg.append('g')
    .append("rect")
    //.attr("stroke-width", 0.8)
    .attr("height", ((y("B3")-y("C4"))/2)+2)
    .attr("width", d => width - margin.left - margin.right)
    .attr("x", d => margin.left)
    .attr("y", d => yPitch(minmaxpitch.highest+1))
    .attr("opacity",0.1)
    .attr("fill","grey")

    svg.append('g')
    .append("rect")
    .attr('transform', `translate(0,${(y("B3")-y("C4"))/2})`)
    //.attr("stroke-width", 0.8)
    .attr("height", (y("B3")-y("C4"))/2)
    .attr("width", d => width - margin.left - margin.right)
    .attr("x", d => margin.left)
    .attr("y", d => yPitch(minmaxpitch.lowest))
    .attr("opacity",0.1)
    .attr("fill","grey")
    */

      // line between e and f
      if (ef.length > 0) {
        svg.append('g')
          .style('opacity', '0.25')
          .attr('class', 'y axis-grid-C')
          .attr('transform', `translate(${margin.left},${0})`)
          .attr('stroke', 'blue')
          .attr('fill', 'blue')
          .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right)
            .tickFormat('').tickValues(ef))
          .selectAll('line')
          .attr('transform', `translate(0,${(y(getLab(minmaxpitch.lowest + 1).label) - y(getLab(minmaxpitch.lowest + 2).label)) / 2})`)
          .attr('opacity', 0.4)
          .attr('stroke-width', 1)
      }

      // C line blue
      if (pitchesWc.length > 0) {
        svg.append('g')
          .style('opacity', '0.25')
          .attr('class', 'y axis-grid-C')
          .attr('transform', `translate(${margin.left},${0})`)
          .attr('stroke', 'blue')
          .attr('fill', 'blue')
          .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right)
            .tickFormat('').tickValues(pitchesWc))
          .selectAll('line')
        // .attr("stroke","blue")
          .attr('transform', `translate(0,${(y(getLab(minmaxpitch.lowest + 1).label) - y(getLab(minmaxpitch.lowest + 2).label)) / 2})`)
          .attr('stroke-width', 2)
      }

      /**
    function colorsByPitch (p) {
      const col = ['red', 'red', 'orange', 'orange', 'yellow', 'green', 'green', 'blue', 'blue', 'black', 'black', 'pink']
      const b = p % 12
      return col[b]
    }

    function colorsBySeq (i) {
      const col = ['red', 'orange', 'green', 'blue', 'yellow', 'black', 'pink']
      const b = i % 7
      return col[b]
    }
    */
      // opacity for normal and # notes
      function opacit (i, ai) {
        return 1 // 0.7
      }

      // update data when single drag
      function updateData (d, e) {
        const length = d.quantizedEndStep - d.quantizedStartStep
        const mx = e.offsetX
        const my = e.offsetY
        if (!e.ctrlKey) {
          d.pitch = Math.round(yPitch.invert(my - ((barHeight) / 2)))
          if (d.pitch > minmaxpitch.highest) d.pitch = minmaxpitch.highest
          if (d.pitch < minmaxpitch.lowest) d.pitch = minmaxpitch.lowest
          d.quantizedStartStep = Math.round(x.invert(mx) - (length / 2))
          if (d.quantizedStartStep <= 0) d.quantizedStartStep = 0
          if (d.quantizedStartStep + length > datalength) { d.quantizedStartStep = datalength - length; datalength = datalength + 1 }
          d.quantizedEndStep = d.quantizedStartStep + length
        } else {
          d.quantizedEndStep = Math.round(x.invert(mx) + (length / 2))
          if (d.quantizedEndStep <= d.quantizedStartStep) d.quantizedEndStep = d.quantizedStartStep + 1
          if (d.quantizedEndStep > datalength) d.quantizedEndStep = datalength
        }
        d.provenance = adjustprovenance(d.provenance, true)
        return d
      }

      // update data multi drag
      function updateDataDiff (d, e, dref) {
        const dtemp = { pitch: 0, quantizedEndStep: 0, quantizedStartStep: 0, provenance: d.provenance }
        const length = d.quantizedEndStep - d.quantizedStartStep
        const mx = e.offsetX
        const my = e.offsetY
        if (!e.ctrlKey) {
          dtemp.quantizedStartStep = Math.round(x.invert(mx) - (length / 2)) + dref.quantizedStartStep
          if (dtemp.quantizedStartStep <= 0) dtemp.quantizedStartStep = 0
          if (dtemp.quantizedStartStep + length > datalength) { dtemp.quantizedStartStep = datalength - length; datalength = datalength + 1 }
          dtemp.quantizedEndStep = dtemp.quantizedStartStep + length
          dtemp.pitch = Math.round(yPitch.invert(my - ((barHeight) / 2))) + dref.pitch
          if (dtemp.pitch > minmaxpitch.highest) dtemp.pitch = minmaxpitch.highest
          if (dtemp.pitch < minmaxpitch.lowest) dtemp.pitch = minmaxpitch.lowest
        } else {
          dtemp.quantizedEndStep = Math.round(x.invert(mx) + (length / 2))
          if (dtemp.quantizedEndStep <= dtemp.quantizedStartStep) dtemp.quantizedEndStep = dtemp.quantizedStartStep + 1
          if (dtemp.quantizedEndStep > datalength) dtemp.quantizedEndStep = datalength
        }
        dtemp.provenance = adjustprovenance(dtemp.provenance, true)
        return dtemp
      }

      // gradient
      function grad (c, op, id, id2) {
      // if opacity
        const hexToRgb = hex =>
          hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

        if (c === undefined) { return d3.schemeTableau10[8] }
        let rgba
        if (c[0] === '#') {
          const rgb = hexToRgb(c)
          rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + op + ')'
        } else {
          rgba = c.replace(')', ',' + op + ' )').replace('rgb', 'rgba')
        }
        return rgba
        // else
        // return c
      /*
        svg.select("#Grad"+id+id2).remove();
        //gradient for opacity but didnt work with color so opacity in x dir and color in y dir
        const linearGradient = svg.append("linearGradient").attr("id","Grad"+id+id2);
        linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color",c)
                .attr("stop-opacity", op);
            linearGradient.append("stop")
                .attr("offset", "50%")
                .attr("stop-color",c)
                .attr("stop-opacity", op);
            linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color",c)
                .attr("stop-opacity", 0.1);
        */
      }

      function deleteItem (i, d) {
        const index = data[i].indexOf(d)
        if (index > -1 && index < data[i].length) { data[i].splice(index, 1) }
      }

      // currentLevel --> human = true (improve provenance), false (lose provenance)
      function adjustprovenance (currentLevel, human) {
        if (currentLevel === 0 && human) { return 1 } else if ((currentLevel === 3 && human) || (currentLevel === 1 && !human)) { return 2 } else if (currentLevel === 4 && !human) { return 3 } else { return currentLevel }
      }

      // drag function
      function drag (ai, i) {
        return d3.drag()
          .on('drag', function (event, d) {
            if (singledrag) {
              d = updateData(d, event.sourceEvent)
              d3.select(this)
                .attr('x', d => x(d.quantizedStartStep))
                .attr('y', d => y(getLab(d.pitch).label))
                .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep)))
                .attr('fill', d => grad(provenanceVis ? provCol(d.provenance) : color[i], opacit(d.pitch, ai), i, d.pitch))// return "URL(#Grad"+i+d.pitch+")";}); //add{before grad}
            } else {
              selected.forEach((j) => {
                const dtemp = updateDataDiff(data[i][j], event.sourceEvent, diff[j])
                d3.select('#n' + i + '_' + j)
                  .attr('x', d1 => x(dtemp.quantizedStartStep))
                  .attr('y', d1 => y(getLab(dtemp.pitch).label))
                  .attr('width', d1 => (x(dtemp.quantizedEndStep) - x(dtemp.quantizedStartStep)))
                  .attr('fill', d1 => grad(provenanceVis ? provCol(dtemp.provenance) : color[i], opacit(dtemp.pitch, ai), i, dtemp.pitch))// return "URL(#Grad"+i+dtemp.pitch+")";});
                if (data[i][j] !== dtemp) {
                  data[i][j] = dtemp
                } else {
                  data[i][j].pitch = dtemp.pitch
                  data[i][j].quantizedEndStep = dtemp.quantizedEndStep
                  data[i][j].quantizedStartStep = dtemp.quantizedStartStep
                  data[i][j].provenance = dtemp.provenance
                }
              })
            }
          })
          .on('end', function (event, d) {
            if (singledrag) {
              d3.select(this).attr('stroke-width', 1)
            } else {
              selected.forEach((j) => {
                d3.select('#n' + i + '_' + j)
                  .attr('stroke-width', 1)
              })
            }
            selected = []
            if (autoUpdate) { callback(data, indizes) }
          })
          .on('start', function (event, d) {
            if (!brushactive[2] || (d.quantizedStartStep < brushactive[0] || d.quantizedStartStep >= brushactive[1] ||
             d.pitch > brushactive[3] || d.pitch <= brushactive[4])) {
              singledrag = true
              if (event.sourceEvent.altKey) { deleteItem(i, d) }
              d3.select(this).attr('stroke-width', 2.5)
              d3.select('*').on('keyup', function (event) {
                copy(d, i, event, true)
              })
            } else {
              singledrag = false
              data[i].forEach((d1, j) => {
                if (d1.quantizedStartStep >= brushactive[0] && d1.quantizedStartStep < brushactive[1] &&
                d1.pitch <= brushactive[3] && d1.pitch > brushactive[4]) {
                  d3.select('#n' + i + '_' + j)
                    .attr('stroke-width', 2.5)
                  diff[j] = { pitch: d1.pitch - d.pitch, quantizedStartStep: d1.quantizedStartStep - d.quantizedStartStep }
                  selected.push(j)
                }
              })
            }
          })
      }

      // copy with c and paste with v, delete with delete
      // only works for start and finish not pitch brush
      function copy (d, i, event, drag) {
        if (event.key === 'c' && drag) {
          cop = [d, i]
        } else if (event.key === 'v' && cop[1] !== -1 && !drag) {
          const temp = { pitch: 0, quantizedEndStep: 0, quantizedStartStep: 0 }
          temp.pitch = cop[0].pitch
          temp.quantizedStartStep = cop[0].quantizedStartStep + 1
          temp.quantizedEndStep = cop[0].quantizedEndStep + 1
          temp.provenance = 4
          data[cop[1]].push(temp)
          if (autoUpdate) { callback(data, indizes) } else { that.render() }
        } else if (event.key === 'Delete') {
          if (brushactive[2] === true && !drag) {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] !== undefined && data[i][j].quantizedStartStep >= brushactive[0] &&
                data[i][j].quantizedEndStep <= brushactive[1] && data[i][j].pitch <= brushactive[3] && data[i][j].pitch >= brushactive[4]) {
                  deleteItem(i, data[i][j])
                  j--
                }
              }
            }
          } else if (drag) {
            deleteItem(i, d)
          }
          if (autoUpdate) { callback(data, indizes) }
        } else if (event.key === 'n' && d === 0 && i === 0 && !drag) {
          const temp = { pitch: minmaxpitch.lowest + 2, quantizedEndStep: 2, quantizedStartStep: 0, provenance: 4 }
          if (brushactive[2] === true) {
            temp.quantizedStartStep = brushactive[0]
            temp.quantizedEndStep = brushactive[1]
            temp.pitch = brushactive[3]
          }
          let startData
          if (data.length === 0) {
            data.push([temp])
            startData = {
              ai: false,
              temp: -1,
              parent: 0,
              lastnotai: temp.quantizedEndStep,
              fill: true,
              modelUsed: -1
            }
          } else {
            data[0].push(temp)
          }
          if (autoUpdate) { callback(data, undefined, startData) } else { that.render() }
        }
      }

      /**
    // unused
    function calcMin (data, min) {
      let result = min
      data.length !== 0 ? data.forEach(obj => obj.quantizedStartStep < result ? result = obj.quantizedStartStep : null) : result = result
      return result
    }
    */
      // max step of note sequence
      function calcMax (data, max) {
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
      // const min = lastnotai
      let max = 0

      // last not ai
      for (let i = 0; i < data.length; i++) {
        if (ai[i]) {
          max = calcMax(data[i], max)
        }
      }

      // adjust brush
      function changeBrush (e) {
        if (e !== undefined && e.sourceEvent !== undefined) {
          const extent = e.selection
          if (extent !== null) {
            const brushmin = getNearestBeat(x.invert(extent[0][0]))
            const brushmax = getNearestBeat(x.invert(extent[1][0]))
            // bymin,max
            const bymax = getNearestPitch(yPitch.invert(extent[0][1]))
            const bymin = getNearestPitch(yPitch.invert(extent[1][1]))
            d3.select('#brush').transition().call(e.target.move,
              [[x(brushmin), yPitch(bymax)], [x(brushmax), yPitch(bymin)]])
            document.getElementById('brushed').value = [brushmin, brushmax, true, bymax, bymin]
            brushactive = [brushmin, brushmax, true, bymax, bymin]
          } else {
            d3.select('#brush').transition().call(e.target.clear)
            document.getElementById('brushed').value = [margin.left, width - margin.right, false, margin.top, height - margin.bottom]
            brushactive = [margin.left, width - margin.right, false, margin.top, height - margin.bottom]
          }
        }
      }

      // provenance before brush
      /*
      if(provenanceVis){
        for(var i = 0;i<data.length;i++){

          svg.append("g")
          .selectAll("rect")
          .data(data[i])
          .enter()
          .append("rect")
          .attr("class","provenance")
          .classed("provenance", true)
          .attr("stroke-width", 0.8)
          .attr("stroke", "none")
          .attr("height", y(getLab(minmaxpitch.lowest).label)-y(getLab(minmaxpitch.highest).label))
          .attr("width", d => (x(d.quantizedEndStep)-x(d.quantizedStartStep)))
          .attr("x", d => x(d.quantizedStartStep))
          .attr("y", d => y(getLab(minmaxpitch.highest).label))
          .attr("opacity",0.075)
          .attr("fill",d => d3.interpolatePlasma(Math.min(0.05+d.provenance/4,1))) //-Turbo; -Plasma; -Cividis , plasma shows best gradient, turbo high variance colors, cividis hard to distinguish
        }
      }
      */

      /**
    if (max - min > 0 && false) {
      svg.append('g').append('rect')
        .attr('opacity', 0.1).attr('fill', 'grey')
        .attr('height', y(getLab(minmaxpitch.lowest).label) - y(getLab(minmaxpitch.highest).label))
        .attr('width', x(max - min) - margin.left)
        .attr('x', x(min))
        .attr('y', y(getLab(minmaxpitch.highest).label))
    }
    */

      d3.select('#chartSvg').append('g').attr('id', 'brush').call(
        d3.brush()
          .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
          .on('end', (e) => changeBrush(e))
      )

      if (document.getElementById('brushed') !== undefined && document.getElementById('brushed') !== null) {
        let brushed = document.getElementById('brushed').value
        if (brushed !== '') {
          brushed = brushed.split(',')
          brushactive[0] = parseInt(brushed[0])
          brushactive[1] = parseInt(brushed[1])
          brushactive[2] = (brushed[2] === 'true')
          brushactive[3] = parseInt(brushed[3])
          brushactive[4] = parseInt(brushed[4])
        }
      }
      if (brushactive[2]) {
        if (brushactive[4] === undefined) {
          d3.select('#brush').call(
            d3.brush().move,
            [[x(brushactive[0]), y(getLab(brushactive[3]).label)], [x(brushactive[1]), height - margin.bottom]])
        } else {
          d3.select('#brush').call(
            d3.brush().move,
            [[x(brushactive[0]), y(getLab(brushactive[3]).label)], [x(brushactive[1]), y(getLab(brushactive[4]).label)]])
        }
      } else {
        d3.select('#brush').call(
          d3.brush().move,
          [[x(0), 0], [x(0), 0]])
      }

      const group = d3.select('#chartSvg').append('g').attr('id', 'tg')
      const tt = d3.select('#tg')
        .append('text')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .attr('width', 40)
        .attr('height', 30)
        .style('opacity', 0)

      d3.select('#tg').append('rect').attr('id', 'br').attr('fill', 'white')
        .style('opacity', 0).attr('stroke', 'green')
      tt.append('tspan').attr('id', 't1').attr('class', 'tooltipChart').attr('dx', '0em').attr('dy', '1.1em')
      tt.append('tspan').attr('id', 't2').attr('class', 'tooltipChart').attr('dx', '0em').attr('dy', '1.1em')

      const text = document.getElementById('tooltip')

      svg.append('rect')
        .attr('id', 'playback_line_roll')
        .attr('height', height - margin.top - margin.bottom)
        .attr('width', 4)
        .attr('x', x(0))
        .attr('y', margin.top)
        .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
        .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
        .attr('opacity', 1)
        .attr('duration', 0)
        .call(d3.drag()
          .on('end', function (e) {
            const mx = e.x
            let timestamp = Math.round(x.invert(mx))
            if (timestamp <= 0) timestamp = 0
            if (timestamp > datalength) { timestamp = datalength }

            d3.select(this)
              .transition()
              .duration(100)
              .attr('x', d => x(timestamp))
              .attr('duration', timestamp)
          }).on('drag', function (e) {
            d3.select(this)
              .attr('x', e.x)
          }))

      d3.select('#provonenceLegend').remove()
      if (provenanceVis) {
        function calcprovenanceStatistics () {
          const notes = data
          const stats = [0, 0, 0, 0, 0]
          notes.forEach(seq => seq.forEach(note => {
            stats[note.provenance]++
          }))
          let percentiles = stats
          const sum = stats.reduce(function (pv, cv) { return pv + cv }, 0)
          percentiles = percentiles.map(function (item) { return ((item / sum) * 100).toPrecision(3) })
          percentiles.forEach((val, index) => {
            if (isNaN(val)) { percentiles[index] = 0 }
          })
          return percentiles
        }

        const precents = calcprovenanceStatistics()
        d3.select('#provonenceLegend').remove()
        const legend = d3.select('#divsvg').append('svg')
          .attr('id', 'provonenceLegend')
          .attr('height', 60)
          .attr('width', width - margin.left - margin.right)

        const provonenceClass = [4, 3, 2, 1, 0]

        function provLabel (i, line) {
          if (i === 0) {
            if (line === 1) { return 'Notes generated by AI: ' } else if (line === 2) { return precents[i] + '%' }
          } else if (i === 1) {
            if (line === 1) { return 'Notes generated by AI and ' } else if (line === 2) { return 'then adjusted by user: ' } else { return precents[i] + '%' }
          } else if (i === 2) {
            if (line === 1) { return 'Notes adjusted multiple times by' } else if (line === 2) { return 'user and AI in alternating order: ' } else { return precents[i] + '%' }
          } else if (i === 3) {
            if (line === 1) { return 'Notes inputted by user and' } else if (line === 2) { return 'then adjusted by AI: ' } else { return precents[i] + '%' }
          } else if (i === 4) {
            if (line === 1) { return 'Notes inputted by user: ' } else if (line === 2) { return precents[i] + '%' }
          }
          return ''
        }

        const widthLegend = legend.attr('width') - margin.left - margin.right

        legend.append('g')
          .selectAll('text')
          .data(provonenceClass)
          .enter()
          .append('text')
          .attr('class', 'provenanceText')
          .attr('x', d => (4 - d) * (widthLegend / 5) + margin.left * 1.1 + widthLegend / 10)
          .attr('y', 4)
          .attr('dy', '10px')
          .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
          .attr('text-anchor', 'middle')
          .text(d => provLabel(d, 1))

        legend.append('g')
          .selectAll('text')
          .data(provonenceClass)
          .enter()
          .append('text')
          .attr('class', 'provenanceText')
          .attr('y', 4)
          .attr('x', d => (4 - d) * (widthLegend / 5) + margin.left * 1.1 + widthLegend / 10)
          .attr('dy', '30px')
          .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
          .attr('text-anchor', 'middle')
          .text(d => provLabel(d, 2))

        legend.append('g')
          .selectAll('text')
          .data(provonenceClass)
          .enter()
          .append('text')
          .attr('class', 'provenanceText')
          .attr('y', 4)
          .attr('x', d => (4 - d) * (widthLegend / 5) + margin.left * 1.1 + widthLegend / 10)
          .attr('dy', '50px')
          .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
          .attr('text-anchor', 'middle')
          .text(d => provLabel(d, 3))

        legend.append('g')
          .selectAll('rect')
          .data(provonenceClass)
          .enter()
          .append('rect')
          .attr('x', d => (4 - d) * (widthLegend / 5) + (margin.left + margin.right))
          .attr('width', widthLegend / 5 - margin.left - margin.right)
          .attr('height', 58)
          .attr('fill', d => provCol(d))
          .attr('opacity', 0.3)
          .attr('rx', 2)
          .attr('ry', 2)
          .on('mouseenter', (e, d) => {
            d3.selectAll('.provnotes')
              .transition(500)
              .attr('fill', k => grad(provCol(k.provenance), 0.3, 0, k.pitch, k))
              .attr('stroke-opacity', 0.3)
            d3.selectAll('.prov' + d)
              .transition(500)
              .attr('fill', k => grad(provCol(k.provenance), 0.8, 0, k.pitch, k))
              .attr('stroke-opacity', 1)
          })
          .on('mouseleave', (e, d) => {
            d3.selectAll('.provnotes')
              .transition(500)
              .attr('fill', k => grad(provCol(k.provenance), opacit(k.pitch, false), 0, k.pitch, k))
              .attr('stroke-opacity', 1)
          })
      } else {
        function hoverOptions () {
          const color = mainmelo.color
          const padding = ((width - margin.left - margin.right) / color.length) * 0.1
          d3.select('#chartSvg').append('g')
            .selectAll('rect')
            .data(color)
            .enter()
            .append('rect')
            .attr('class', 'pointer')
            .attr('x', (d, i) => (i) * ((width - margin.left - margin.right) / color.length) + (margin.left + padding))
            .attr('y', (d, i) => height - 20)
            .attr('width', ((width - margin.left - margin.right) / color.length) - 2 * padding)
            .attr('height', 20)
            .attr('id', (d, i) => 'seq' + i)
            .attr('fill', d => d)
            .attr('opacity', 1)
            .attr('rx', 2)
            .attr('ry', 2)
            .on('mouseenter', function (d, i, l) {
              d3.selectAll('.provnotes')
                .transition(500)
                .attr('stroke-opacity', 0)
                .attr('opacity', 0)
              const index = d.srcElement.attributes.id.value
              d3.selectAll('.' + index)
                .transition(500)
                .attr('stroke-opacity', 1)
                .attr('opacity', 1)
            })
            .on('mouseleave', () => {
              d3.selectAll('.provnotes')
                .transition(500)
                .attr('stroke-opacity', 1)
                .attr('opacity', 1)
            })
            .on('mouseup', (d) => {
              const indexString = d.srcElement.attributes.id.value
              const index = parseInt(indexString.split('q')[1])
              selectInDropdown(index)
            })
        }

        function legend ({
          color,
          svg,
          w,
          h,
          title,
          tickSize = 6,
          width = 36 + tickSize,
          height = 320,
          marginTop = 30,
          marginRight = 10 + tickSize,
          marginBottom = 30,
          marginLeft = 5,
          ticks = height / 64,
          tickFormat,
          tickValues
        } = {}) {
          let tickAdjust = g => {
            g.selectAll('.tick line').attr('x1', marginLeft - width + marginRight)
            g.selectAll('.tick text').attr('transform', 'rotate(90 13 -3)')
          }
          let x

          function ramp (color, n = 256) {
            const canvas = document.createElement('canvas')
            canvas.width = 1
            canvas.height = n
            const context = canvas.getContext('2d')
            for (let i = n; i > 0; i--) {
              context.fillStyle = color(i / (n - 1))
              context.fillRect(0, i, 1, 1)
            }
            return canvas
          }

          // Continuous
          if (color.interpolate) {
            const n = Math.min(color.domain().length, color.range().length)

            x = color.copy().rangeRound(
              d3.quantize(d3.interpolate(height - marginBottom, marginTop), n)
            )

            svg.append('image')
              .attr('x', w - width)
              .attr('y', (h - height) / 2)
              .attr('width', width - marginLeft - marginRight)
              .attr('height', height - marginTop - marginBottom)
              .attr('preserveAspectRatio', 'none')
              .attr('xlink:href', ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL())
          } else if (color.interpolator) {
            x = Object.assign(color.copy()
              .interpolator(d3.interpolateRound(height - marginBottom, marginTop)),
            { range () { return [height - marginBottom, marginTop] } })

            svg.append('image')
              .attr('x', w - width)
              .attr('y', marginTop)//(h - height) / 2)
              .attr('width', width - marginLeft - marginRight)
              .attr('height', height - marginTop - marginBottom)
              .attr('preserveAspectRatio', 'none')
              .attr('xlink:href', ramp(color.interpolator()).toDataURL())

            // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
            if (!x.ticks) {
              if (tickValues === undefined) {
                const n = Math.round(ticks + 1)
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)))
              }
              if (typeof tickFormat !== 'function') {
                tickFormat = d3.format(tickFormat === undefined ? ',f' : tickFormat)
              }
            }
          } else if (color.invertExtent) {
            const thresholds =
              color.thresholds
                ? color.thresholds() // scaleQuantize
                : color.quantiles
                  ? color.quantiles() // scaleQuantile
                  : color.domain() // scaleThreshold

            const thresholdFormat =
              tickFormat === undefined
                ? d => d
                : typeof tickFormat === 'string'
                  ? d3.format(tickFormat)
                  : tickFormat

            x = d3.scaleLinear()
              .domain([-1, color.range().length - 1])
              .rangeRound([height - marginBottom, marginTop])

            svg.append('g')
              .selectAll('rect')
              .data(color.range())
              .join('rect')
              .attr('y', (d, i) => ((h - height) / 2) + x(i))
              .attr('x', w - width)
              .attr('height', (d, i) => x(i - 1) - x(i))
              .attr('width', width - marginRight - marginLeft)
              .attr('fill', d => d)

            tickValues = d3.range(thresholds.length)
            tickFormat = i => thresholdFormat(thresholds[i], i)
          } else {
            x = d3.scaleBand()
              .domain(color.domain())
              .rangeRound([height - marginBottom, marginTop])

            svg.append('g')
              .selectAll('rect')
              .data(color.domain())
              .join('rect')
              .attr('y', c => ((h - height) / 2) + x(c))
              .attr('x', w - width)
              .attr('height', Math.max(0, x.bandwidth() - 1))
              .attr('width', width - marginLeft - marginRight)
              .attr('fill', color)

            tickAdjust = g => {
              g.selectAll('.tick text').attr("transform", "rotate(90) translate(-30, -5)")//.attr('transform', 'translateX(-5px) rotate(90 10 -5)')//
              g.selectAll('.tick line').remove()
            }
          }

          svg.append('g')
            .attr('transform', `translate(${w - width + marginLeft + marginRight}, ${(marginTop - marginBottom)})`)
            .call(d3.axisRight(x)
              .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
              .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
              .tickSize(tickSize)
              .tickValues(tickValues))
            .call(tickAdjust)
            .call(g => g.select('.domain').remove())
            .call(g => g.append('text')
              .attr('x', 0)
              .attr('y', 0)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .attr('class', 'title')
              .text(title))
        }
        const svgLegend = d3.select('#chartSvg')
        // Legend(d3.scaleSequential([0, 100], d3.interpolateViridis), svgLegend, {})

        if (colormode !== undefined) {
          legend({ color: colormode, svg: svgLegend, w: width, h: height, height: height * 1 })
        }
        hoverOptions()
      }

      // draw notes
      for (let i = 0; i < data.length; i++) {
        const ai1 = ai[i]
        // resize box
        svg.append('g')
          .selectAll('rect')
          .data(data[i])
          .enter()
          .append('rect')
          .attr('id', (d, j) => 'rb' + i + '_' + j)
          .attr('indexfound', (d, j) => i + '_' + j)
          .attr('stroke-width', 2)
          .attr('stroke', 'black')
          .attr('height', barHeight)
          .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep) + 5))
          .attr('rx', 4)
          .attr('ry', 4) // previous 6
          .attr('x', d => x(d.quantizedStartStep))
          .attr('y', d => y(getLab(d.pitch).label))
          .attr('fill', d => 'black')
          .attr('opacity', 0)
          .on('mouseover', function () {
            svg.style('cursor', 'e-resize')
          })
          .on('mouseout', function () {
            svg.style('cursor', 'default')
          })
          .call(d3.drag()
            .on('drag', function (e) {
              const c = d3.select(this)
              svg.style('cursor', 'e-resize')
              const s = d3.select('#n' + this.getAttribute('indexfound'))
              const xv = Number(this.attributes.x.value)
              const w = Number(this.attributes.width.value)
              c
                .attr('width', function () { return Math.max(4, w + (e.x - (xv + w))) + 5 })
              s
                .attr('width', function () { return Math.max(2, w + (e.x - (xv + w))) })
            })
            .on('end', function (e, d) {
              svg.style('cursor', 'default')
              const xv = Number(this.attributes.x.value)
              const w = Number(this.attributes.width.value)
              const c = d3.select(this)
              const s = d3.select('#n' + this.getAttribute('indexfound'))
              d.quantizedEndStep = Math.max(d.quantizedStartStep + 1, Math.round(x.invert(xv + w)))
              d.provenance = adjustprovenance(d.provenance, true)
              c
                .attr('width', function () { return x(d.quantizedEndStep) - x(d.quantizedStartStep) + 5 })
              s
                .attr('width', function () { return x(d.quantizedEndStep) - x(d.quantizedStartStep) })
              if (autoUpdate) { callback(data, indizes) }
            })
          )
        // notes
        svg.append('g')
          .selectAll('rect')
          .data(data[i])
          .enter()
          .append('rect')
          .attr('class', d => indexesOfView.length === 0 ? 'provnotes prov' + d.provenance + ' seq' + i : 'provnotes prov' + d.provenance + ' seq' + indexesOfView[i])
          .attr('id', (d, j) => 'n' + i + '_' + j)
          .attr('stroke-width', 0.8)
          .attr('stroke', 'black')
          .attr('height', barHeight)
          .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep)))
          .attr('rx', 4)
          .attr('ry', 4) // previous 6
          .call(drag(ai[i], i))
          .on('mouseover', function (d, i) {
            svg.style('cursor', 'move')
            const t1 = 'pitch: ' + getLab(i.pitch).label ?? i.pitch
            const t2 = 'steps: ' + i.quantizedStartStep + ' to ' + i.quantizedEndStep

            const t1span = tt
              .select('#t1').text(t1)
              // .attr("x", (d.offsetX-15))
            const t2span = tt
              .select('#t2').text(t2)
              // .attr("x", (d.offsetX-15))
            tt.style('opacity', 1)

            let rec = text.getBBox()

            tt.attr('x', (d.offsetX - rec.width / 2))
              .attr('y', (d.offsetY - rec.height - 10))

            t1span.attr('x', (d.offsetX - rec.width / 2) + 5)
            t2span.attr('x', (d.offsetX - rec.width / 2) + 5)

            rec = text.getBBox()

            d3.select('#br').attr('x', rec.x - 5).attr('y', rec.y - 5)
              .attr('width', rec.width + 10).attr('height', rec.height + 10)
              .style('opacity', 1)

            group.raise()
            tt.raise()

          // console.log(document.getElementById("#tooltip").offsetHeight);
          })
          .on('mouseout', function (d, i) {
            svg.style('cursor', 'default')
            tt.style('opacity', 0)
            d3.select('#br').style('opacity', 0)
            tt.attr('x', 0).attr('y', 0)
            d3.select('#br').attr('x', 0).attr('y', 0)
          })
          .attr('x', d => x(d.quantizedStartStep))
          .attr('y', d => y(getLab(d.pitch).label))
          .attr('fill', d => grad(provenanceVis ? provCol(d.provenance) : color[i], opacit(d.pitch, ai1), i, d.pitch, d))// return "URL(#Grad"+i+d.pitch+")";})
      }

      d3.select('*').on('keyup', function (event) {
        copy(0, 0, event, false)
      })

      // auto adjust brush to %4 steps
      function getNearestBeat (i) {
        let result
        // i>lastnotai?i=lastnotai:result=i;
        if (i % 4 < 2) {
          result = i - (i % 4)
        } else {
          result = i + (4 - (i % 4))
        }
        return result
      }

      function getNearestPitch (i) {
        let result
        // i>lastnotai?i=lastnotai:result=i;
        if (i % 1 < 0.5) {
          result = Math.floor(i)
        } else {
          result = Math.ceil(i)
        }
        return result
      }

      /**
    // switch auto updates
    function changeAutoUpdate () {
      if (autoUpdate) {
        document.getElementById('autoupdate').innerText = 'autoUpdates off'
        autoUpdate = false
      } else {
        document.getElementById('autoupdate').innerText = 'autoUpdates on'
        autoUpdate = true
        callback(data)
      }
    }

    function changeprovenance () {
      if (provenanceVis) {
        document.getElementById('provenanceVis').innerText = 'provenanceRepresentationDisabled'
        provenanceVis = false
      } else {
        document.getElementById('provenanceVis').innerText = 'provenanceRepresentationEnabled'
        provenanceVis = true
      }
      that.render()
    }

    // tooltip auto updates
    function tooltip (id, num) {
      if (num === 1) {
        document.getElementById(id).classList.toggle('showlong')
        document.getElementById(id).innerHTML = 'Toggle autoupdates for adjusting notes in the piano roll. <br/> Switching to updates on, syncs current data to other visualizations. <br/>' +
            'Autoupdate only refers to updating the other visualizations on every change and can result in lag'
      } else {
        document.getElementById(id).classList.toggle('showlong')
        document.getElementById(id).innerHTML = 'Show which parts has which provenance level <br/> 4 = only human = green <br/> 3 = human->Ai adjusted = turquois' +
            '<br/> 2 = both adjusted multiple times = red <br/> 1 = AI -> human adjusted = orange <br/> 0 = only AI = blue'
      }
    }
    */
      // svg.selectAll("rect").call(d3.drag().on("end", () => {console.log("drop"); callback(data1,data2,data3);}));
      try {
        return (
          <div className='viewDiv' id='divsvg' width={window.innerWidth} style={{ overflow: 'hidden', overflowX: 'scroll' }}>
            <svg id='chartSvg' />
            {/*
        <svg id='provonenceLegend' height='0' width={window.innerWidth - margin.left - margin.right} />
        */}
            <input type='hidden' height='0' id='brushed' name='brushed' value={brushactive} />
            {/**
            <div></div>
            <button className="button" id="autoupdate"onClick={changeAutoUpdate} onMouseEnter={(e)=>{tooltip("infoPiano",1)}} onMouseLeave={(e)=>{tooltip("infoPiano",1)}}>autoUpdates on</button>
             *

            <FormControlLabel  onMouseEnter={(e)=>{tooltip("infoPiano",1)}} onMouseLeave={(e)=>{tooltip("infoPiano",1)}} control={<Switch defaultChecked onClick={()=>{autoUpdate=!autoUpdate;that.render()}}/>} label="Auto Update" labelPlacement="bottom"/>
            */}{/**
            <button className="button" id="provenanceVis" onClick={changeprovenance} onMouseEnter={(e)=>{tooltip("infoPiano",2)}} onMouseLeave={(e)=>{tooltip("infoPiano",2)}}>provenanceRepresentationDisabled</button>

            <FormControlLabel onMouseEnter={(e)=>{tooltip("infoPiano",2)}} onMouseLeave={(e)=>{tooltip("infoPiano",2)}} control={<Switch onClick={()=>{provenanceVis=!provenanceVis;that.render()}}/>} label="Provenance" labelPlacement="bottom"/>
            */}
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
export default PianoChart
