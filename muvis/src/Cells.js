import React from 'react'
import * as d3 from 'd3'
import * as Plot from '@observablehq/plot'
import { color, scaleBand } from 'd3'

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

const margin = { top: 30, right: 30, bottom: 30, left: 30 }
let loaded = false
const axis = { pmin: 120, pmax: 0, lmin: 1, lmax: 0 }
let mode = 'log'
let that

class CellChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = { ...this.state }
    loaded = false
  }

  componentDidMount () {
    loaded = true
    that = this
    // this.render();
  }

  render () {
    d3.select('#cellsvg').selectAll('*').remove()

    const width = this.props.width
    const height = this.props.height
    const data = this.props.data
    const notes = data.notes
    const colors = data.color
    const temp = data.temp
    const temprang = this.props.temprange

    let svg
    const sqrt = 3

    if (loaded && notes.length > 0) {
      const temprange = d3.scaleLinear().domain([temprang.min, temprang.max]).range([1, 8])

      function newDefault (pmin, pmax, lmin, lmax) {
        const melotemp = []
        for (let i = pmax; i >= pmin; i--) {
          for (let j = lmin; j <= lmax; j++) {
            const notetemp = { pitch: i, length: j, occurance: 0 }
            melotemp.push(notetemp)
          }
        }
        return melotemp
      }

      function getLabelPitch (val) {
        const note = MIDI_NOTES.find(obj => {
          return obj.pitch === val
        })
        if (note !== undefined) { return note.label }
        return ''
      }

      function run (melo1, divide, ind, sizemax) {
        let melotemp = []
        let melo = []
        if (ind === 0) {
          for (var i = 0; i < melo1.length; i++) {
            melo = melo.concat(melo1[i])
          }
        } else if (ind > 0) {
          for (var i = 0; i < melo1.length; i++) {
            if (Math.round(temprange(temp[i])) === ind) {
              melo = melo.concat(melo1[i])
            }
          }
        }

        if (melo.length > 0 && melo !== undefined) {
          melotemp = newDefault(axis.pmin, axis.pmax, axis.lmin, axis.lmax)
          // var melotemp1 = newDefault(40,89,1,32);
          let length1 = 0
          /* var occ = true;
            for(var i=0;i<melo.length;i++){
              occ = false;
              length = melo[i].quantizedEndStep-melo[i].quantizedStartStep;
              melotemp.forEach((d)=>{
                if(d.pitch===melo[i].pitch&&d.length===length){
                  d.occurance = d.occurance + 1;
                  occ=true;
                }
              })
              if(!occ){
                var notetemp = {pitch:melo[i].pitch, length:length, occurance:1};
                melotemp.push(notetemp)
              }
            }
            */
          for (var i = 0; i < melo.length; i++) {
            length1 = melo[i].quantizedEndStep - melo[i].quantizedStartStep
            const index = (Math.abs(melo[i].pitch - axis.pmax) * axis.lmax) + length1 - 1
            if (melotemp[index] === undefined) {
              melotemp[index] = { pitch: melo[i].pitch, length: length1, occurance: 1 }
            } else {
              melotemp[index].occurance++
            }
          }
        }
        return Plot.plot({
          height: (height / divide) - margin.top,
          width: (width / divide) - margin.left,
          marginTop: margin.top * 1.4,
          padding: 0.05,
          grid: true,
          // style: {color:colors[ind]},
          x: {
            axis: 'top',
            label: getLabel(ind, sizemax), // temp[ind]>0?"Temperature: "+temp[ind].toFixed(1):"",
            tickFormat: (e) => { if (e % 4 === 0 || e === 1) { return e } }
          },
          y: {
            label: 'Pitch',
            reverse: 'true',
            tickFormat: (t) => { if (t % 12 === 0 || t % 12 === 2 || t % 12 === 4 || t % 12 === 7 || t % 12 === 9) { return getLabelPitch(t) } }
          },
          color: {
            scheme: 'blues',
            type: mode
          },
          marks: [
            Plot.cell(melotemp, {
              x: 'length',
              y: 'pitch',
              fill: 'occurance',
              fillOpacity: 'occurance'
            }),
            Plot.text(melotemp, {
              x: 'length',
              y: 'pitch',
              fill: 'white',
              text: d => {
                if (d.occurance !== 0) {
                  return d.occurance
                }
              },
              title: 'title',
              fontSize: 6
            })
          ]
        })
      }

      function getLabel (ind, sizemax) {
        if (ind === 0) {
          return 'All in One'
        } else {
          const size = (temprang.max - temprang.min) / sizemax
          let min = temprang.min + size * (ind - 1) // (temp[1]*ind)
          min = parseFloat(min.toFixed(2))
          let max = temprang.min + size * (ind) // (((temp[temp.length-1]-temp[1])/8)+temp[1]*ind)
          max = parseFloat(max.toFixed(2))
          return ind === sizemax ? 'Temperature: ' + min + ' to ' + max : 'Temperature: ' + min + ' to <' + max
        }
      }

      function getMinMax (note) {
        note.forEach((d) => {
          if (axis.pmin > d.pitch) { axis.pmin = d.pitch }
          if (axis.pmax < d.pitch) { axis.pmax = d.pitch }
          if (axis.lmax < d.quantizedEndStep - d.quantizedStartStep) { axis.lmax = d.quantizedEndStep - d.quantizedStartStep }
        })
      }

      for (var i = 0; i < notes.length; i++) {
        getMinMax(notes[i])
      }

      for (var i = 0; i < 9; i++) {
        svg = run(notes, sqrt, i, 8)
        document.getElementById('cellsvg').appendChild(svg)
      }
    }

    function changeMode () {
      if (mode === 'log') {
        mode = 'linear'
        document.getElementById('cellMode').innerText = mode
      } else {
        mode = 'log'
        document.getElementById('cellMode').innerText = mode
      }
      that.render()
    }

    return (
      <div>
        <div width={width} height={height} id='cellsvg' />
        <button className='button' id='cellMode' onClick={changeMode}>log</button>
      </div>
    )
  }
}
export default CellChart
