import React from 'react'
import * as d3 from 'd3'
import * as d3s from 'd3-sankey'
import * as mm from '@magenta/music'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import Switch from '@mui/material/Switch'
import { MenuItem, Tooltip, Typography } from '@mui/material'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
// import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'

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

let mode = 'samePitchRangePerLayer'
// line not working but not as good
const modeRect = 'Rolls'

const metric = 0

let scale = 1

const margin = { top: 20, right: 15, bottom: 20, left: 20 }

let loaded = false

let once = false

let overallAxis = { pmin: 128, pmax: 0, lmax: 0, lmin: 0 }

// for noteselection to play
let brushrange = [0, 0]
let brushactive = false
// for notes[index element out of currentindizes]
let currentIndizes = []
let normalIndex = []

let player

const modelUsedFlag = true// this.props.modelUsedFlag

let toggleState = 1

let sankeyExist = false

let previousIndex = 0

let sorted = false

class IcicleRolls extends React.Component {
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
      const widthdiv = this.props.width - margin.right
      const heightdiv = this.props.height * 3 / 4 - margin.top

      const heightBox = this.props.height + margin.bottom // -margin.top;

      const width = (this.props.width) * scale - margin.left - margin.right
      const height = (this.props.height * 3 / 4) * scale - margin.top - margin.bottom
      const heightSmall = (this.props.height * (1 / 4)) - margin.top - margin.bottom
      const widthSmall = (this.props.width) - margin.left - margin.right

      const parent1 = this.props.data.parent
      const darkmode = this.props.darkmode
      // const data1 = this.props.data
      const notes1 = this.props.data.notes
      const ai1 = this.props.data.ai
      const temp1 = this.props.data.temp
      const color1 = this.props.data.color
      const lastnotai1 = this.props.data.lastnotai
      const fill1 = this.props.data.fill
      const callback = this.props.callback
      const getBPM = this.props.getBPM
      const that = this
      const modelUsed = this.props.data.modelUsed

      const closeView = this.props.closeView

      const display = this.props.display

      let parent = parent1
      let notes = notes1
      let temp = temp1
      let color = color1
      const lastnotai = lastnotai1
      const fill = fill1
      toggleState = parseInt(this.props.toggleState)

      if (!sorted) { sankeyExist = false }
      sorted = false

      const modelColors3 = j => d3.schemeTableau10[j % 10]// 4+(2*modelUsed[j-1])+modelUsed[j-1]%2];

