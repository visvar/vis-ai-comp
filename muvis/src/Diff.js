import React from 'react'
import * as d3 from 'd3'
import * as druid from '@saehrimnir/druidjs'
import * as mvlib from 'musicvis-lib'

const margin = { top: 30, right: 30, bottom: 30, left: 30 }
let loaded = false

class DiffChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = { ...this.state }
    loaded = false
  }

  componentDidMount () {
    loaded = true
    // this.render();
  }

  render () {
    const width = this.props.width
    const height = this.props.height

    const data = this.props.data
    const ai = this.props.data.ai
    const color = this.props.data.color
    const temp = this.props.data.temp

    const notes = this.props.data.notes
    let rec_1 = this.props.rec1
    let rec_2 = this.props.rec2

    if (rec_1 === '') { rec_1 = -1 }
    if (rec_2 === '') { rec_2 = -1 }

    const mel = []

    const ydiff = 25
    const yExtent = [-ydiff, ydiff]

    window.onload = function () {
      loaded = true
    }

    // DiffCode
    if (loaded) {
      function data_length (data) {
        let result = 0
        data.length !== 0 ? data.forEach(obj => obj.quantizedEndStep > result ? result = obj.quantizedEndStep : null) : result = 0
        return result
      }

      function transformRec (rec) {
        const rec_new = []
        let min = data_length(rec)
        rec.forEach((note) => {
          note.quantizedStartStep < min ? min = note.quantizedStartStep : min = min
        })
        rec.forEach((note) => {
          rec_new.push({
            pitch: note.pitch,
            quantizedStartStep: note.quantizedStartStep - min,
            quantizedEndStep: note.quantizedEndStep - min
          })
        })
        return rec_new
      }

      function pitch_invariant (rec) {
        const rec_new = []
        const mosti = []
        const mostv = []
        rec.forEach((note) => {
          if (!mosti.includes(note.pitch)) {
            mosti.push(note.pitch)
            mostv.push(0)
          } else {
            mostv[mosti.indexOf(note.pitch)]++
          }
        })
        const most = mosti[mostv.indexOf(Math.max(...mostv.reverse()))]
        rec.forEach((note) => {
          rec_new.push({
            pitch: note.pitch - most,
            quantizedStartStep: note.quantizedStartStep,
            quantizedEndStep: note.quantizedEndStep
          })
        })
        return rec_new
      }

      function pitch_diff (rec) {
        const rec_new = []
        let prev = 0
        rec.forEach((note) => {
          prev !== 0
            ? rec_new.push({
                pitch: note.pitch - prev.pitch,
                quantizedStartStep: note.quantizedStartStep,
                quantizedEndStep: note.quantizedEndStep
              })
            : rec_new.push({
              pitch: 0,
              quantizedStartStep: note.quantizedStartStep,
              quantizedEndStep: note.quantizedEndStep
            })
          prev = note
        })
        return rec_new
      }

      function getDist_single (max) {
        const dist_ges = []
        let j = 0
        notes.forEach((rec) => {
          const rec1 = pitch_diff(transformRec(rec))
          const dist = []
          const melo = []
          let changed = false
          for (var i = 0; i < max; i++) {
            changed = false
            var note1 = 0
            rec1.forEach((note) => {
              if (note.quantizedStartStep <= i && note.quantizedEndStep > i) {
                changed = true
                note1 = note.pitch
              }
            })
            if (changed) {
              dist.push(-note1)
              melo.push(j)
            } else {
              dist.push(-2000)
              melo.push(0)
            }
          }
          dist_ges.push(dist)
          mel.push(melo)
          j++
        })
        return dist_ges
      }

      function getDist () {
        const rec1 = pitch_diff(transformRec(notes[rec_1]))

        const rec2 = pitch_diff(transformRec(notes[rec_2]))

        const max = Math.max(data_length(rec1), data_length(rec2))
        const dist = [[]]
        const melo = []
        let changed = [false, false]
        for (var i = 0; i < max; i++) {
          changed = [false, false]
          var note1 = 0
          var note2 = 0
          rec1.forEach((note) => {
            if (note.quantizedStartStep <= i && note.quantizedEndStep > i) { note1 = note.pitch }
            changed[0] = true
          })
          rec2.forEach((note) => {
            if (note.quantizedStartStep <= i && note.quantizedEndStep > i) { note2 = note.pitch }
            changed[1] = true
          })
          if (changed[0] || changed[1]) {
            if (changed[0] && changed[1]) {
              if (Math.abs(note1) - Math.abs(note2) > 0) {
                dist[0].push(note2 - note1)
                melo.push(rec_1)
              } else {
                dist[0].push(note1 - note2)
                melo.push(rec_2)
              }
            } else if (changed[0]) {
              dist[0].push(1000)
              melo.push(rec_1)
            } else {
              dist[0].push(-1000)
              melo.push(rec_2)
            }
          } else {
            dist[0].push(-2000)
            melo.push(0)
          }
        }
        mel.push(melo)
        return dist
      }

      function getPoints (dist) {
        const points = []
        for (var i = 0; i < dist.length; i++) {
          const point = []
          for (var j = 0; j < dist[i].length; j++) {
            point.push([j, dist[i][j]])
          }
          points.push(point)
        }

        const xExtent = [0, dist[0].length]// d3.extent(points, (d) => d[0]);
        // const yExtent = d3.extent(points, (d) => d[1]);

        // const yExtent = [-20,20];

        const scaleX = d3
          .scaleLinear()
          .domain(xExtent)
          .range([margin.left, width - margin.right])
        const scaleY = d3
          .scaleLinear()
          .domain(yExtent)
          .range([margin.top, height - margin.top - 10])

        for (var i = 0; i < dist.length; i++) {
          for (var j = 0; j < dist[i].length; j++) {
            points[i][j] = [scaleX(j), scaleY(dist[i][j])]
          }
        }
        return points
      }

      function getColors (dist) {
        const colors = []
        for (let i = 0; i < dist.length; i++) {
          const color1 = []
          for (let j = 0; j < dist[i].length; j++) {
            let c = 'white'
            if (dist[i][j] === 0) {
              c = 'grey'
            } else if (dist[i][j] !== -2000) {
              if (!single) {
                c = color[mel[i][j]] // with colors of pianoroll
              } else {
                temp[i] > 0 ? c = v(co(temp[i])) : c = 'black'// with tempcolor
              }
            }
            color1.push(c)
          }
          colors.push(color1)
        }
        return colors
      }

      if (notes.length > 0 && rec_1 > -1 && rec_2 > -1 && rec_1 < notes.length && rec_2 < notes.length) {
        var single = true
        if (rec_1 !== rec_2) {
          var dist = getDist()
          single = false
        } else {
          let max = 0
          notes.forEach((note) => {
            const dat = data_length(transformRec(note))
            max < dat ? max = dat : max = max
          })
          var dist = getDist_single(max)
          single = true
        }

        var co = d3.scaleLinear()
          .domain([0.2, 1.8])
        // .range(["blue", "red"])

        var v = (val) => d3.interpolateViridis(val)

        const points = getPoints(dist)
        const colours = getColors(dist, single)
        // console.log(colours);
        /* var points = [[0.7071067811865476, 0.7071067811865475],
                        [0.12391705374312639, 0.18821745668215994],
                        [-0.7071067811865476, -0.7071067811865475]];
          */

        const canvas = document.getElementById('diffcanvas')
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)

        context.textAlign = 'center'

        /*
          var points= [];
          var points = [];
          var ind = 0;
          for (const [point,color] of fullItems.entries()) {
            const point2 = point.point;
            var x = scaleX(point2[0]);
            var y = scaleY(point2[1]);
            if(isNaN(x)&&isNaN(y)){
              x=width/2;
              y=height/2;
            }
            points.push(x);
            points.push(y);
          }
          */

        // const yExtent = d3.extent(points, (d) => d[1]);

        const scaleY = d3
          .scaleLinear()
          .domain(yExtent)
          .range([margin.top, height - margin.top - 10])

        context.strokeStyle = 'rgba(0,0,0,1)'
        context.fillStyle = 'rgba(0,0,0,1)'
        context.beginPath()
        context.moveTo(20, scaleY(yExtent[0]))
        context.lineTo(20, scaleY(yExtent[1]))
        context.moveTo(width - 20, scaleY(yExtent[0]))
        context.lineTo(width - 20, scaleY(yExtent[1]))
        context.stroke()
        for (var i = yExtent[0]; i <= yExtent[1]; i++) {
          context.beginPath()
          context.moveTo(20, scaleY(i))
          context.lineTo(25, scaleY(i))
          context.stroke()
          if (i % 5 === 0) {
            context.fillText(-i, 10, scaleY(i + 0.4))
            context.beginPath()
            context.strokeStyle = 'rgba(0,0,0,0.2)'
            context.moveTo(25, scaleY(i))
            context.lineTo(width - 20, scaleY(i))
            context.stroke()
            context.strokeStyle = 'rgba(0,0,0,1)'
          }
        }
        // context.stroke();

        for (var i = 0; i < points.length; i++) {
          for (var j = 0; j < points[i].length; j++) {
            context.beginPath()
            context.strokeStyle = colours[i][j]
            if (j === 0) {
              context.moveTo(points[i][j][0], points[i][j][1])
            } else {
              if (colours[i][j - 1] !== 'grey' && colours[i][j] === 'grey' || colours[i][j - 1] === 'white') {
                context.strokeStyle = colours[i][j - 1]
              }
              context.moveTo(points[i][j - 1][0], points[i][j - 1][1])
              context.lineTo(points[i][j][0], points[i][j][1])
            }
            context.stroke()
          }
        }

        for (var i = 0; i < points.length; i++) {
          for (var j = 0; j < points[i].length; j++) {
            context.strokeStyle = colours[i][j]
            context.fillStyle = colours[i][j]
            mvlib.Canvas.drawFilledCircle(context, points[i][j][0], points[i][j][1], 5)
          }
        }
      }
    }
    return (
      <div>
        <canvas width={width} height={height} id='diffcanvas' />
      </div>

    )
  }
}
export default DiffChart
