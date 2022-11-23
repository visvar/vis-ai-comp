import React from 'react'
import * as d3 from 'd3'
import * as mvlib from 'musicvis-lib'
import Select from 'react-select'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
// import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const marginWindow = { top: 30, right: 20, bottom: 30, left: 30 }
const marginBox = 20 // 50
let selectedAxis = []
let loaded = false

let offset = 170

const colorTemp = true

let indexx = -1
let indexy = -1

const options = [
  { key: 0, value: 0, label: 'Mean duration of notes', shortlabel: 'md' },
  { key: 1, value: 1, label: 'Variance of intervals', shortlabel: 'var' },
  { key: 2, value: 2, label: 'Similarity to seed', shortlabel: 'sim' },
  { key: 3, value: 3, label: 'Distinct pitches', shortlabel: 'dp' },
  { key: 4, value: 4, label: 'Range of pitches', shortlabel: 'rp' },
  { key: 5, value: 5, label: 'Temperature', shortlabel: 'tmp' },
  { key: 6, value: 6, label: 'Number noteshapes from composition', shortlabel: 'shp' }
]

class ScatterChooseChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      select: {
        value: null, // "One" as initial value for react-select
        options // all available options
      }
    }

    loaded = false
  }

  componentDidMount () {
    loaded = true
    this.render()
  }

  setValue (value) {
    value.forEach((d, i) => {
      if (i === 0) { indexx = d.value }
      if (i === 1) { indexy = d.value }
    })
    this.setState(prevState => ({
      select: {
        ...prevState.select,
        value
      }
    }))
  };

  handleChange (value) {
    this.setValue(value)
  };

  render () {
    try {
      const heightBoxOut = this.props.height + marginBox
      const widthBox = this.props.width - marginWindow.right
      const numViews = this.props.partialGrid
      const closeView = this.props.closeView

      const heightToolbar = heightBoxOut * 0.045

      const heightBox = heightBoxOut - heightToolbar

      function getOptimalSize (h, w, numViews) {
        if (w > h) {
          if (w / 2 < h) {
            if (numViews === 2) {
              return w * 0.55
            }
            return w * 0.6
          } else {
            return h
          }
        } else {
          if (numViews === 4) {
            return w
          } else {
            if (numViews === 2) {
              return h / 2
            }
            return h * 3 / 5
          }
        }
      }

      const squarePlot = getOptimalSize(heightBox - marginBox - 30, widthBox, numViews)
      const widthPlot = squarePlot
      const heightPlot = squarePlot

      const matrixSquare = numViews > 1 ? Math.max(heightBox - 5 - squarePlot, widthBox - squarePlot) : squarePlot * 0.8

      const notes = this.props.data.notes
      const parent = this.props.data.parent
      const temperature = this.props.data.temp
      const color = this.props.data.color
      const modelUsed = this.props.data.modelUsed
      const that = this
      const darkmode = this.props.darkmode
      const display = this.props.display

      const { select } = this.state

      selectedAxis = select.value

      if (numViews > 1) {
        offset = 0
      } else {
        offset = 170
      }

      function getMeanLength (data) {
        let total = 0
        let lengths = 0
        data.forEach((d) => {
          lengths = lengths + d.quantizedEndStep - d.quantizedStartStep
          total++
        })
        return lengths !== 0 ? lengths / total : 0
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

      function calcVariance (notesi) {
        if (notesi.length > 0) {
          const newnotes = pitchDiff(notesi)
          newnotes[0].pitch = 0
          const variance = d3.variance(newnotes, d => d.pitch)
          return !isNaN(variance) ? variance : 0
        } else {
          return 0
        }
      }

      function distinctPitches (notesi) {
        const distinct = new Set(notesi.map(note => note.pitch))
        return distinct.size
      }

      function rangePitches (notesi) {
        const pitches = notesi.map(note => note.pitch)
        const range = Math.max(...pitches) - Math.min(...pitches)
        return range
      }

      function numOfShapes (notesi, comp, index) {
        let shape = []
        let num = 0
        for (let i = 0; i < notesi.length - 2; i++) {
          shape = [notesi[i].pitch - notesi[i + 1].pitch, notesi[i + 1].pitch - notesi[i + 2].pitch]
          if (comp.has(JSON.stringify(shape))) {
            num++
          }
        }
        return index !== 0 ? num : num
      }

      function shapesOfComposition (comp) {
        const shapes = []
        for (let i = 0; i < comp.length - 2; i++) {
          shapes.push(JSON.stringify([comp[i].pitch - comp[i + 1].pitch, comp[i + 1].pitch - comp[i + 2].pitch]))
        }
        return new Set(shapes)
      }

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

      function transformRec (rec, steps) {
        let recNew = []
        let min = dataLength(rec)
        let max = 0
        rec.forEach((note) => {
          if (note.quantizedStartStep < min) {
            min = note.quantizedStartStep
          }
          if (note.quantizedEndStep > max) {
            max = note.quantizedEndStep
          }
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
          let note1, note2
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

      function calcPointsFromAxis (selectedAxis) {
        const points = []
        let comp
        points.push([])
        points.push([])
        selectedAxis.forEach((value, index) => {
          if (value.value === 6 && notes[0] !== undefined) {
            comp = shapesOfComposition(notes[0])
          }
          notes.forEach((seq, seqindex) => {
            if (seqindex !== 0) {
              let datanumber = 0
              // mean duration
              if (value.value === 0) {
                datanumber = getMeanLength(seq)
              } else if (value.value === 1) { // variance of intervals
                datanumber = calcVariance(seq)
              } else if (value.value === 2) {
                datanumber = distanceFunction(seq, notes[parent[seqindex]], 1)
              } else if (value.value === 3) {
                datanumber = distinctPitches(seq)
              } else if (value.value === 4) {
                datanumber = rangePitches(seq)
              } else if (value.value === 5) {
                datanumber = temperature[seqindex]
                if (datanumber < 0) { datanumber = 0 }
              } else if (value.value === 6) {
                datanumber = numOfShapes(seq, comp, seqindex)
              }
              points[index].push(datanumber)
            }
          })
        })
        return points
      }

      // other code
      const margin = { top: 20, right: 15, bottom: 60, left: 70 }
      const outerWidth = widthPlot
      const outerHeight = heightPlot
      const width = outerWidth - margin.left - margin.right
      const height = outerHeight - margin.top - margin.bottom
      // const posl = 10// (widthBox-outerWidth)/7

      const container = d3.select('.scatter-container')
        .style('position', 'relative')
        .style('text-align', 'left')
      // .style("margin-left",posl+"px")
        .style('width', outerWidth)
        .style('height', outerHeight)

      if (loaded && display) {
        function createMatrix () {
          function correlationCoefficient (X, Y, n) {
            let sumX = 0; let sumY = 0; let sumXY = 0
            let squareSumX = 0; let squareSumY = 0

            for (let i = 0; i < n; i++) {
            // Sum of elements of array X.
              sumX = sumX + X[i]

              // Sum of elements of array Y.
              sumY = sumY + Y[i]

              // Sum of X[i] * Y[i].
              sumXY = sumXY + X[i] * Y[i]

              // Sum of square of array elements.
              squareSumX = squareSumX + X[i] * X[i]
              squareSumY = squareSumY + Y[i] * Y[i]
            }

            // Use formula for calculating correlation
            // coefficient.
            const corr = (n * sumXY - sumX * sumY) /
                            (Math.sqrt((n * squareSumX -
                                    sumX * sumX) *
                                        (n * squareSumY -
                                    sumY * sumY)))

            return corr
          }

          const mcontainer = d3.select('#mat-container')
          const squareSize = matrixSquare

          const row = numViews < 2 ? options.map(x => x.label) : options.map(x => x.shortlabel)
          const col = options.map(x => x.shortlabel)

          const val = new Array(row.length).fill(0).map(() => new Array(row.length).fill(0))

          val.forEach((e, i) => {
            e.forEach((r, j) => {
              const points = calcPointsFromAxis([{ value: i }, { value: j }])
              val[i][j] = correlationCoefficient(points[0], points[1], points[0].length)
            })
          })

          const legend = mcontainer.append('canvas')
            .attr('id', 'matrixcan')
            .attr('width', squareSize + offset)
            .attr('height', 40)
            .style('position', 'relative')
            .style('margin-left', numViews > 3 ? (width - squareSize) / 2 + 'px' : '0px')

          const matrix = mcontainer.append('canvas')
            .attr('id', 'matrixcan')
            .attr('class', 'pointer')
            .attr('width', squareSize + offset)
            .attr('height', squareSize)
            .style('position', 'relative')
            .style('margin-left', numViews > 3 ? (width - squareSize) / 2 + 'px' : '0px')

          if (legend !== null) { createLegend(legend, squareSize + offset, 40) }
          if (matrix !== null) { clickableTable(matrix, row, col, val, squareSize + offset, squareSize, undefined, 'auto') }

          function createLegend (
            canvas,
            width,
            height,
            scaleColor = (d) => {
              const scale = d3.scaleLinear()
                .domain([0, 2])
                .range([0, 1])
              return !isNaN(d) ? d3.interpolateRdBu(scale(d)) : d3.interpolateRdBu(scale(0))
            }
          ) {
            const context = canvas.node().getContext('2d')
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            const padding = (width / 3) / 7
            const cellWidth = (width / 3) - padding
            const cellSpace = (width / 3)

            const text = ['negative correlation', 'none', 'positive correlation']

            for (let i = 0; i < 3; i++) {
              context.fillStyle = scaleColor(i)
              context.fillRect((i * cellSpace) + (padding / 2), 0, cellWidth - (padding / 2), 40)
              context.fillStyle = i === 1 ? 'black' : 'white'
              context.font = '18px Roboto'
              context.fillText(text[i], (i * cellSpace) + ((cellWidth + padding / 2) / 2), 20)
            }
          }

          // clickableTable(matrix)
          function clickableTable (
            canvas,
            rows,
            cols,
            values,
            w,
            h,
            scaleColor = (d) => {
              const scale = d3.scaleLinear()
                .domain([-1, 1])
                .range([0, 1])
              return !isNaN(d) ? d3.interpolateRdBu(scale(d)) : d3.interpolateRdBu(scale(0))
            },
            drawText = 'auto' // true, false, "auto",
          ) {
          // Initial value, can be interpreted as a selection of all or none of the cells, as you like
          // Small margin, makes highlight boxes look better
            const W = w - 2 - offset
            const H = h - 2
            const cellHeight = H / (rows.length + 2)
            const cellWidth = W / (cols.length + 2)
            const padding = cellWidth / 7

            if (drawText === 'auto') {
              drawText = Math.min(cellWidth, cellHeight) > 25
            }

            canvas.on('click', (e, d, i) => {
              const x = e.offsetX
              const y = e.offsetY
              indexx = Math.floor((x - offset) / (cellWidth + (padding / 2))) - 1
              indexy = Math.floor(y / (cellHeight + (padding / 2))) - 1
              const selection = options.filter(x => { return (x.value === indexx || x.value === indexy) })
              if (selection.length === 2) {
                selectedAxis = selection
                that.handleChange(selection)
              }
            })
            const context = canvas.node().getContext('2d')

            function drawTable () {
              function shadowRect (ctx, x, y, w, h, repeats, color) {
              // set stroke & shadow to the same color
                ctx.strokeStyle = color
                ctx.shadowColor = color
                // set initial blur of 3px
                ctx.shadowBlur = 3
                // repeatedly overdraw the blur to make it prominent
                for (let i = 0; i < repeats; i++) {
                // increase the size of blur
                  ctx.shadowBlur += 0.25
                  // stroke the rect (which also draws its shadow)
                  ctx.strokeRect(x, y, w, h)
                }
                // cancel shadowing by making the shadowColor transparent
                ctx.shadowColor = 'rgba(0,0,0,0)'
                // restroke the interior of the rect for a more solid colored center
                ctx.lineWidth = 3
                ctx.strokeRect(x + 3, y + 3, w - 6, h - 6)
              }
              // White background, better when saving as file or with dark themes
              context.fillStyle = darkmode === 'LightMode' ? 'white' : '#333'
              context.fillRect(0, 0, w, h)

              context.fillStyle = darkmode === 'LightMode' ? 'white' : '#333'
              context.strokeStyle = darkmode === 'LightMode' ? 'black' : 'white'
              context.textAlign = 'start'
              context.textBaseline = 'middle'

              // Labels

              if (drawText === true) {
                for (const [r, row] of rows.entries()) {
                  const x = 0
                  const y = (r + 1) * (cellHeight + (padding / 2))
                  // context.fillStyle = darkmode === 'LightMode' ? '#eee' : '#777'
                  // context.fillRect(x, y, cellWidth - (padding / 2), cellHeight - (padding / 2))
                  context.fillStyle = darkmode === 'LightMode' ? 'black' : 'white'
                  context.font = '19px Roboto'
                  let rowt = row
                  if (rowt === 'Number noteshapes from composition') {
                    rowt = 'Number noteshapes'
                  }
                  context.fillText(rowt, x + (cellWidth - (padding / 2)) / 2, y + (cellHeight - (padding / 2)) / 2)
                }
                context.textAlign = 'center'
                for (const [c, col] of cols.entries()) {
                  const x = ((c + 1) * (cellWidth + (padding / 2))) + offset
                  const y = 0
                  // context.fillStyle = darkmode === 'LightMode' ? '#eee' : '#777'
                  // context.fillRect(x, y, cellWidth - (padding / 2), cellHeight - (padding / 2))
                  context.fillStyle = darkmode === 'LightMode' ? 'black' : 'white'
                  context.font = '19px Roboto'
                  context.fillText(col, x + (cellWidth - (padding / 2)) / 2, y + (cellHeight - (padding / 2)) / 2)
                }

                // Cells
                for (const [r] of rows.entries()) {
                  for (const [c] of cols.entries()) {
                    const x = (c + 1) * (cellWidth + (padding / 2)) + offset
                    const y = (r + 1) * (cellHeight + (padding / 2))
                    const fillColor = scaleColor(values[r][c], r, c)
                    if ((indexx === r && indexy === c) || (indexx === c && indexy === r)) {
                      context.globalAlpha = 1
                      shadowRect(context, x, y, cellWidth - (padding / 2), cellHeight - (padding / 2), 5, '#a3a3a3')
                    } else {
                      context.globalAlpha = 0.3
                    }
                    context.fillStyle = fillColor
                    context.fillRect(x, y, cellWidth - (padding / 2), cellHeight - (padding / 2))
                    context.restore()
                    /**
                if (drawText === true && false) {
                  // Make text white or black, depending on fill color's lightness
                  if (values[r][c] > 0.5) {
                    context.fillStyle = 'white'
                  } else {
                    context.fillStyle = 'black'
                  }
                  context.fillText(values[r][c], x + cellWidth / 2, y + cellHeight / 2)
                }
                */
                  }
                }
              }
            }
            drawTable()

            return canvas
          }
        }
        d3.select('#mat-container').selectAll('*').remove()
        createMatrix()

        if (loaded && select.value !== null && select.value.length === 2 && display) {
          const points = calcPointsFromAxis(selectedAxis)

          d3.select('.scatter-container').selectAll('.plot').remove()
          // d3.select("#mat-container").selectAll("*").remove()

          // Init SVG
          const svgChart = container.append('svg', '#matrixcan')
            .attr('width', outerWidth)
            .attr('height', outerHeight)
            .attr('class', 'svg-plot plot')
          // .style("position", "absolute")
            .style('position', 'absolute')
          // .style("left",posl)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .on('click', (e) => { e.preventDefault(); if (e.altKey) { rerender() } })

          // Init Canvas
          const canvasChart = container.append('canvas', '#matrixcan')
          // .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr('width', width)
            .attr('height', height)
            .style('margin-left', margin.left + 'px')
            .style('margin-top', margin.top + 'px')
            .style('margin-right', margin.right + 'px')
            .style('margin-bottom', margin.bottom + 'px')
            .style('position', 'absolute')
            .attr('class', 'canvas-plot plot')

          d3.select('.canvas-plot').lower()
          d3.select('.svg-plot').raise()

          const context = canvasChart.node().getContext('2d')

          const minx = Math.min(...points[0])
          const maxx = Math.max(...points[0])
          const miny = Math.min(...points[1])
          const maxy = Math.max(...points[1])
          const marginx = (maxx - minx) * 0.05
          const marginy = (maxy - miny) * 0.05

          const x = d3.scaleLinear()
            .domain([minx - marginx, maxx + marginx])
            .range([0, width])
            .nice()

          const y = d3.scaleLinear()
            .domain([maxy + marginy, miny - marginy])
            .rangeRound([0, height])
            .nice()

          // Init Axis
          const xAxis = d3.axisBottom(x)
          const yAxis = d3.axisLeft(y)

          svgChart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)

          svgChart.append('g')
            .call(yAxis)

          // Add labels
          svgChart.append('text')
            .attr('class', 'axisLabel')
            .attr('x', `-${height / 2}`)
            .attr('dy', '-3.5em')
            .attr('transform', 'rotate(-90)')
            .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
            .text(selectedAxis[1].label)
            .attr('id', 'labely')
            .each(function () {
              const thisWidth = this.getComputedTextLength()
              d3.select('#labely').attr('x', -(height / 2) - (thisWidth / 2))
            })

          svgChart.append('text')
            .attr('class', 'axisLabel')
            .attr('x', `${width / 2}`)
            .attr('y', `${height + 40}`)
            .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
            .text(selectedAxis[0].label)
            .attr('id', 'labelx')
            .each(function () {
              const thisWidth = this.getComputedTextLength()
              d3.select('#labelx').attr('x', (width / 2) - (thisWidth / 2))
            })

          const brush = d3.brush().extent([[0, 0], [width, height]])
            .on('end', (e) => { brushEndEvent(e, brushSvg, points) })

          const brushSvg = svgChart
            .append('g')
            .attr('className', 'brush')
            .attr('id', 'brush2d')
            .call(brush)

          for (let i = 0; i < points[0].length; i++) {
            if (!colorTemp) { context.fillStyle = modelUsed[i + 1] >= 0 ? d3.schemeTableau10[modelUsed[i + 1] % 10] : 'black' } else {
              context.fillStyle = color[i + 1]
            }
            // context.fillStyle = modelUsed[i+1]>=0?d3.schemeTableau10[modelUsed[i+1]%10]:"black"
            mvlib.Canvas.drawFilledCircle(context, x(points[0][i]), y(points[1][i]), 5)
          }

          function brushEndEvent (e, svg, points) {
            const s = e.selection
            if (s !== null) {
              const stroke = darkmode === 'LightMode' ? 'black' : 'white'
              context.strokeStyle = stroke
              mvlib.Canvas.drawRoundedRect(context, s[0][0], s[0][1], s[1][0] - s[0][0], s[1][1] - s[0][1], 0)
              context.stroke()
              createBoxplot(svgChart, context, calcPointsInSelection(s, points), s, stroke)
              svg.call(brush.move, null)
            }
          }

          function rerender () {
            context.clearRect(0, 0, width, height)

            for (let i = 0; i < points[0].length; i++) {
              if (!colorTemp) { context.fillStyle = modelUsed[i + 1] >= 0 ? d3.schemeTableau10[modelUsed[i + 1] % 10] : 'black' } else {
                context.fillStyle = color[i + 1]
              }
              mvlib.Canvas.drawFilledCircle(context, x(points[0][i]), y(points[1][i]), 5)
            }

            d3.selectAll('#box').remove()
          }

          function createBoxplot (svg, context, points, s, stroke) {
            if (points[0].length > 0) {
              const p0 = points[0]
              const p1 = points[1]
              const boxx = mvlib.Utils.getBoxplotCharacteristics(p0)
              const boxy = mvlib.Utils.getBoxplotCharacteristics(p1)

              const x = d3.scaleLinear()
                .domain([minx - marginx, maxx + marginx])
                .range([0, width])
                .nice()

              const y = d3.scaleLinear()
                .domain([maxy + marginy, miny - marginy])
                .rangeRound([0, height])
                .nice()

              const tsize = 15

              let center
              // draw boxplot y axis
              if (boxy.r0 < boxy.r1) {
                center = s[1][0] + 20
                if (center > width) { center = s[0][0] - 20 }
                svg.append('g')
                  .attr('id', 'box')
                  .append('line')
                  .attr('x1', center)
                  .attr('x2', center)
                  .attr('y1', y(boxy.r0))
                  .attr('y2', y(boxy.r1))
                  .attr('stroke', stroke)

                // Show the box
                svg.append('g')
                  .attr('id', 'box')
                  .append('rect')
                  .attr('x', center - tsize / 2)
                  .attr('y', y(boxy.q3))
                  .attr('height', (y(boxy.q1) - y(boxy.q3)))
                  .attr('width', tsize)
                  .attr('stroke', stroke)
                  .style('fill', '#69b3a2')

                // show median, min and max horizontal lines
                svg
                  .append('g')
                  .attr('id', 'box')
                  .selectAll('toto')
                  .data([boxy.r0, boxy.q2, boxy.r1])
                  .enter()
                  .append('line')
                  .attr('x1', center - tsize / 2)
                  .attr('x2', center + tsize / 2)
                  .attr('y1', function (d) { return (y(d)) })
                  .attr('y2', function (d) { return (y(d)) })
                  .attr('stroke', stroke)
              }
              if (boxx.r0 < boxx.r1) {
                // draw boxplot x axis
                center = s[1][1] + 20
                if (center > height - 15) { center = s[0][1] - 20 }

                svg
                  .append('g')
                  .attr('id', 'box')
                  .append('line')
                  .attr('y1', center)
                  .attr('y2', center)
                  .attr('x1', x(boxx.r0))
                  .attr('x2', x(boxx.r1))
                  .attr('stroke', stroke)

                // Show the box
                svg
                  .append('g')
                  .attr('id', 'box')
                  .append('rect')
                  .attr('y', center - tsize / 2)
                  .attr('x', x(boxx.q1))
                  .attr('width', (x(boxx.q3) - x(boxx.q1)))
                  .attr('height', tsize)
                  .attr('stroke', stroke)
                  .style('fill', '#69b3a2')

                // show median, min and max horizontal lines
                svg
                  .append('g')
                  .attr('id', 'box')
                  .selectAll('toto')
                  .data([boxx.r0, boxx.q2, boxx.r1])
                  .enter()
                  .append('line')
                  .attr('y1', center - tsize / 2)
                  .attr('y2', center + tsize / 2)
                  .attr('x1', function (d) { return (x(d)) })
                  .attr('x2', function (d) { return (x(d)) })
                  .attr('stroke', stroke)
              }
            }
          }

          function calcPointsInSelection (s, points) {
            const result = [[], []]
            for (let i = 0; i < points[0].length; i++) {
              if (x(points[0][i]) > s[0][0] && x(points[0][i]) < s[1][0] &&
                    y(points[1][i]) > s[0][1] && y(points[1][i]) < s[1][1]) {
                result[0].push(points[0][i])
                result[1].push(points[1][i])
              }
            }
            return result
          }
        }
      }
      const colourStyles = {
        option: (styles, { value, isFocused }) => {
          // const color = chroma(data.color);
          return {
            ...styles,
            backgroundColor: 'white',
            color: isFocused ? 'grey' : 'black'
          }
        },
        multiValue: (styles, { data }) => {
          return {
            ...styles,
            backgroundColor: '#eee'// color.alpha(0.2).css(),
          }
        }
      }
      return (
        <div className='viewDiv' width={widthBox} height={heightBoxOut} style={{ height: heightBoxOut + 'px', width: widthBox + 'px' }}>
          {/*
            <div style={{textAlign:"center"}}>
                <div id="cvscontainer" style={{display:"inline-block",width:seiteScatter+"px",height:seiteScatter+"px",overflow:"hidden"}}>
                    <canvas width={seiteScatter} height={seiteScatter} id="2Dcanvas"></canvas>
                </div>
            </div>
        */}
          <AppBar position='static' sx={{ backgroundColor: 'toolbar.main' }}>
            <Toolbar variant='dense' sx={{ backgroundColor: 'toolbar.main', height: heightToolbar }}>
              <Typography color='secondary'>Correlation</Typography>
              <Box sx={{ flexGrow: 12 }} />
              <IconButton onClick={() => closeView(3, false)} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                <CloseIcon color='secondary' />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div width={widthBox} height={heightBox} style={{ textAlign: 'center', justifyContent: 'space-between', height: heightBox + 'px', width: widthBox + 'px' }}>
            <div className='scatter-container' width={widthPlot} height={heightPlot} style={{ display: 'inline-block', height: heightPlot + 'px', width: widthPlot + 'px', position: 'relative' }}>
              <svg className='plot' width={widthPlot} height={heightPlot} />
            </div>
            <div id='mat-container' width={matrixSquare} height={matrixSquare} style={{ display: 'inline-block', height: matrixSquare + 'px', width: matrixSquare + 'px' }} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
            >
              <div style={{ width: Math.min(widthBox, 800) + 'px', display: 'none' }}>
                <Select
                  id='reactselect'
                  menuPlacement='auto'
                  menuPosition='fixed'
                  className='hover basic-multi-select' classNamePrefix='select'
                  isMulti
                  value={select.value}
                  onChange={this.handleChange}// e=>{selectedAxis = Array.isArray(e) ? e.map(x => x) : []; this.render()}}
                  options={select.options}
                  width='50%'
                  height='50px'
                  styles={colourStyles}
                />
              </div>
            </div>
          </div>
        </div>
      )
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
export default ScatterChooseChart