      /**
    const noteColormap = [
      '#ff0000',
      '#ff7f7f',
      '#db7b00',
      '#ffbf6d',
      '#e4ed00',
      '#81d700',
      '#c3ff6b',
      '#00ffea',
      '#7ffff4',
      '#3c00ff',
      '#9d7fff',
      '#ff00fd'
    ]
     */
      const text = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B'
      ]
      const colorscheme = (val) => d3.schemeTableau10[val]// noteColormap[val];
      const getText = (val) => text[val]

      function getLab (i) {
        const note = MIDI_NOTES.filter(obj => obj.pitch === i)
        return note[0]
      }

      /**
    function getLabName (i) {
      if (i === ' ') { return { pitch: 12 } }
      if (i === '#') { return { pitch: 13 } }
      const note = MIDI_NOTES.filter(obj => obj.name === i)
      return note[0]
    }
     */

      // pitch ticks with or without C for axis
      function getPitches (withoutC, ax) {
        const pitche = []
        let a = 0
        for (let i = ax.pmin; i < ax.pmax + 1; i++) {
          const bla = getLab(i).name
          const wc = withoutC ? false : bla.includes('C')
          if ((!(bla.includes('#')) && wc) || withoutC) {
            pitche[a] = getLab(i).pitch
            a++
          }
        }
        return pitche
      }

      window.onload = function () {
        loaded = true
      }

      if (loaded && notes1.length < 50 && display) {
        if (!once) {
          d3.select('#icicle').on('wheel', (e) => resizeByWheel(e), { passive: false })
        }
        once = true

        function dataLength (data) {
          let result = 0
          if (data !== undefined && data.length !== 0) {
            data.forEach(obj => {
              if (obj.quantizedEndStep > result) {
                result = obj.quantizedEndStep
              }
            })
          }
          return result
        }

        function dataStart (data) {
          let result = data[0].quantizedStartStep
          if (data.length !== 0) {
            data.forEach(obj => {
              if (obj.quantizedStartStep < result) {
                result = obj.quantizedStartStep
              }
            })
          }
          return result
        }

        function transformRec (rec, steps) {
          let recNew = []
          let min = dataLength(rec)
          let max = 0
          rec.forEach((note) => {
            if (note.quantizedStartStep < min) { min = note.quantizedStartStep }
            if (note.quantizedEndStep > max) { max = note.quantizedEndStep }
          })
          if (max > steps) {
            rec.forEach((note) => {
              if (note.quantizedEndStep <= max && note.quantizedStartStep >= (max - steps)) {
                recNew.push({
                  pitch: note.pitch,
                  quantizedStartStep: note.quantizedStartStep - (max - steps),
                  quantizedEndStep: note.quantizedEndStep - (max - steps)
                })
              }
            })
          } else {
            recNew = rec
          }
          return recNew
        }

        function getLabel (val) {
          const note = MIDI_NOTES.find(obj => {
            return obj.pitch === val
          })
          if (note !== undefined) { return note.label }
          return ''
        }

        function getVal (mode, axis) {
          const result = []
          if (mode === 'x') {
            for (let i = axis.lmin; i <= axis.lmax; i++) {
              if (i % 4 === 0 && i % 16 !== 0) { result.push(i) }
            }
          } else if (mode === 'xc') {
            for (let i = axis.lmin; i <= axis.lmax; i++) {
              if (i % 16 === 0) { result.push(i) }
            }
          } else if (mode === 'y') {
            for (let t = axis.pmin; t <= axis.pmax; t++) {
              if (t % 12 === 0 || t % 12 === 2 || t % 12 === 4 || t % 12 === 5 || t % 12 === 7 || t % 12 === 9 || t % 12 === 11) { result.push(t) }
            }
          }
          return result
        }

        function cofpitch (pitch) {
          let p = pitch % 12
          if (p === 0 || p === 1) { p = 0 } else if (p === 2 || p === 3) { p = 1 } else if (p === 4) { p = 3 } else if (p === 5 || p === 6) { p = 4 } else if (p === 7 || p === 8) { p = 5 } else if (p === 9 || p === 10) { p = 6 } else { p = 7 }
          return colorscheme(p)
        }

        function isSharp (num) {
          if (num % 12 === 1 || num % 12 === 3 || num % 12 === 6 || num % 12 === 8 || num % 12 === 10) {
            return true
          } else {
            return false
          }
        }

        /**
      function opofpitch (pitch) {
        const p = pitch % 12
        if (p === 1 || p === 3 || p === 6 || p === 8 || p === 10) { return 0.6 } else { return 0.8 }
      }
      */

        function grad (c, id, pitch, svg) {
          return c

          /**
        // if opacity
        const hexToRgb = hex =>
          hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

        const rgb = hexToRgb(c)
        const rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + 0.8 + ')'
        return rgba
        */
          // else
          // return c
        /*
            svg.select("#GradIce"+id+"_"+pitch).remove();
            svg.select("#GradIce"+pitch+"1000").remove();
            //gradient for opacity but didnt work with color so opacity in x dir and color in y dir
            const linearGradient = svg.append("linearGradient").attr("id","GradIce"+id+"_"+pitch);
            linearGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color",c)
                    .attr("stop-opacity", opofpitch(pitch));
                linearGradient.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color",c)
                    .attr("stop-opacity", opofpitch(pitch));
                linearGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color",c)
                    .attr("stop-opacity", 0.1);

            const linearGradient1 = svg.append("linearGradient").attr("id","GradIce"+pitch+"1000");
            linearGradient1.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);//opofpitch(pitch));

            linearGradient1.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);//opofpitch(pitch));
            linearGradient1.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 0.1);
            /*
            var p = pitch%12;
            if(p===1||p===3||p===6||p===8||p===10){
              const linearGradient2 = svg.append("linearGradient").attr("id","GradIce"+pitch+"1000");
              linearGradient2.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);
              linearGradient2.append("stop")
                    .attr("offset", "15%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);
              linearGradient2.append("stop")
                    .attr("offset", "25%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 0);
              linearGradient2.append("stop")
                    .attr("offset", "35%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);
              linearGradient2.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);
              linearGradient2.append("stop")
                    .attr("offset", "60%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 0);
              linearGradient2.append("stop")
                    .attr("offset", "70%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 1);
              linearGradient2.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color",cofpitch(pitch))
                    .attr("stop-opacity", 0.1);

            }
            */
        }

        function transformToStart (notes) {
          const temp = []
          if (notes.length > 0) {
            let min = notes[0].quantizedStartStep
            notes.forEach((note) => {
              if (min > note.quantizedStartStep) { min = note.quantizedStartStep }
            })
            notes.forEach((note) => {
              temp.push({
                pitch: note.pitch,
                quantizedStartStep: note.quantizedStartStep - min,
                quantizedEndStep: note.quantizedEndStep - min
              })
            })
          }
          return temp
        }

        function PlayShort (notes, i, parents) {
          if (player !== undefined) {
            if (!player.isPlaying()) {
              const bpm = getBPM()

              function showNode (current, i, max, first) {
                const padding = (current.x1 - current.x0) / 40
                if (first) {
                  d3.select('#playback_line_sankey')
                    .raise()
                    .transition()
                    .duration((60000) / (bpm * 4))
                    .attr('transform', `translate(${current.x0 + padding},${current.y0})`)
                    .attr('height', current.y1 - current.y0)
                    .on('end', () => { play(current, i, max, first, padding) })
                } else {
                  d3.select('#playback_line_sankey')
                    .raise()
                    .attr('transform', `translate(${current.x0 + padding},${current.y0})`)
                    .attr('height', current.y1 - current.y0)

                  play(current, i, max, first, padding)
                }

                function play (current, i, max, first, padding) {
                  d3.select('#playback_line_sankey').transition().ease(d3.easeLinear)
                    .duration((60000) / (bpm * 4) * (max))
                    .attr('transform', `translate(${current.x1 - padding},${current.y0})`)
                    .on('start', () => {
                      d3.select('#playback_line_sankey').attr('opacity', 1)
                    }
                    )
                    .on('end', () => {
                      d3.select('#playback_line_sankey').attr('opacity', 0)
                      const old = i
                      i--
                      if (i < 0) {
                        parents.forEach((node) => {
                          d3.select('#Node' + node.idr)
                            .attr('stroke-width', 1)
                            .attr('stroke', 'grey')
                        })
                        return
                      }
                      const diff = dataStart(parents[i].notes) - dataLength(parents[old].notes)
                      setTimeout(() =>
                        showNode(parents[i], i, dataLength(transformToStart(parents[i].notes)), false),
                      (bpm * 1000) / (60 * 16) * (diff))
                    })
                }
              }

              parents.forEach((node) => {
                d3.select('#Node' + node.idr)
                  .attr('stroke-width', 2)
                  .attr('stroke', 'steelblue')
              })

              const seq = mm.sequences.createQuantizedNoteSequence(4)
              seq.notes = transformToStart(notes)
              player.loadSamples(seq).then(() => {
                player.start(seq, bpm)
                const j = parents.length - 1
                showNode(parents[j], j, dataLength(transformToStart(parents[j].notes)), true)
              })
            } else {
              player.stop()
              d3.select('#playback_line_sankey').attr('opacity', 0)
            }
          } else {
            player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander')
            PlayShort(notes, i, parents)
          }
        }

        function setMeloShort (j, l, newfill) {
        // first calc all parents then set but look for children to keep
          const tt = {
            notes: [],
            ai: [],
            color: [],
            temp: [],
            parent: [],
            lastnotai: 0,
            fill: []
          }

          let temporal = notes[j]
          let current = j
          while (parent[current] !== current) {
            temporal = temporal.concat(notes1[parent[current]])
            current = parent[current]
          }

          if (parent[current] === current && current !== 0) {
            temporal = temporal.concat(notes1[0])
          }

          tt.notes.push(temporal)
          tt.ai.push(false)
          tt.color.push(color1[0])
          tt.parent.push(0)
          tt.fill.push(true)
          tt.lastnotai = dataLength(temporal)
          tt.temp.push(-1)

          if (!fill1[normalIndex[j]]) {
            for (let k = 1; k < parent1.length; k++) {
              if (fill1[k]) {
                tt.notes.push(notes1[k])
                tt.ai.push(ai1[k])
                tt.color.push(color1[k])
                tt.temp.push(temp1[k])
                tt.parent.push(0)
                tt.fill.push(fill1[k])
              }
            }
          }

          const r = getAllChildren(j)

          const queue = r[0]
          const par = r[1]

          let count = 0
          queue.forEach((i) => {
            tt.notes.push(notes1[i])
            tt.ai.push(ai1[i])
            tt.color.push(color1[i])
            tt.parent.push(par[count])
            tt.fill.push(fill1[i])
            tt.temp.push(temp1[i])
            count++
          })

          currentIndizes = []

          callback(tt, !newfill[j])
        }

        function Play (currentIndizes, shortcut, index, xScale, yDomain) {
          if (player !== undefined) {
            if (currentIndizes.length > 0) {
              if (!player.isPlaying()) {
                const bpm = getBPM()
                let temp = []
                let datalength = 0
                notes1.forEach((seq) => {
                  const result = dataLength(seq)
                  if (datalength < result) { datalength = result }
                })
                let datamin = datalength
                let datamax = 0

                console.log(currentIndizes)

                currentIndizes.forEach((i) => {
                  if (shortcut) {
                    const temp1 = notes1[normalIndex[i]]
                    temp1.forEach((note) => {
                      if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
                      if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
                    })
                    temp1.forEach((note) => {
                      const tempnote = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 0 }
                      tempnote.pitch = note.pitch
                      tempnote.quantizedStartStep = note.quantizedStartStep - datamin
                      tempnote.quantizedEndStep = note.quantizedEndStep - datamin
                      temp = temp.concat(tempnote)
                    })
                  /* notes1[normalIndex[i]].forEach((note) => {
                    if (note.quantizedStartStep >= brushrange[0] && note.quantizedEndStep <= brushrange[1]) {
                      const tempnote = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 0 }
                      tempnote.pitch = note.pitch
                      tempnote.quantizedStartStep = note.quantizedStartStep - brushrange[0]
                      tempnote.quantizedEndStep = note.quantizedEndStep - brushrange[0]
                      temp = temp.concat(tempnote)
                      if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
                      if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
                    }
                  })
                  */
                  } else if (brushactive) {
                    notes1[normalIndex[i]].forEach((note) => {
                      if (note.quantizedStartStep >= brushrange[0] && note.quantizedEndStep <= brushrange[1]) {
                        const tempnote = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 0 }
                        tempnote.pitch = note.pitch
                        tempnote.quantizedStartStep = note.quantizedStartStep - brushrange[0]
                        tempnote.quantizedEndStep = note.quantizedEndStep - brushrange[0]
                        temp = temp.concat(tempnote)
                        if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
                        if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
                      }
                    })
                  } else {
                    temp = temp.concat(notes1[normalIndex[i]])
                    notes1[normalIndex[i]].forEach((note) => {
                      if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
                      if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
                    })
                  }
                })

                if (brushactive) {
                  datamin = brushrange[0]
                  datamax = brushrange[1]
                }

                const x = shortcut
                  ? xScale
                  : d3.scaleLinear()
                    .domain([0, datalength])
                    .range([margin.left, width - margin.right])

                const seq = mm.sequences.createQuantizedNoteSequence(4)
                seq.notes = temp
                player.loadSamples(seq).then(() => {
                  player.start(seq, bpm)
                  if (!shortcut) {
                    d3.select('#playback_line_ice')
                      .transition().duration(0) // (60000) / (bpm * 4))
                      .attr('transform', `translate(${x(datamin) - margin.left},0)`)
                      .on('end', () => {
                        d3.select('#playback_line_ice')
                          .transition().ease(d3.easeLinear).duration((60000) / (bpm * 4) * (datamax - datamin))
                          .attr('transform', `translate(${x(datamax) - margin.left},0)`)
                          .on('start', (d, f, g) => { d3.select('#' + g[0].id).attr('opacity', 1) })
                          .on('end', (d, f, g) => { d3.select('#' + g[0].id).attr('opacity', 0) })
                      })
                  } else {
                    d3.select('#roll' + index).append('rect')
                      .attr('id', 'playback_line_roll' + index)
                      .attr('height', yDomain[1])
                      .attr('width', 4)
                      .attr('y', yDomain[0])
                      .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
                      .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
                      .attr('opacity', 0)
                      .transition().duration(0) // (60000) / (bpm * 4))
                      .attr('transform', `translate(${x(datamin)},0)`)
                      .on('end', () => {
                        previousIndex = index
                        d3.select('#playback_line_roll' + index)
                          .transition().ease(d3.easeLinear).duration((60000) / (bpm * 4) * (datamax - datamin))
                          .attr('transform', `translate(${x(datamax)},0)`)
                          .on('start', (d, f, g) => { d3.select('#' + g[0].id).attr('opacity', 1) })
                          .on('end', (d, f, g) => { d3.select('#' + g[0].id).attr('opacity', 0) })
                      })
                  }
                })
              } else {
                player.stop()
                d3.select('#playback_line_ice').attr('opacity', 0)
                d3.select('#playback_line_roll' + index).remove()
                if (shortcut && previousIndex !== index) {
                  player.stop()
                  d3.select('#playback_line_roll' + previousIndex).remove()
                  Play(currentIndizes, shortcut, index, xScale, yDomain)
                }
              }
            }
          } else {
            player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander')
            Play(currentIndizes, shortcut, index, xScale, yDomain)
          }
        }

        function getAllChildren (index) {
          const q = [index]
          const result = []
          const indizes = []
          let count = 0
          while (q.length > 0) {
            const current = q.shift()
            for (let i = 0; i < notes1.length; i++) {
              if (parent[i] === current) {
                if (current !== i) { q.push(i) }
                result.push(i)
                indizes.push(count)
              }
            }
            count++
          }
          return [result, indizes]
        }

        function SetMelo () {
        // get all infos of given indices and make new state object
        // and make callback to app and set state.
        // store current infos in an element in this file and still
        // show old if only one seq in new notes;
        // make undo button to push the old data/element to state via
        // callback same as set

          // look to keep children as well?
          const tt = {
            notes: [],
            ai: [],
            color: [],
            temp: [],
            parent: [],
            lastnotai: 0,
            fill: [],
            modelUsed: []
          }

          let temporal = []
          currentIndizes.forEach((i) => {
            temporal = temporal.concat(notes1[normalIndex[i]])
          })

          tt.notes.push(temporal)
          tt.ai.push(false)
          tt.color.push(color1[0])
          tt.parent.push(0)
          tt.fill.push(true)
          tt.lastnotai = dataLength(temporal)
          tt.temp.push(-1)
          tt.modelUsed.push(-1)

          if (!fill1[normalIndex[currentIndizes[0]]]) {
            for (let k = 1; k < parent1.length; k++) {
              if (fill1[k]) {
                tt.notes.push(notes1[k])
                tt.ai.push(ai1[k])
                tt.color.push(color1[k])
                tt.temp.push(temp1[k])
                tt.parent.push(0)
                tt.fill.push(fill1[k])
                tt.modelUsed.push(modelUsed[k])
              }
            }
          }

          if (fill1[normalIndex[currentIndizes[0]]]) {
            for (let k = 1; k < parent1.length; k++) {
              if (!fill1[k]) {
                tt.notes.push(notes1[k])
                tt.ai.push(ai1[k])
                tt.color.push(color1[k])
                tt.temp.push(temp1[k])
                tt.parent.push(parent1[k])
                tt.fill.push(fill1[k])
                tt.modelUsed.push(modelUsed[k])
              }
            }
          }

          const r = getAllChildren(currentIndizes[0])

          const queue = r[0]
          const par = r[1]

          let count = 0
          queue.forEach((i) => {
            tt.notes.push(notes1[i])
            tt.ai.push(ai1[i])
            tt.color.push(color1[i])
            tt.parent.push(par[count])
            tt.fill.push(fill1[i])
            tt.temp.push(temp1[i])
            tt.modelUsed.push(modelUsed[i])
            count++
          })

          currentIndizes = []

          callback(tt, false)
        }

        function showButtons () {
          const g = d3.select('#selectOfIce').append('g').attr('id', 'buttons')

          g.append('rect')
            .attr('id', 'buttons')
            .attr('class', 'button pointer')
            .attr('x', widthSmall * 3 / 4)
            .attr('y', heightSmall - margin.bottom - margin.top)
            .attr('width', 50)
            .attr('height', margin.top)
            .attr('fill', 'grey')
            .on('mouseup', () => Play(currentIndizes, false, 0, 0, 0))

          g.append('text').text('Play').attr('class', 'pointer').attr('fill', 'black').attr('id', 'playbuttonicicle')
            .attr('x', widthSmall * 3 / 4 + 10)
            .attr('y', heightSmall - margin.bottom - (margin.top / 4))
            .on('mouseup', () => Play(currentIndizes, false, 0, 0, 0))

          g.append('rect')
            .attr('id', 'buttons')
            .attr('class', 'button pointer')
            .attr('x', widthSmall / 4)
            .attr('y', heightSmall - margin.bottom - margin.top)
            .attr('width', 50)
            .attr('height', margin.top)
            .attr('fill', 'grey')
            .on('mouseup', SetMelo)

          g.append('text').text('Add').attr('class', 'pointer').attr('fill', 'black')
            .attr('x', widthSmall / 4 + 3)
            .attr('y', heightSmall - margin.bottom - (margin.top / 4))
            .on('mouseup', SetMelo)
        }

        function deleteButtons () {
          d3.select('#buttons').remove()
        }

        function tickDependOnSize (tick, space, axis) {
          if ((axis.pmax - tick < 2 || axis.pmin - tick > -2) && space < 10) { return false }
          if (space < 5) {
            return tick % 12 === 0
          } else if (space < 10) {
            return tick % 12 === 0 || tick % 12 === 5
          } else if (space < 20) {
            return tick % 12 === 0 || tick % 12 === 5 || tick % 12 === 9
          } else {
            return tick % 12 === 0 || tick % 12 === 2 || tick % 12 === 4 || tick % 12 === 5 || tick % 12 === 7 || tick % 12 === 9 || tick % 12 === 11
          }
        }

        function createRollForSelect (indizes) {
          d3.select('#selectOfIce').selectAll('*').remove()
          const svg = d3.select('#selectOfIce')
            .attr('width', widthSmall).attr('height', heightSmall)
            .on('contextmenu', (e, d) => {
              e.preventDefault()
              if (e.button === 2) {
                Play(indizes, false, 0, 0, 0)
              }
            })

          svg.append('rect').attr('id', 'rectForHover').attr('height', heightSmall)
            .attr('width', widthSmall)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('fill', darkmode === 'LightMode' ? 'white' : '#333')

          currentIndizes = indizes

          const tmargin = margin// {top: 20, right: 5, bottom: 11, left: 25};

          const axis = overallAxis

          // let padding = 0
          let noteheight = 0

          if (indizes.length > 0) {
          // padding = ((heightSmall - tmargin.top - tmargin.bottom) / (axis.pmax - axis.pmin)) / 5
            noteheight = ((heightSmall - tmargin.top - tmargin.bottom) / (axis.pmax - axis.pmin))// -padding
          }

          const x = d3.scaleLinear()
            .domain([axis.lmin, axis.lmax])
            .range([tmargin.left, widthSmall - tmargin.right])

          const y = d3.scaleLinear()
            .domain([axis.pmax + 0.5, axis.pmin - 0.5])
            .rangeRound([tmargin.top, heightSmall - tmargin.bottom])

          const xticks = []
          for (let t = axis.lmin; t <= axis.lmax; t++) {
            if (t % 16 === 0) {
              xticks.push(t)
            }
          }

          function xAxis (g) {
            g
              .attr('transform', `translate(${0},${0 + tmargin.top})`)
              .call(d3.axisTop(x).tickValues(xticks).tickFormat(t => t / 16))
          }

          function yAxis (g) {
            g
              .attr('transform', `translate(${0 + tmargin.left},${0})`)
            // .style('font', Math.max(Math.min(noteheight, 19), 10) + 'px times')
              .call(d3.axisLeft(y).ticks((axis.pmax - axis.pmin)).tickFormat((t) => {
                if (tickDependOnSize(t, noteheight, axis)) { // (t%12===0||t%12===5)&&t!==axis.pmin&&t!==axis.pmax){//t%12===0||t%12===4||t%12===4||t%12===7||t%12===9){
                  return getLabel(t)
                }
              }).tickSize(0))
          }

          svg.append('g').call(xAxis)
          svg.append('g').call(yAxis)

          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(${0},${0 + tmargin.top})`)
            .call(d3.axisTop(x).tickSize(-heightSmall + tmargin.bottom + tmargin.top).tickFormat('')
              .tickValues(getVal('x', axis)))

          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(${0},${0 + tmargin.top})`)
            .attr('stroke-width', 2)
            .call(d3.axisTop(x).tickSize(-heightSmall + tmargin.bottom + tmargin.top)
              .tickFormat('').tickValues(getVal('xc', axis)))

          const pitches = getPitches(true, axis)
          const pitchesWc = getPitches(false, axis)

          const ef = []
          // rectangles for pattern
          svg.append('g')
            .selectAll('rect')
            .style('opacity', '0.25')
            .attr('class', 'y axis-grid')
            .attr('transform', `translate(${tmargin.left},0)`)
            .data(pitches)
            .enter()
            .append('rect')
            .attr('stroke-width', 0.8)
          // .attr("stroke-opacity",0.4)
          // .attr("stroke","black")
            .attr('transform', `translate(0,${-(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
            .attr('height', y(axis.pmin) - y(axis.pmin + 1))
            .attr('width', d => widthSmall - tmargin.left - tmargin.right)
            .attr('x', d => { if (d % 12 === 5) { ef.push(d) }; return tmargin.left })
            .attr('y', d => y(d))
            .attr('opacity', d => isSharp(d) ? 0.2 : 0.1)
            .attr('fill', d => 'grey')

          // line between e and f
          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'y axis-grid-C')
            .attr('transform', `translate(${tmargin.left},0)`)
            .attr('stroke', 'blue')
            .attr('fill', 'blue')
            .call(d3.axisLeft(y).tickSize(-widthSmall + tmargin.left + tmargin.right)
              .tickFormat('').tickValues(ef))
            .selectAll('line')
            .attr('transform', `translate(0,${(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
            .attr('opacity', 0.4)
            .attr('stroke-width', 1)
          /*
            svg.append('g')
            .style("opacity","0.25")
            .attr('class', 'y axis-grid')
            .attr('transform', `translate(${0+tmargin.left},${0})`)
            .call(d3.axisLeft(y).tickSize(-width + tmargin.left + tmargin.right)
                  .tickFormat("").tickValues(pitchesWoc));
            */
          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'y axis-grid-C')
            .attr('transform', `translate(${0 + tmargin.left},${0})`)
            .attr('stroke', 'blue')
            .attr('fill', 'blue')
            .call(d3.axisLeft(y).tickSize(-widthSmall + tmargin.left + tmargin.right)
              .tickFormat('').tickValues(pitchesWc))
            .selectAll('line')
            .attr('transform', `translate(0,${(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
          // .attr("stroke","blue")
            .attr('stroke-width', 2)

          svg.append('rect')
            .attr('id', 'playback_line_ice')
            .attr('height', heightSmall - margin.top - margin.bottom)
            .attr('width', 4)
            .attr('x', x(0))
            .attr('y', tmargin.top)
            .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
            .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
            .attr('opacity', 0)
          /*
            svg.append('g')
            .style("opacity","0.25")
            .attr('class', 'y axis-grid')
            .attr('transform', `translate(${0+tmargin.left},${0})`)
            .call(d3.axisLeft(y).tickSize(-width + tmargin.left + tmargin.right).tickFormat("").ticks(axis.pmax-axis.pmin))
            */

          for (let j = 0; j < indizes.length; j++) {
            const i = normalIndex[indizes[j]]
            const col = color[indizes[j]]
            svg.append('g')
              .selectAll('rect')
              .data(notes1[i])
              .enter()
              .append('rect')
              .attr('rx', 4)
              .attr('ry', 4) // previous 6
              .attr('transform', `translate(${0},${0})`) // (y(axis.pmin) - y(axis.pmin + 1)) / 2
              .attr('stroke-width', 0.9)
              .attr('stroke', col === 'black' ? 'red' : 'black')
              .attr('height', noteheight)
              .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep)))
              .attr('x', d => x(d.quantizedStartStep))
              .attr('y', d => y(d.pitch + 0.5))// +0.5)+padding/2)
              .attr('fill', d => grad(col, indizes[j], d.pitch, svg)) // return "URL(#GradIce"+indizes[j]+"_"+d.pitch+")"})
              .attr('opacity', 0.7)
          }

          function getNearestBeat (i) {
            let result
            result = i
            if (i % 4 < 2) {
              result = i - (i % 4)
            } else {
              result = i + (4 - (i % 4))
            }
            return result
          }

          function changeBrush (e) {
            if (e !== undefined && e.sourceEvent !== undefined) {
              const extent = e.selection
              if (extent !== null) {
                const brushmin = getNearestBeat(x.invert(extent[0]))
                const brushmax = getNearestBeat(x.invert(extent[1]))
                d3.select('#brushIce').transition().call(e.target.move, [x(brushmin), x(brushmax)])
                brushrange = [brushmin, brushmax]
                brushactive = true
              } else {
                d3.select('#brushIce').transition().call(e.target.clear)
                brushactive = false
              }
            }
          }

          d3.select('#selectOfIce')
            .on('mouseenter', showButtons)
            .on('mouseleave', deleteButtons)

          svg.append('g').attr('id', 'brushIce').call(
            d3.brushX()
              .extent([[margin.left, 0], [width - margin.right, margin.top]])// margin.top to heightSmall-margin.bottom
              .on('end', (e) => changeBrush(e))
          )
        }

        function pitchDiff (rec) {
          const recNew = []
          let prev = 0
          rec.forEach((note) => {
            prev !== 0
              ? recNew.push({
                  pitch: note.pitch - prev.pitch,
                  quantizedStartStep: note.quantizedStartStep,
                  quantizedEndStep: note.quantizedEndStep
                })
              : recNew.push({
                pitch: note.pitch,
                quantizedStartStep: note.quantizedStartStep,
                quantizedEndStep: note.quantizedEndStep
              })
            prev = note
          })
          return recNew
        }

        function distanceFunction (recOld1, recOld2, timeBinSize) {
          const rnnSteps = 32
          const rec1 = pitchDiff(transformRec(recOld1, rnnSteps))
          const rec2 = pitchDiff(transformRec(recOld2, rnnSteps))
          let totalrhy = 0
          let totalmel = 0
          let rhythm = 0
          let melody = 0
          const maxStep = Math.max(dataLength(rec1), dataLength(rec2))
          for (let i = 0; i < maxStep; i = i + timeBinSize) {
            const rec1Temp = []
            const rec2Temp = []
            rec1.forEach((note) => {
              if (note.quantizedStartStep <= i && i < note.quantizedEndStep) {
                rec1Temp.push(note)
              }
            })
            rec2.forEach((note) => {
              if (note.quantizedStartStep <= i && i < note.quantizedEndStep) {
                rec2Temp.push(note)
              }
            })
            let rhythmNew = 0
            let once = false
            let note1
            let note2
            if (rec1Temp.length >= rec2Temp.length) {
              for (let j = 0; j < rec1Temp.length; j++) {
                once = false
                for (let k = 0; k < rec2Temp.length; k++) {
                  if (!once) {
                    note1 = rec1Temp[j].quantizedEndStep - rec1Temp[j].quantizedStartStep
                    note2 = rec2Temp[k].quantizedEndStep - rec2Temp[k].quantizedStartStep
                    if (note1 === note2) {
                      rhythmNew++
                      once = true
                    }
                  }
                }
              }
              if (rec1Temp.length !== 0) {
                rhythm += rhythmNew / rec1Temp.length
              }
              if (rec1Temp.length !== 0) {
                totalrhy++
              }
            } else {
              for (let j = 0; j < rec2Temp.length; j++) {
                once = false
                for (let k = 0; k < rec1Temp.length; k++) {
                  if (!once) {
                    note1 = rec1Temp[k].quantizedEndStep - rec1Temp[k].quantizedStartStep
                    note2 = rec2Temp[j].quantizedEndStep - rec2Temp[j].quantizedStartStep
                    if (note1 === note2) {
                      rhythmNew++
                      once = true
                    }
                  }
                }
              }
              if (rec2Temp.length !== 0) {
                rhythm += rhythmNew / rec2Temp.length
              }
              if (rec2Temp.length !== 0) {
                totalrhy++
              }
            }

            const maxLength = Math.max(rec1Temp.length, rec2Temp.length)

            let melodyNew = 0
            for (let j = 0; j < rec1Temp.length; j++) {
              for (let k = 0; k < rec2Temp.length; k++) {
                if (rec1Temp[j].pitch === rec2Temp[k].pitch) {
                  melodyNew++
                }
              }
            }
            if (maxLength !== 0) {
              melody += melodyNew / maxLength
            }
            if (rec1Temp.length > 0 || rec2Temp.length > 0) { totalmel++ }
          }

          rhythm = rhythm / totalrhy
          melody = melody / totalmel
          const weightDist = 0.5
          return (rhythm * (1 - weightDist) + melody * weightDist)
        }

        function calcVariance (notesi) {
        /* var arrayforVariance = [];
            notesi.forEach((note)=>{
              arrayforVariance.push(note.pitch);
            }) */
          const newnotes = pitchDiff(notesi)
          newnotes[0].pitch = 0
          const variance = d3.variance(newnotes, d => d.pitch)
          return !isNaN(variance) ? variance : 0
        }

        function minTemp (t) {
          let minT = 2
          t.forEach((t1) => {
            if (minT > t1 && t1 >= 0) { minT = t1 }
          })
          return minT
        }

        function chosenMetric (notesi, i, notesj, j, bin, min, max, weight) {
          if (!weight) {
            if (metric === 0) { return distanceFunction(notesi, notesj, bin) + 0.1 } else if (metric === 1) {
              const scaleTempDesc = d3.scaleLinear().domain([minTemp(temp), Math.max(...temp)]) // oder von 0.2 bis 1.8 also maximale einstellung
              return scaleTempDesc(temp[i]) + 0.1
            } else if (metric === 2) { // for test siehe desc comment
              const scaleTempAsc = d3.scaleLinear().domain([1.8, 0.2])// .domain([Math.max(...temp),minTemp(temp)])
              return scaleTempAsc(temp[i]) + 0.1
            } else if (metric === 3) {
              const scaleVarDesc = d3.scaleLinear().domain([min, max])
              return scaleVarDesc(calcVariance(notesi)) + 0.1
            } else if (metric === 4) {
              const scaleVarAsc = d3.scaleLinear().domain([max, min])
              return scaleVarAsc(calcVariance(notesi)) + 0.1
            } else if (metric === 5) {
              const scaleDistAsc = d3.scaleLinear().domain([1, 0])
              return scaleDistAsc(distanceFunction(notesi, notesj, bin)) + 0.1
            } else if (metric === 6) { return -i }
          } else {
            if (metric === 0 || metric === 5) { return distanceFunction(notesi, notesj, bin) + 0.1 } else if (metric === 1 || metric === 2) {
              const scaleTempDesc = d3.scaleLinear().domain([0.2, 1.8])// [minTemp(temp),Math.max(...temp)]) //oder von 0.2 bis 1.8 also maximale einstellung
              return scaleTempDesc(temp[i]) + 0.1
            } else if (metric === 3 || metric === 4) {
              const scaleVarDesc = d3.scaleLinear().domain([min, max])
              return scaleVarDesc(calcVariance(notesi)) + 0.1
            } else if (metric === 6) { return 1 }
          }
        }

        function getParentsNotes (d) {
          let tempnotes = notes[d.idr]
          let current = d.idr
          while (parent[current] !== current) {
            tempnotes = tempnotes.concat(notes[parent[current]])
            current = parent[current]
          }
          if (current !== 0) {
            tempnotes = tempnotes.concat(notes[0])
          }
          return tempnotes
        }

        function getParents (d) {
          let tempnotes = [d]
          let currentNode = d
          let current = d.idr
          while (parent[current] !== current) {
            if (currentNode.targetLinks.length > 0) {
              currentNode = currentNode.targetLinks[0].source
              tempnotes = tempnotes.concat(currentNode)
              current = parent[current]
            }
          }
          while (currentNode.idr !== 0) {
            currentNode = currentNode.targetLinks[0].source
            if (currentNode.idr === 0) {
              tempnotes = tempnotes.concat(currentNode)
            }
          }
          return tempnotes
        }

        function showButtonSankey (d, svg, newfill) {
          const g = svg.append('g').attr('id', 'buttonSankey')

          g.append('rect')
            .attr('id', 'buttonSankey')
            .attr('className', 'button')
            .attr('x', ((d.x1 - d.x0) * 3 / 4) + d.x0)
            .attr('y', d.y0)
            .attr('width', (d.x1 - d.x0) / 4)
            .attr('height', margin.top)
            .attr('fill', 'grey')
            .on('click', () => PlayShort(d.notes, 0, [d]))

          g.append('text').text('Play').attr('fill', 'black').attr('id', 'playbuttonsankey')
            .attr('x', ((d.x1 - d.x0) * 3 / 4) + d.x0 + 10)
            .attr('y', d.y0 + margin.top * 3 / 4)
            .on('click', () => PlayShort(d.notes, 0, [d]))

          g.append('rect')
            .attr('id', 'buttonSankey')
            .attr('className', 'button')
            .attr('x', ((d.x1 - d.x0) * 1 / 3) + d.x0)
            .attr('y', d.y0)
            .attr('width', (d.x1 - d.x0) / 3)
            .attr('height', margin.top)
            .attr('fill', 'grey')
            .on('click', () => PlayShort(getParentsNotes(d), 0, getParents(d)))

          g.append('text').text('PlayPath').attr('fill', 'black')
            .attr('id', 'playbuttonsankey')
            .attr('x', ((d.x1 - d.x0) * 1 / 3) + d.x0 + 2)
            .attr('y', d.y0 + margin.top * 3 / 4)
            .on('click', () => PlayShort(getParentsNotes(d), 0, getParents(d)))

          g.append('rect')
            .attr('id', 'buttonSankey')
            .attr('className', 'button')
            .attr('x', d.x0)
            .attr('y', d.y0)
            .attr('width', (d.x1 - d.x0) / 4)
            .attr('height', margin.top)
            .attr('fill', 'grey')
            .on('mouseup', () => setMeloShort(d.idr, d.id, newfill))

          g.append('text').text('AddPath').attr('fill', 'black')
            .attr('x', d.x0 + 3)
            .attr('y', d.y0 + margin.top * 3 / 4)
            .on('mouseup', () => setMeloShort(d.idr, d.id, newfill))
        }

        function deleteButtonSankey () {
          d3.selectAll('#buttonSankey').transition(500).remove()
        }

        function createSankey (w, h, depth, notes, parent, layer, color, nochilds, newfill) {
        // sankey
          if (!sankeyExist) {
            d3.select('#icicle').selectAll('*').remove()
            d3.select('#icicle').append('rect').attr('height', h)
              .attr('width', w)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', darkmode === 'LightMode' ? 'white' : '#333')
          }

          const dataset = { nodes: [], links: [] }

          const sizeLayer = []

          for (let i = depth - 1; i >= 0; i--) {
            let length = 0
            for (let j = 0; j < notes.length; j++) {
              if (layer[j] === i) { length++ }
            }
            sizeLayer[i] = length
          }

          const valueLayer = []
          for (let i = sizeLayer.length - 1; i >= 0; i--) {
            valueLayer[i] = Math.floor(Math.max(...sizeLayer) / sizeLayer[i])
          }

          let lastfill = 0
          for (let k = 0; k < newfill.length; k++) {
            if (newfill[k] && lastfill < k) { lastfill = k }
          }

          let varianceMin
          let varianceMax
          if (metric === 3 || metric === 4) {
            for (let i = 0; i < notes.length; i++) {
              const val = calcVariance(notes[i])
              if (i === 0) {
                varianceMin = val
                varianceMax = val
              } else {
                if (varianceMin > val) { varianceMin = val }
                if (varianceMax < val) { varianceMax = val }
              }
            }
          }
          for (let i = 0; i < notes.length; i++) {
          // dataset.nodes.push({"id":i,"notes":notes[i]})
            for (let j = 0; j < notes.length; j++) {
              if (i !== j) {
                if (parent[i] === j) { // (depth-layer[j])*
                  dataset.links.push({ source: j, target: i, value: nochilds[j], dist: chosenMetric(notes[i], i, notes[j], j, 1, varianceMin, varianceMax, false), weight: chosenMetric(notes[i], i, notes[j], j, 1, varianceMin, varianceMax, true) })
                }
              }
            }
          }

          function compare (a, b) {
            if (a.dist < b.dist) {
              return 1
            } else if (a.dist > b.dist) {
              return -1
            } else if (a.dist === b.dist && a.id > b.id) {
              return -1
            }
            return 0
          }

          let currentnodes = []
          for (let j = 0; j < notes.length; j++) {
            let already = false
            dataset.nodes.forEach((node) => {
              if (node.id === j) { already = true }
            })
            if (!already) { dataset.nodes.push({ id: j, notes: notes[j] }) }
            dataset.links.forEach((link) => {
              if (layer[link.source] === layer[j]) {
                currentnodes.push({ id: link.target, notes: notes[link.target], dist: link.dist, weight: link.weight })
              }
            })
            currentnodes.sort(compare)
            currentnodes.forEach((node) => {
              let alreadyt = false
              dataset.nodes.forEach((dnode) => {
                if (dnode.id === node.id) { alreadyt = true }
              })
              if (!alreadyt) { dataset.nodes.push(node) }
            })
            currentnodes = []
          }
          let index = 0
          dataset.nodes.forEach((node) => {
            node.idr = node.id
            node.id = index
            index++
          })

          dataset.links = []

          const unrealLinks = []

          for (let i = 0; i < dataset.nodes.length; i++) {
            for (let j = 0; j < dataset.nodes.length; j++) {
              if (i !== j) {
                if (parent[dataset.nodes[i].idr] === dataset.nodes[j].idr) {
                  dataset.links.push({ source: j, target: i, value: valueLayer[layer[i]], dist: dataset.nodes[i].dist, weight: dataset.nodes[i].weight }) // (depth-layer[j])*
                }
              }
              if (newfill[dataset.nodes[j].idr] && !newfill[dataset.nodes[i].idr] && dataset.nodes[i].idr === lastfill + 1) {
                dataset.links.push({
                  source: j,
                  target: i,
                  value: valueLayer[layer[dataset.nodes[j].idr]],
                  dist: 0.1, // metric!==1&&metric!==2?chosenMetric(notes[dataset.nodes[i].idr],dataset.nodes[i].idr,notes[dataset.nodes[j].idr],dataset.nodes[j].idr,1,varianceMin,varianceMax,false):0.1,
                  weight: metric !== 1 && metric !== 2 ? chosenMetric(notes[dataset.nodes[i].idr], dataset.nodes[i].idr, notes[dataset.nodes[j].idr], dataset.nodes[j].idr, 1, varianceMin, varianceMax, true) : 0.1
                })
                unrealLinks.push(dataset.links[dataset.links.length - 1])
              }
            }
          }
          // sankey
          const svg = d3.select('#icicle')
            .attr('width', w)
            .attr('height', h)
            .append('g')
            .attr('transform',
              'translate(' + margin.left + ',' + margin.top + ')')

          d3.select('#playback_line_sankey').remove()
          svg.append('rect')
            .attr('id', 'playback_line_sankey')
            .attr('height', h - margin.top - margin.bottom)
            .attr('width', 4)
            .attr('x', 0)
            .attr('y', 0)
            .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
            .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
            .attr('opacity', 0)

          const newW = w - margin.left - margin.right

          const sankey = d3s
            .sankey()
            .size([w - margin.left - margin.right, h - margin.top - margin.bottom])
            .nodeId(d => d.id)
            .nodeWidth((newW * 6 / 10) / depth)
            .nodePadding(10)
            .nodeAlign(d3s.sankeyCenter)
            .nodeSort(null)
            .linkSort(compare) // null for no sort

          const graph = sankey(dataset)

          function gradSank (c, id, id2) {
            svg.select('#GradSank' + id + id2).remove()
            // gradient for opacity but didnt work with color so opacity in x dir and color in y dir
            const linearGradient = svg.append('linearGradient').attr('id', 'GradSank' + id + id2)
            linearGradient.append('stop')
              .attr('offset', '0%')
              .attr('stop-color', c[id])
            linearGradient.append('stop')
              .attr('offset', '100%')
              .attr('stop-color', c[id2])
          }

          if (dataset.nodes.length === 1) {
            dataset.nodes[0].x0 = margin.left
            dataset.nodes[0].x1 = w - margin.left - margin.right
            dataset.nodes[0].y0 = margin.top
            dataset.nodes[0].y1 = h - margin.top - margin.bottom
          }

          function setOpForAllObjects (enter) {
            dataset.nodes.forEach((node) => {
            /*
                if(modelUsedFlag)
                d3.select("#Node"+node.idr)
                  .attr("fill",darkmode==="LightMode"?"white":"#333")
                  .attr("fill-opacity", 0.1)
                else
                d3.select("#Node"+node.idr)
                  .attr("fill-opacity", 0.1)
                */
              d3.select('#Node' + node.idr)
                .transition(500).style('filter', '')
            })
            dataset.links.forEach((d) => {
              d3.select('#Link' + d.source.idr + d.target.idr)
                .transition(500).attr('stroke-opacity', enter ? 0.3 : 0.9)
            })
          }

          if (!sankeyExist) {
            svg
              .append('g')
              .classed('links', true)
              .selectAll('path')
              .data(graph.links)
              .enter()
              .append('path')
              .attr('class', 'sankeylink')
              .classed('link', true)
              .attr('id', d => 'Link' + d.source.idr + d.target.idr)
              .attr('d', d => { if (Math.abs(d.y1 - d.y0) < 1) { d.y1 = d.y1 + 1 }; return d3s.sankeyLinkHorizontal()(d) })
              .attr('fill', 'none')
              .attr('stroke', d => { gradSank(color, d.source.idr, d.target.idr); return 'URL(#GradSank' + d.source.idr + d.target.idr + ')' }) // gradient from color source.id to color[target.id]
              .attr('stroke-opacity', 0.9)
              .attr('stroke-width', d => (d.width / 2) * d.weight)
              .on('mouseenter', function (e, d) {
                setOpForAllObjects(true)
                d3.select('#Link' + d.source.idr + d.target.idr)
                  .transition(500).attr('stroke-opacity', 0.9)
              })
              .on('mouseout', function (e, d) {
                setOpForAllObjects(false)
              })

            svg
              .append('g')
              .classed('nodes', true)
              .selectAll('rect')
              .data(graph.nodes)
              .enter()
              .append('rect')
              .attr('class', 'sankeynode')
              .attr('id', d => 'Node' + d.idr)
              .attr('x', d => d.x0)
              .attr('y', d => d.y0)
              .attr('rx', 15)
              .attr('ry', 15)
              .attr('width', d => d.x1 - d.x0)
              .attr('height', d => d.y1 - d.y0)
              .attr('stroke', 'grey')
              .attr('fill', d => {
                const j = d.idr
                let fill
                if (modelUsedFlag) { darkmode === 'LightMode' ? fill = 'white' : fill = '#333' } else { fill = modelColors3(modelUsed[normalIndex[j]]) }// d3.schemeTableau10[4+(2*modelUsed[normalIndex[j]-1])+modelUsed[normalIndex[j]-1]%2];
                return fill
              })
            // .attr("fill-opacity", 0.1)
              .on('mouseenter', function (e, d) {
                deleteButtonSankey()
                setOpForAllObjects(true)
                const nodelist = [d]
                while (nodelist.length > 0) {
                  const nodecurr = nodelist.shift()
                  /*
                    if(modelUsedFlag){
                    d3.select("#Node"+nodecurr.idr)
                      .attr("fill", "grey")
                      .attr("fill-opacity", 0.3)
                    }else
                    d3.select("#Node"+nodecurr.idr)
                      .attr("fill-opacity", 0.4)
                    */
                  d3.select('#Node' + nodecurr.idr)
                    .transition(500)
                  // .attr("stroke-width", 3)
                    .style('filter', 'drop-shadow( 3px 3px 7px #aaa)')
                  nodecurr.targetLinks.forEach((link) => {
                    d3.select('#Link' + link.source.idr + link.target.idr)
                      .transition(500).attr('stroke-opacity', 0.9)
                    nodelist.push(link.source)
                  })
                }
                showButtonSankey(d, svg, newfill)
              })
              .on('mouseout', function (e, d) {
                const offset = 1
                const x = e.offsetX - margin.left
                const y = e.offsetY - margin.top
                if (!(d.x0 + offset <= x - 1 && d.x1 - offset >= x && d.y0 + offset <= y && d.y1 - offset >= y)) {
                  setOpForAllObjects(false)
                  const nodelist = [d]
                  while (nodelist.length > 0) {
                    const nodecurr = nodelist.shift()
                    /*
                      if(modelUsedFlag){
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill",darkmode==="LightMode"?"white":"#333")
                        .attr("fill-opacity", 0.1)
                      }
                      else
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill-opacity", 0.1)
                      */
                    d3.select('#Node' + nodecurr.idr)
                      .transition(500)
                    // .attr("stroke-width", 1)
                      .style('filter', '')
                    nodecurr.targetLinks.forEach((link) => {
                      d3.select('#Link' + link.source.idr + link.target.idr)
                        .transition(500).attr('stroke-opacity', 0.9)
                      nodelist.push(link.source)
                    })
                  }
                  deleteButtonSankey()
                }
              })
              .on('click', function (e, d) {
                const j = d.idr
                const ind = [j]
                let par = parent[j]
                let currentChild = j
                let count = 0
                while (par !== currentChild && count < notes.length) {
                  ind.push(par)
                  currentChild = parent[currentChild]
                  par = parent[currentChild]
                  count++
                }
                createRollForSelect(ind)
              })
          // .on("mouseenter",(e,d)=>showButtonSankey(d,svg))
          } else {
            graph.links.forEach(d => {
            // const url = 'URL(#GradSank' + d.source.idr + d.target.idr + ')'
              d3
                .select('#Link' + d.source.idr + d.target.idr)
                .transition(5000)
                .attr('d', () => { if (Math.abs(d.y1 - d.y0) < 1) { d.y1 = d.y1 + 1 }; return d3s.sankeyLinkHorizontal()(d) })
              // .attr("stroke", url) //gradient from color source.id to color[target.id]
                .attr('stroke-width', () => (d.width / 2) * d.weight)
            })

            graph.nodes.forEach(d => {
              d3
                .select('#Node' + d.idr)
                .on('mouseenter', function (e, d) {
                  deleteButtonSankey()
                  setOpForAllObjects(true)
                  const nodelist = [d]
                  while (nodelist.length > 0) {
                    const nodecurr = nodelist.shift()
                    /*
                    if(modelUsedFlag){
                    d3.select("#Node"+nodecurr.idr)
                      .attr("fill", "grey")
                      .attr("fill-opacity", 0.3)
                    }else
                    d3.select("#Node"+nodecurr.idr)
                      .attr("fill-opacity", 0.4)
                    */
                    d3.select('#Node' + nodecurr.idr)
                      .transition(500)
                    // .attr("stroke-width", 3)
                      .style('filter', 'drop-shadow( 3px 3px 7px #aaa)')
                    nodecurr.targetLinks.forEach((link) => {
                      d3.select('#Link' + link.source.idr + link.target.idr)
                        .transition(500).attr('stroke-opacity', 0.9)
                      nodelist.push(link.source)
                    })
                  }
                  showButtonSankey(d, svg, newfill)
                })
                .on('mouseout', function (e, d) {
                  const offset = 1
                  const x = e.offsetX - margin.left
                  const y = e.offsetY - margin.top
                  if (!(d.x0 + offset <= x - 1 && d.x1 - offset >= x && d.y0 + offset <= y && d.y1 - offset >= y)) {
                    setOpForAllObjects(false)
                    const nodelist = [d]
                    while (nodelist.length > 0) {
                      const nodecurr = nodelist.shift()
                      /*
                      if(modelUsedFlag){
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill",darkmode==="LightMode"?"white":"#333")
                        .attr("fill-opacity", 0.1)
                      }
                      else
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill-opacity", 0.1)
                      */
                      d3.select('#Node' + nodecurr.idr)
                        .transition(500)
                      // .attr("stroke-width", 1)
                        .style('filter', '')
                      nodecurr.targetLinks.forEach((link) => {
                        d3.select('#Link' + link.source.idr + link.target.idr)
                          .transition(500).attr('stroke-opacity', 0.9)
                        nodelist.push(link.source)
                      })
                    }
                    deleteButtonSankey()
                  }
                })
                .on('click', function (e, d) {
                  const j = d.idr
                  const ind = [j]
                  let par = parent[j]
                  let currentChild = j
                  let count = 0
                  while (par !== currentChild && count < notes.length) {
                    ind.push(par)
                    currentChild = parent[currentChild]
                    par = parent[currentChild]
                    count++
                  }
                  createRollForSelect(ind)
                })
                .transition(5000)
                .attr('x', () => d.x0)
                .attr('y', () => d.y0)
                .attr('width', () => d.x1 - d.x0)
                .attr('height', () => d.y1 - d.y0)
                .attr('fill', () => {
                  const j = d.idr
                  let fill
                  if (modelUsedFlag) { darkmode === 'LightMode' ? fill = 'white' : fill = '#333' } else { fill = modelColors3(modelUsed[normalIndex[j]]) }// d3.schemeTableau10[4+(2*modelUsed[normalIndex[j]-1])+modelUsed[normalIndex[j]-1]%2];
                  return fill
                })
            })
          }

          function getAxis (notes) {
            const axis = { pmin: 128, pmax: 0, lmin: 0, lmax: 0 }
            if (notes[0] !== undefined) { axis.lmin = notes[0].quantizedStartStep }
            notes.forEach((note) => {
              if (note.pitch > axis.pmax) { axis.pmax = note.pitch }
              if (note.pitch < axis.pmin) { axis.pmin = note.pitch }
              if (note.quantizedStartStep < axis.lmin) { axis.lmin = note.quantizedStartStep }
              if (note.quantizedEndStep > axis.lmax) { axis.lmax = note.quantizedEndStep }
            })
            return axis
          }

          function adjustAxis (notes, axis) {
            notes.forEach((note) => {
              if (note.pitch > axis.pmax) { axis.pmax = note.pitch }
              if (note.pitch < axis.pmin) { axis.pmin = note.pitch }
              if (note.quantizedStartStep < axis.lmin) { axis.lmin = note.quantizedStartStep }
              if (note.quantizedEndStep > axis.lmax) { axis.lmax = note.quantizedEndStep }
            })
            return axis
          }

          const axis = []

          for (let i = 0; i < graph.nodes.length; i++) {
            if (axis[graph.nodes[i].layer] === undefined) {
              axis.push(getAxis(graph.nodes[i].notes))
            } else {
              axis[graph.nodes[i].layer] = adjustAxis(graph.nodes[i].notes, axis[graph.nodes[i].layer])
            }
          }
          if (mode !== 'samePitchRangePerLayer') {
            let npmax = 0
            let npmin = 128
            for (let k = 0; k < axis.length; k++) {
              if (npmax < axis[k].pmax) { npmax = axis[k].pmax }
              if (npmin > axis[k].pmin) { npmin = axis[k].pmin }
            }
            for (let k = 0; k < axis.length; k++) {
              axis[k].pmax = npmax
              axis[k].pmin = npmin
            }
          }

          function getNearNode (e) {
            for (let i = 0; i < graph.nodes.length; i++) {
              const node = graph.nodes[i]
              const x = e.offsetX - margin.left
              const y = e.offsetY - margin.top
              if (e.type === 'mouseenter') {
                if (node.x0 <= x && node.x1 >= x && node.y0 <= y && node.y1 >= y) {
                  return node
                }
              } else {
                if (node.x0 - 10 <= x && node.x1 + 10 >= x && node.y0 - 10 <= y && node.y1 + 10 >= y) {
                  return node
                }
              }
            }
            return undefined
          }

          unrealLinks.forEach((link) => {
            const node1 = link.source
            const node2 = link.target
            const length = (node2.x0 - node1.x1) / 8
            const x = (node2.x0 + node1.x1) / 2
            const y = h - margin.top - margin.bottom

            d3.select('#unrealLink').remove()
            svg.append('rect')
              .attr('id', 'unrealLink')
              .attr('x', x - length / 2)
              .attr('y', margin.top)
              .attr('width', length)
              .attr('height', y)
              .attr('fill', darkmode === 'LightMode' ? 'white' : '#333')
          })

          let x, y
          for (let i = 0; i < graph.nodes.length; i++) {
          // var tnotes = graph.nodes[i]//.notes
          // x and y scale from node heigth and width ...
            const padding = (graph.nodes[i].x1 - graph.nodes[i].x0) / 40
            x = d3.scaleLinear()
              .domain([axis[graph.nodes[i].layer].lmin, axis[graph.nodes[i].layer].lmax])
              .range([graph.nodes[i].x0 + padding, graph.nodes[i].x1 - padding])

            y = d3.scaleLinear()
              .domain([axis[graph.nodes[i].layer].pmax + 2, axis[graph.nodes[i].layer].pmin - 2])
              .rangeRound([graph.nodes[i].y0, graph.nodes[i].y1])

            const noteheight = y(axis[graph.nodes[i].layer].pmax - 1) - y(axis[graph.nodes[i].layer].pmax)

            const cs = []
            for (let p = axis[graph.nodes[i].layer].pmax + 1; p > axis[graph.nodes[i].layer].pmin - 2; p--) {
              if (p % 12 === 0) { cs.push(p) }
            }

            d3.selectAll('.cs').remove()
            svg.append('g')
              .attr('class', 'cs')
              .selectAll('line')
              .data(cs)
              .enter()
              .append('line')
              .attr('x1', graph.nodes[i].x0)
              .attr('y1', d => y(d))
              .attr('x2', graph.nodes[i].x1)
              .attr('y2', d => y(d))
              .attr('stroke', 'grey')
              .attr('stroke-opacity', 0.2)
              .attr('stroke-width', d => d % 12 === 0 ? 3 : 1)
              .on('mouseenter', function (e, d) {
                setOpForAllObjects(true)
                const node = getNearNode(e)
                if (node !== undefined && node.sourceLinks !== undefined) {
                  const nodelist = [node]
                  while (nodelist.length > 0) {
                    const nodecurr = nodelist.shift()
                    /* if(modelUsedFlag)
                    d3.select("#Node"+nodecurr.idr)
                      .attr("fill", "grey")
                      .attr("fill-opacity", 0.3)
                    else
                    d3.select("#Node"+nodecurr.idr)
                      .attr("fill-opacity", 0.4)
                    */
                    d3.select('#Node' + nodecurr.idr)
                      .transition(500).style('filter', 'drop-shadow( 3px 3px 7px #aaa)')
                    nodecurr.targetLinks.forEach((link) => {
                      d3.select('#Link' + link.source.idr + link.target.idr)
                        .transition(500).attr('stroke-opacity', 0.9)
                      nodelist.push(link.source)
                    })
                  }
                }
              })
              .on('mouseout', function (e, d) {
                setOpForAllObjects(false)
                const node = getNearNode(e)
                if (node !== undefined && node.sourceLinks !== undefined) {
                  const nodelist = [node]
                  while (nodelist.length > 0) {
                    const nodecurr = nodelist.shift()
                    d3.select('#Node' + nodecurr.idr)
                      .transition(500).style('filter', '')
                    nodecurr.targetLinks.forEach((link) => {
                      d3.select('#Link' + link.source.idr + link.target.idr)
                        .transition(500).attr('stroke-opacity', 0.3)
                      nodelist.push(link.source)
                    })
                  }
                }
              })
              .on('click', function (e, d) {
                const j = d.idr
                const ind = [j]
                let par = parent[j]
                let currentChild = j
                let count = 0
                while (par !== currentChild && count < notes.length) {
                  ind.push(par)
                  currentChild = parent[currentChild]
                  par = parent[currentChild]
                  count++
                }
                createRollForSelect(ind)
              })

            svg.append('g')
              .attr('class', 'cs')
              .selectAll('line')
              .data(cs)
              .enter()
              .append('text')
              .attr('x', graph.nodes[i].x0 + 2)
              .attr('y', d => y(d) - noteheight / 3)
              .style('font', Math.max(Math.min(noteheight, 10), 5) + 'px times')
              .text(d => getLab(d).label)
              .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')

            if (!sankeyExist) {
              svg.append('g').selectAll('rect')
                .data(graph.nodes[i].notes).enter()
                .append('rect')
                .attr('id', d => 'Note' + d.pitch + d.quantizedStartStep + graph.nodes[i].idr)
                .attr('rx', 4)
                .attr('ry', 4) // previous 6
                .attr('x', d => x(d.quantizedStartStep))
                .attr('y', d => y(d.pitch))
                .attr('width', d => x(d.quantizedEndStep) - x(d.quantizedStartStep))
                .attr('height', d => noteheight)
                .attr('fill', d => grad(color[graph.nodes[i].idr], graph.nodes[i].idr, d.pitch, svg))// ; return "URL(#GradIce"+graph.nodes[i].idr+"_"+d.pitch+")"})
                .attr('opacity', 0.7)
                .attr('pitch', d => d.pitch)
                .attr('class', d => 'sankeynote')// +d.pitch)
                .on('mouseenter', function (e, d) {
                  setOpForAllObjects(true)
                  const node = getNearNode(e)
                  if (node !== undefined && node.sourceLinks !== undefined) {
                    const nodelist = [node]
                    while (nodelist.length > 0) {
                      const nodecurr = nodelist.shift()
                      /* if(modelUsedFlag)
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill", "grey")
                        .attr("fill-opacity", 0.3)
                      else
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill-opacity", 0.4)
                      */
                      d3.select('#Node' + nodecurr.idr)
                        .transition(500).style('filter', 'drop-shadow( 3px 3px 7px #aaa)')
                      nodecurr.targetLinks.forEach((link) => {
                        d3.select('#Link' + link.source.idr + link.target.idr)
                          .transition(500).attr('stroke-opacity', 0.9)
                        nodelist.push(link.source)
                      })
                    }
                  }
                  d3.selectAll('.sankeynote')
                    .filter(function () {
                      return parseInt(d3.select(this).attr('pitch')) !== d.pitch
                    })
                    .transition(500).attr('opacity', 0.2)
                })
                .on('mouseout', function (e, d) {
                  setOpForAllObjects(false)
                  const node = getNearNode(e)
                  if (node !== undefined && node.sourceLinks !== undefined) {
                    const nodelist = [node]
                    while (nodelist.length > 0) {
                      const nodecurr = nodelist.shift()
                      /*
                      if(modelUsedFlag)
                      d3.select("#Node"+nodecurr.idr)
                        .attr("fill",darkmode==="LightMode"?"white":"#333")
                        .attr("fill-opacity", 0.1)
                      else
                      d3.select("#Node"+nodecurr.idr)
                        //.attr("fill",darkmode==="LightMode"?"white":"#333")
                        .attr("fill-opacity", 0.1)
                      */
                      d3.select('#Node' + nodecurr.idr)
                        .transition(500).style('filter', '')
                      nodecurr.targetLinks.forEach((link) => {
                        d3.select('#Link' + link.source.idr + link.target.idr)
                          .transition(500).attr('stroke-opacity', 0.3)
                        nodelist.push(link.source)
                      })
                    }
                  /*
                    d3.select("#Node"+node.idr)
                      .attr("fill-opacity", 0.2)
                    node.sourceLinks.forEach((link)=>{
                      d3.select("#Link"+link.source.id+link.target.id)
                      .attr("stroke-opacity", 0.3)
                    })
                    node.targetLinks.forEach((link)=>{
                      d3.select("#Link"+link.source.id+link.target.id)
                      .attr("stroke-opacity", 0.3)
                    })
                    */
                  }
                  d3.selectAll('.sankeynote')
                    .transition(500).attr('opacity', 0.7)
                })
                .on('click', function (e, d) {
                  const j = d.idr
                  const ind = [j]
                  let par = parent[j]
                  let currentChild = j
                  let count = 0
                  while (par !== currentChild && count < notes.length) {
                    ind.push(par)
                    currentChild = parent[currentChild]
                    par = parent[currentChild]
                    count++
                  }
                  createRollForSelect(ind)
                })
            } else {
              graph.nodes[i].notes.forEach((d) => {
                d3.select('#Note' + d.pitch + d.quantizedStartStep + graph.nodes[i].idr)
                  .transition(5000)
                  .attr('x', x(d.quantizedStartStep))
                  .attr('y', y(d.pitch))
              // .attr("fill",grad(color[graph.nodes[i].idr],graph.nodes[i].idr,d.pitch,svg))//; return "URL(#GradIce"+graph.nodes[i].idr+"_"+d.pitch+")"})
              })
            }
          }
          sankeyExist = true
        }

        function createSimpleRollForIcicly (data, tx, ty, twidth, theight, color, axis, h, i, inlayer, lastlayer, normalIndex) {
          const tmargin = { top: 20, right: 5, bottom: 11, left: 27 }


          if (lastlayer) { tmargin.right = 12 }

          if (h > 0) {
            tmargin.bottom = tmargin.bottom / h
            if (ty !== 0) { tmargin.top = tmargin.top / h } else if (ty === 0 && normalIndex !== 0) { ty -= 20 }
          }

          if (normalIndex !== 0) { ty += 20 }

          if (mode === 'ownPitchRange') {
            let pmin = 128
            let pmax = 0
            data.forEach((p) => {
              if (p.pitch > pmax) { pmax = p.pitch }
              if (p.pitch < pmin) { pmin = p.pitch }
            })

            axis.pmin = pmin - 2
            axis.pmax = pmax + 2
          }
          if (mode === 'samePitchRangeOverall') {
            axis.pmin = overallAxis.pmin - 2
            axis.pmax = overallAxis.pmax + 2
          }

          let padding = 0
          let noteheight = 0

          if (data.length > 0) {
            padding = 0// ty===0?20:0
            noteheight = ((theight - padding - tmargin.top - tmargin.bottom) / (axis.pmax - axis.pmin + 1))
          }

          if (modeRect === 'Line') { noteheight = Math.min((theight - tmargin.top - tmargin.bottom) * 4 / 5, height / 5) }

          const svg = d3.select('#plotsgroup').append('svg')

          svg.attr('height', theight).attr('width', twidth)
            .attr('x', tx).attr('y', ty).attr('id', 'roll' + i).attr('class', 'pointer')
          svg.append('rect').attr('height', theight).attr('width', twidth)
            .attr('fill', () => {
              if (modelUsedFlag || i === 0) { return darkmode === 'LightMode' ? 'white' : '#333' } else { return modelColors3(modelUsed[normalIndex[i]]) }// d3.schemeTableau10[4+(2*modelUsed[normalIndex[i]-1])+modelUsed[normalIndex[i]-1]%2];
            })
            .attr('fill-opacity', 0.2)

          svg.on('click', function (e) {
            if (e.button === 0) {
              const ind = [i]
              let par = parent[i]
              let currentChild = i
              let count = 0
              while (par !== currentChild && count < notes.length) {
                ind.push(par)
                currentChild = parent[currentChild]
                par = parent[currentChild]
                count++
              }
              createRollForSelect(ind)
            }
          })

          const x = d3.scaleLinear()
            .domain([axis.lmin, axis.lmax])
            .range([tmargin.left, twidth - tmargin.right])

          svg.on('contextmenu', (e, d) => {
            e.preventDefault()
            if (e.button === 2) {
              Play([normalIndex], true, i, x, [tmargin.top, theight - tmargin.top - tmargin.bottom])
            }
          })

          let y = d3.scaleLinear()
            .domain([axis.pmax + 0.5, axis.pmin - 0.5])
            .rangeRound([tmargin.top, theight - tmargin.bottom])

          if (modeRect === 'Line') {
            y = d3.scaleLinear()
              .domain([0, 2])
              .rangeRound([tmargin.top, theight - tmargin.bottom])
          }

          const xticks = []
          for (let t = axis.lmin; t <= axis.lmax; t++) {
            if (t % 16 === 0) {
              xticks.push(t)
            }
          }

          function xAxis (g) {
            g
              .attr('transform', `translate(${0},${0 + tmargin.top})`)
              .call(d3.axisTop(x).tickValues(xticks).tickFormat((t) => {
                if (ty === 0) {
                  return t / 16
                }
              }))
          }

          function yAxis (g) {
            g
              .attr('transform', `translate(${0 + tmargin.left},${0})`)
            // .style('font', Math.max(Math.min(noteheight, 19), 10) + 'px times')
              .call(d3.axisLeft(y).ticks(modeRect === 'Rolls' ? (axis.pmax - axis.pmin) : 0).tickFormat((t) => {
                if (tickDependOnSize(t, noteheight, axis)) { // (t%12===0||t%12===5)/*||t%12===4||t%12===7||t%12===7*/&&t!==axis.pmin&&t!==axis.pmax){
                  return getLabel(t)
                }
              }).tickSize(0))
          }

          if (ty === 0) { svg.append('g').call(xAxis) }

          svg.append('g').call(yAxis)

          // if(ty===0){

          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(${0},${0 + tmargin.top})`)
            .call(d3.axisTop(x).tickSize(-theight + tmargin.bottom + tmargin.top).tickFormat('')
              .tickValues(getVal('x', axis)))

          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(${0},${0 + tmargin.top})`)
            .attr('stroke-width', 2)
            .call(d3.axisTop(x).tickSize(-theight + tmargin.bottom + tmargin.top)
              .tickFormat('').tickValues(getVal('xc', axis)))
          // }

          if (modeRect === 'Rolls') {
          /*
              svg.append('g')
            .style("opacity","0.25")
            .attr('class', 'y axis-grid')
            .attr('transform', `translate(${0+tmargin.left},${0})`)
            .call(d3.axisLeft(y).tickSize(-twidth + tmargin.left + tmargin.right).tickFormat("").ticks(axis.pmax-axis.pmin))
            */
            const pitches = getPitches(true, axis)
            const pitchesWc = getPitches(false, axis)
            /*
            svg.append('g')
            .style("opacity","0.25")
            .attr('class', 'y axis-grid')
            .attr('transform', `translate(${0+tmargin.left},${0})`)
            .call(d3.axisLeft(y).tickSize(-twidth + tmargin.left + tmargin.right)
                  .tickFormat("").tickValues(pitchesWoc));
              */

            const ef = []
            // rectangles for pattern
            svg.append('g')
              .selectAll('rect')
              .style('opacity', '0.25')
              .attr('class', 'y axis-grid')
              .attr('transform', `translate(${tmargin.left},0)`)
              .data(pitches)
              .enter()
              .append('rect')
              .attr('stroke-width', 0.8)
              .attr('class', d => 'rect' + d)
            // .attr("stroke-opacity",0.4)
            // .attr("stroke","black")
              .attr('transform', `translate(0,${-(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
              .attr('height', y(axis.pmin) - y(axis.pmin + 1))
              .attr('width', d => twidth - tmargin.left - tmargin.right)
              .attr('x', d => { if (d % 12 === 5) { ef.push(d) }; return tmargin.left })
              .attr('y', d => y(d))
              .attr('opacity', d => isSharp(d) ? 0.2 : 0.1)
              .attr('fill', d => 'grey')
              .on('mouseenter', (e, d) => {
                d3.selectAll('.rect' + d)
                  .transition(500).attr('fill', '#f1e740').attr('opacity', 0.4)
              })
              .on('mouseleave', (e, d) => {
                d3.selectAll('.rect' + d)
                  .transition(500).attr('fill', 'grey').attr('opacity', isSharp(d) ? 0.2 : 0.1)
              })

            // line between e and f
            svg.append('g')
              .style('opacity', '0.25')
              .attr('class', 'y axis-grid-C')
              .attr('transform', `translate(${tmargin.left},0)`)
              .attr('stroke', 'blue')
              .attr('fill', 'blue')
              .call(d3.axisLeft(y).tickSize(-twidth + tmargin.left + tmargin.right)
                .tickFormat('').tickValues(ef))
              .selectAll('line')
              .attr('transform', `translate(0,${(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
              .attr('opacity', 0.4)
              .attr('stroke-width', 1)

            svg.append('g')
              .style('opacity', '0.25')
              .attr('class', 'y axis-grid-C')
              .attr('transform', `translate(${0 + tmargin.left},${0})`)
              .attr('stroke', 'blue')
              .attr('fill', 'blue')
              .call(d3.axisLeft(y).tickSize(-twidth + tmargin.left + tmargin.right)
                .tickFormat('').tickValues(pitchesWc))
              .selectAll('line')
              .attr('transform', `translate(0,${(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
            // .attr("stroke","blue")
              .attr('stroke-width', 2)
          }

          // .attr("fill", d => {grad(color[i],opacit(d.pitch,ai1),i,d.pitch); return "URL(#Grad"+i+d.pitch+")";})
          if (i === 0) {
            d3.select('#icicle').append('g').attr('id', 'tgice')
            const div = d3.select('#tgice')
              .append('text')
              .attr('class', 'tooltip')
              .attr('id', 'tooltipice')
              .attr('width', 30)
              .attr('height', 20)
              .style('opacity', 0)

            d3.select('#tgice').append('rect').attr('id', 'brice').attr('fill', 'white')
              .style('opacity', 0).attr('stroke', 'green')
            div.append('tspan').attr('id', 't1ice').attr('dx', '0').attr('dy', '1em')
            div.append('tspan').attr('id', 't2ice').attr('dx', '-3.75em').attr('dy', '1.1em')
          }

          function sharp (i) {
            const k = i % 12
            if (k === 0 || k === 2 || k === 4 || k === 5 || k === 7 || k === 9 || k === 11) { return false }
            return true
          }

          const sharps = []

          svg.append('g')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('rx', 4)
            .attr('ry', 4) // previous 6
            .attr('transform', `translate(${0},${-(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
            .attr('stroke-width', 0.9 / h)
            .attr('stroke', color === 'black' ? 'red' : 'black')
            .attr('height', d => modeRect !== 'Rolls' & sharp(d.pitch) ? noteheight * 3 / 5 : noteheight)
            .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep)))
            .attr('x', d => x(d.quantizedStartStep))
          // || true to align all at the top instead of adjust to sharp
            .attr('y', d => {
              if (modeRect === 'Rolls') {
                return y(d.pitch)// +0.5)+(padding/2)
              } else {
                const sh = sharp(d.pitch)
                if (sh) { sharps.push(d) }
                // || true to align all at the top instead of adjust to sharp
                return !sh ? y(1) - (noteheight / 2) : y(1) - (noteheight * 3 / 10)
              }
            })
            .attr('fill', d => grad(color, i, d.pitch, svg))// ; return modeRect==="Rolls"?"URL(#GradIce"+i+"_"+d.pitch+")":"URL(#GradIce"+d.pitch+"1000)";})
            .attr('opacity', 0.7)
            .on('mouseenter', (e, d) => {
              d3.selectAll('.rect' + d.pitch)
                .transition(500).attr('fill', '#f1e740').attr('opacity', 0.4)
            })
            .on('mouseleave', (e, d) => {
              d3.selectAll('.rect' + d.pitch)
                .transition(500).attr('fill', 'grey').attr('opacity', isSharp(d) ? 0.2 : 0.1)
            })

          /**
        // for hatches
        if (modeRect !== 'Rolls' && false) {
          svg.append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 8)
            .attr('height', 8)
            .append('path')
            .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)

          const hatches = svg.append('g').selectAll('rect')
            .data(sharps).enter().append('rect')
            .attr('transform', 'translate(0,0)')
            .attr('height', noteheight * 4 / 5)
            .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep)))
            .attr('x', d => x(d.quantizedStartStep))
            .attr('y', d => y(1) - (noteheight * 4 / 10))
            .attr('fill', 'url(#diagonalHatch)')

          rects.on('mouseover', function (d, e) {
            const t1 = 'pitch: ' + getText(e.pitch % 12) + (Math.floor(e.pitch / 12) - 1)
            const t2 = 'steps: ' + e.quantizedStartStep + ' to ' + e.quantizedEndStep

            const group = d3.select('#tgice')
            const div = d3.select('#tooltipice')

            div
              .select('#t1ice').text(t1)
            // .attr("x", (d.offsetX-15))
            div
              .select('#t2ice').text(t2)
            // .attr("x", (d.offsetX-15))
            div.style('opacity', 1)

            const tt = document.getElementById('tooltipice')
            const rec = tt.getBBox()

            div.attr('x', (d.offsetX - rec.width / 2))
              .attr('y', (d.offsetY - rec.height - 10))

            d3.select('#brice')
              .attr('x', (d.offsetX - rec.width / 2))
              .attr('y', (d.offsetY - rec.height - 10))
              .attr('width', rec.width).attr('height', rec.height)
              .style('opacity', 1)

            group.raise()
            div.raise()

            // console.log(document.getElementById("#tooltip").offsetHeight);
          })
            .on('mouseout', function (d, e) {
              const div = d3.select('#tooltipice')
              div.style('opacity', 0)
              d3.select('#brice').style('opacity', 0)
              div.attr('x', 0).attr('y', 0)
              d3.select('#brice').attr('x', 0).attr('y', 0)
            })
          hatches.on('mouseover', function (d, e) {
            const t1 = 'pitch: ' + getText(e.pitch % 12) + (Math.floor(e.pitch / 12) - 1)
            const t2 = 'steps: ' + e.quantizedStartStep + ' to ' + e.quantizedEndStep

            const group = d3.select('#tgice')
            const div = d3.select('#tooltipice')

            div
              .select('#t1ice').text(t1)
            // .attr("x", (d.offsetX-15))
            div
              .select('#t2ice').text(t2)
            // .attr("x", (d.offsetX-15))
            div.style('opacity', 1)

            const tt = document.getElementById('tooltipice')
            const rec = tt.getBBox()

            div.attr('x', (d.offsetX - rec.width / 2))
              .attr('y', (d.offsetY - rec.height - 10))

            d3.select('#brice')
              .attr('x', (d.offsetX - rec.width / 2))
              .attr('y', (d.offsetY - rec.height - 10))
              .attr('width', rec.width).attr('height', rec.height)
              .style('opacity', 1)

            group.raise()
            div.raise()

            // console.log(document.getElementById("#tooltip").offsetHeight);
          })
            .on('mouseout', function (d, e) {
              const div = d3.select('#tooltipice')
              div.style('opacity', 0)
              d3.select('#brice').style('opacity', 0)
              div.attr('x', 0).attr('y', 0)
              d3.select('#brice').attr('x', 0).attr('y', 0)
            })
        }
        */

          if (modeRect === 'Line' && i === 0) {
            const yt = d3.scaleLinear()
              .domain([11, 0])
              .rangeRound([theight / 4, theight * 3 / 4])
            const gt = svg.append('g')
            for (let j = 0; j < 12; j++) {
              gt.append('text')
                .attr('x', 0)
                .attr('y', yt(j))
                .attr('fill', cofpitch(j))
                .text(getText(j))
            }
          }
        }

        if (notes1.length > 0) {
          if (toggleState === 1 || !sankeyExist) {
            d3.select('#icicle').attr('width', width).attr('height', height)
            d3.select('#icicle').selectAll('*').remove()

            const svg = d3.select('#icicle').append('g').attr('id', 'plotsgroup')

            svg.append('rect').attr('height', height)
              .attr('width', width)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', darkmode === 'LightMode' ? 'white' : '#333')
          }
          overallAxis = { pmin: 128, pmax: 0, lmax: 0, lmin: 0 }

          // calc fills
          let newfill = []
          let filled = false
          for (let i = 1; i < fill.length; i++) {
            if (fill[i]) { filled = true }
          }

          // slice first element
          if (filled) {
            let fillmin = lastnotai
            let fillmax = 0
            for (let i = 1; i < fill.length; i++) {
              if (fill[i]) {
                notes[i].forEach((note) => {
                  if (note.quantizedStartStep < fillmin) { fillmin = note.quantizedStartStep }
                  if (note.quantizedEndStep > fillmax) { fillmax = note.quantizedEndStep }
                })
              }
            }
            const first = []
            const second = []
            notes[0].forEach((note) => {
              if (note.quantizedEndStep <= fillmin) {
                first.push(note)
              }
              if (note.quantizedStartStep >= fillmax) {
                second.push(note)
              }
            })
            notes = [first]
            parent = [0]
            color = [color1[0]]
            temp = [temp1[0]]
            normalIndex = [0]
            newfill = [false]
            let inde = 0
            for (let i = 1; i < notes1.length; i++) {
              if (fill1[i]) {
                notes.push(notes1[i])
                parent.push(parent1[i])
                color.push(color1[i])
                temp.push(temp1[i])
                normalIndex.push(i)
                newfill.push(true)
                inde++
              }
            }
            inde++
            notes.push(second)
            parent.push(inde)
            color.push(color1[0])
            temp.push(temp1[0])
            normalIndex.push(0)
            newfill.push(false)
            for (let i = 1; i < notes1.length; i++) {
              if (!fill1[i]) {
                notes.push(notes1[i])
                parent.push(parent1[i] + inde)
                color.push(color1[i])
                temp.push(temp1[i])
                normalIndex.push(i)
                newfill.push(false)
              }
            }
          } else {
            for (let i = 0; i < notes.length; i++) {
              normalIndex[i] = i
            }
          }
          /*
            calculateAllTreeData =>
            - Count Layers
            - count which index in which layer
            - parents already given
            */
          // count layers

          function calcNoteString (notes) {
            let string = ''
            const notes1 = notes// transformRec(notes);
            let once = false
            const length = dataLength(notes)
            for (let j = length - 32; j < length; j++) {
              for (let i = 0; i < notes1.length; i++) {
                if (notes1[i].quantizedStartStep <= j && notes1[i].quantizedEndStep > j) {
                  string = string + (notes1[i].pitch % 12).toString(16)
                  once = true
                }
              }
              if (!once) {
                string = string + ' '
              }
              once = false
            }
            return string
          }

          function compareLetter (a, b) {
            if (a === undefined) { return -1 }
            if (b === undefined) { return 1 }
            if (a < b) {
              return 1
            } else if (a > b) {
              return -1
            }
            return 0
          }

          function compare (a, b) {
            const s1 = a.notes
            const s2 = b.notes
            for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
              const result = compareLetter(s1.charAt(i), s2.charAt(i))
              if (result !== 0) { return result }
            }
            return 0
          }

          let layercount = 1
          const layer = [0]
          const numberofChilds = [0]
          const indexinchildlayer = [0]
          let currentlayer = 0
          const tosort = []

          for (let i = 0; i < parent.length; i++) {
            tosort.push([])
            if (parent[i] === i && i !== 0) {
              layer[i] = currentlayer + 1
            }
            numberofChilds[i] = 0
            for (let j = 1; j < parent.length; j++) {
              if (parent[j] === i && parent[j] !== j) {
                layer[j] = layer[i] + 1
                indexinchildlayer[j] = numberofChilds[i]
                numberofChilds[i]++
                tosort[i].push({ index: j, notes: calcNoteString(notes[j]) })
              }
            }
            currentlayer = layer[i]
          }

          // sort indexinchildlayer for start notes
          // only when line or always?
          // if(modeRect==="Line"){
          for (let i = 0; i < tosort.length; i++) {
            tosort[i].sort(compare)
          }
          for (let i = 0; i < tosort.length; i++) {
            tosort[i].forEach((obj, ind) => {
              indexinchildlayer[obj.index] = ind
            })
          }
          // }

          layercount = Math.max(...layer) + 1

          const layerpmax = []
          const layerpmin = []
          const layerlmin = []
          const layerlmax = []

          for (let i = 0; i < notes.length; i++) {
            notes[i].forEach((note) => {
              if (layerpmax[layer[i]] === undefined || layerpmax[layer[i]] < note.pitch) {
                layerpmax[layer[i]] = note.pitch
              }
              if (layerpmin[layer[i]] === undefined || layerpmin[layer[i]] > note.pitch) {
                layerpmin[layer[i]] = note.pitch
              }
              if (layerlmax[layer[i]] === undefined || layerlmax[layer[i]] < note.quantizedEndStep) {
                layerlmax[layer[i]] = note.quantizedEndStep
              }
              if (layerlmin[layer[i]] === undefined || layerlmin[layer[i]] > note.quantizedStartStep) {
                layerlmin[layer[i]] = note.quantizedStartStep
              }
              if (overallAxis.pmin > note.pitch) { overallAxis.pmin = note.pitch }
              if (overallAxis.pmax < note.pitch) { overallAxis.pmax = note.pitch }
              if (overallAxis.lmax < note.quantizedEndStep) { overallAxis.lmax = note.quantizedEndStep }
            })
          }


          overallAxis.pmax += 1
          overallAxis.pmin -= 1

          for (let i = 0; i < layerpmax.length; i++) {
            layerpmax[i] = layerpmax[i] + 2
            layerpmin[i] = layerpmin[i] - 2
          }

          let maxlength = 0
          let layerlength = 0
          for (let i = 0; i < layercount; i++) {
            layerlength = layerlmax[i] - layerlmin[i]
            maxlength = maxlength + layerlength
          }

          const widthscale = d3.scaleLinear()
            .domain([0, maxlength])
            .range([0, width])
          /*
            DrawRolls with given layer and parent =>
            - need height of parent
            - width given by max length of that layer
            - position given by parent width and height
            */

          const heigthofparent = []
          const axis = { pmin: 55, pmax: 65, lmin: 0, l: 32 }
          const xofparent = []
          const yofparent = []
          const layerwidth = []

          for (let i = 0; i < notes.length; i++) {
            if (layerwidth[layer[i]] === undefined || layerwidth[layer[i]] < widthscale(layerlmax[layer[i]] - layerlmin[layer[i]])) {
              layerwidth[layer[i]] = widthscale(layerlmax[layer[i]] - layerlmin[layer[i]])
            }
          }

          if (notes.length > 0 && toggleState === 1) {
            sankeyExist = false
            let off = 0
            for (let i = 0; i < notes.length; i++) {
              axis.pmin = layerpmin[layer[i]]
              axis.pmax = layerpmax[layer[i]]
              axis.lmin = layerlmin[layer[i]]
              axis.lmax = layerlmax[layer[i]]
              if (i === 0) {
                heigthofparent[i] = height
                xofparent[i] = 0
                yofparent[i] = 0
              } else if (parent[i] === i && i !== 0) {
                xofparent[i] = xofparent[i - 1] + layerwidth[layer[i] - 1]
                yofparent[i] = 0
                heigthofparent[i] = height
              } else {
                yofparent[parent[i]] !== 0 ? off = 0 : off = 20
                heigthofparent[i] = (heigthofparent[parent[i]] / numberofChilds[parent[i]]) - (off / (numberofChilds[parent[i]]))
                if (yofparent[parent[i]] + indexinchildlayer[i] === 0) { heigthofparent[i] = (heigthofparent[parent[i]] / numberofChilds[parent[i]]) + off - (off / (numberofChilds[parent[i]])) }
                xofparent[i] = xofparent[parent[i]] + layerwidth[layer[i] - 1]
                yofparent[i] = yofparent[parent[i]] + heigthofparent[i] * indexinchildlayer[i]
              }
              if (notes[i].length > 0 && notes[i][0].quantizedEndStep !== 0 && !notes[i][0].pitch !== 0) { createSimpleRollForIcicly(notes[i], xofparent[i], yofparent[i], layerwidth[layer[i]], heigthofparent[i], color[i], axis, numberofChilds[parent[i]], i, indexinchildlayer[i], layer[i] === layercount - 1, normalIndex[i]) }
            }
          }
          createRollForSelect(currentIndizes)
          if (notes.length > 0 && toggleState === 2) {
            createSankey(width, height, layercount, notes, parent, layer, color, numberofChilds, newfill)
          }
        }
      }

      /**
    function changeMode () {
      if (mode === 'samePitchRangePerLayer') {
        mode = 'ownPitchRange'
        document.getElementById('icicleMode').innerText = mode
      } else if (mode === 'samePitchRangeOverall') {
        mode = 'samePitchRangePerLayer'
        document.getElementById('icicleMode').innerText = mode
      } else {
        mode = 'samePitchRangeOverall'
        document.getElementById('icicleMode').innerText = mode
      }
      once = false
      that.render()
    }

    function changeModeRect () {
      if (modeRect === 'Rolls') {
        modeRect = 'Line'
        // document.getElementById('icicleModeRect').innerText = modeRect
      } else {
        modeRect = 'Rolls'
        // document.getElementById('icicleModeRect').innerText = modeRect
      }
      once = false
      that.render()
    }
    */
      /**
    function changeModeDiff () {
      if (modelUsedFlag) {
        modelUsedFlag = false
        document.getElementById('icicleModeDiff').innerText = 'ModelDifferentiation'
      } else {
        modelUsedFlag = true
        document.getElementById('icicleModeDiff').innerText = 'noModelDifferentiation'
      }
      once = false
      that.render()
    }
    */

      function resizeByWheel (e) {
        if (once && e.ctrlKey) {
          once = false
          e.preventDefault()
          scale = Math.max(Math.min(scale + (e.deltaY / 100), 14), 1)
          that.render()
        }
      }

      try {
        document.getElementById('icicleTab').className = toggleState === 1 ? 'button tabs active-tabs' : 'button tabs'
        document.getElementById('sankeyTab').className = toggleState === 2 ? 'button tabs active-tabs' : 'button tabs'
      } catch (e) {

      }
      try {
        return (
          <div>
            <div className='container'>
              {/** <div className="bloc-tabs">
                    <button
                      id="icicleTab"
                      className="button tabs active-tabs"
                      onClick={() => {toggleState=1; that.render()}}
                    >
                      Icicle
                    </button>
                    <button
                      id="sankeyTab"
                      className="button tabs"
                      onClick={() => {toggleState=2; that.render()}}
                    >
                      Node-Link
                    </button>
                    <select className="button tabsort" id="metric" onChange={(value) => {metric = parseInt(document.getElementById("metric").value); sorted=true; that.render()}}>
                      <option key={0} value={0}>Similarity desc</option>
                      <option key={5} value={5}>Similarity asc</option>
                      <option key={1} value={1}>Temperature desc</option>
                      <option key={2} value={2}>Temperature asc</option>
                      <option key={3} value={3}>Variance of jumps desc</option>
                      <option key={4} value={4}>Variance of jumps asc</option>
                      <option key={6} value={6}>Normal Relationships</option>
                    </select>
                  </div> */}
              <div width={widthdiv} height={heightBox} style={{ height: heightBox + 'px', width: widthdiv + 'px', overflow: 'hidden' }} className='content-tabs viewDiv'>
                <AppBar position='static' sx={{ backgroundColor: 'toolbar.main' }}>
                  <Toolbar variant='dense' sx={{ backgroundColor: 'toolbar.main', height: heightBox * 0.025 }}>
                    <Typography color='secondary'>Icicle</Typography>
                    <Box sx={{ flexGrow: 6 }} />
                    <Tooltip title='Different y-axis scales' placement='left'>
                      <Select
                        label='icicleMode' color='primary' variant='standard' autoWidth
                        sx={{
                          width: 200,
                          color: 'text.main',
                          minWidth: 172,
                          '& .MuiSvgIcon-root': {
                            color: 'text.main'
                          }
                        }}
                        defaultValue={mode}
                        onChange={e => { mode = e.target.value; once = false; that.render() }}
                      >
                        <MenuItem key={0} value='samePitchRangePerLayer'>samePitchRangePerLayer</MenuItem>
                        <MenuItem key={1} value='ownPitchRange'>ownPitchRange</MenuItem>
                        <MenuItem key={2} value='samePitchRangeOverall'>samePitchRangeOverall</MenuItem>
                      </Select>
                    </Tooltip>
                    <Box sx={{ flexGrow: 6 }} />
                    <IconButton onClick={() => closeView(0, false)} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                      <CloseIcon color='secondary' />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <div width={widthdiv} height={heightdiv} style={{ marginTop: '7px', height: heightdiv + 'px', width: widthdiv + 'px', overflow: 'auto' }}>
                  <svg className='noview' id='icicle' />
                </div>
                <svg className='noview' id='selectOfIce' />
                {/* <button className='button' id='icicleMode' onClick={changeMode}>samePitchRangePerLayer</button> */}
                {/* <button className='button' id='icicleModeRect' onClick={changeModeRect}>Rolls</button> */}
                {/* <FormControlLabel control={<Switch onClick={() => { changeModeRect() }} />} label='Blocks' labelPlacement='bottom' /> */}
                {/* <button className="button" id="icicleModeDiff" onClick={changeModeDiff}>noModelDifferentiation</button>
                */}
                {/**
              <Tooltip title='Colors to differentiate models' placement='top'>
                <FormControlLabel control={<Switch onClick={() => { modelUsedFlag = !modelUsedFlag; that.render() }} />} label='Model Differentiation' labelPlacement='bottom' />
              </Tooltip>
              */}
              </div>
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
export default IcicleRolls
