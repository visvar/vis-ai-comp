import React from 'react'
import * as d3 from 'd3'
// import * as d3r from 'd3-regression'
import * as druid from '@saehrimnir/druidjs/dist/druid.esm.js'
import * as mvlib from 'musicvis-lib'
import createPanZoom from 'panzoom'
// import * as Plot from '@observablehq/plot'
import * as hagrid from '@saehrimnir/hagrid'
import * as mm from '@magenta/music'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import Container from '@mui/material/Container'
import { Divider, Tooltip, Typography } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import Select from '@mui/material/Select'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import { EPSILON_FLOAT16 } from '@tensorflow/tfjs-core/dist/backends/backend'
import { toInteger, uniq } from 'lodash'

import pianoRoll from './GlyphLegend/pianoRoll.png'
import glyphs from './GlyphLegend/glyphs.png'
import piechartPitch from './GlyphLegend/piechartPitch.png'
import histoJumpDouble from './GlyphLegend/histoJumpDouble.png'
import histoJumpSingle from './GlyphLegend/histoJumpSingle.png'

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
const marginBox = 20
const marginScatter = { top: 100, right: 100, bottom: 100, left: 100 }
let olddata
let oldpoints
let loaded = false
let onclickradius = 100
let onceEv = false
let valuesForColor = []
let olddistmode
let oldmode
let olddr
let oldgrid
let oldWeight
const scale = 2
let currentzoom = 1 / scale
let currentX = 0
let currentY = 0
let panzoomcanvas
// const allscales = [{ x: 0, y: 0 }]
let distMat
// const zoomsteps = 1
let clicked = [-1, -1]
let rnnSteps = 32
let definiteRender = true
let modeRect = 'meanLength'
let rollmode = 'separate'
let rollmodeNr = 0
let sortmode = 'temperature'
let sortmodeNr = 0
let glyphmode = 'circles'
let glyphmodeNr = 0
const colormode = 'color=temperature'
let relativemode = false
let starglyphmode = false
let dataChanged = true
const glyphData = []
let sortDesc = false

let compositionDisplay = 2

let maxvalues = {maxl:8,maxnum:16, maxvar:10}

let previousStarglyph = false

let player

let weightDist = 0.5

let xArray = []
let yArray = []

let tooltipText = 'hallo'

let drMethod = 'MDS' // MDS or UMAP maybe TSNE //, LDA,PCA

let mode // false = 1 (mit parent); true = 2 (ohne parent)
let distfuncmode = 1

let openLayout
let openVis

// for testings
let gridify = false
const plusLevel = 0

let currentPlayIndex

class ClusterChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      anchorElLayout: null,
      anchorElVis: null,
      redraw: false
    }
    loaded = false
  }

  componentDidMount () {
    loaded = true
    onceEv = false
    // clicked = this.props.clicked.split(",");
    this.render()
  }


  handleClick = (event, postfix) => {
    if (postfix==='Layout') {
      openLayout = true
      this.setState({ ... this.state, anchorElLayout: event.currentTarget })
    } else if (postfix==='Vis') {
      openVis = true
      this.setState({ ... this.state, anchorElVis: event.currentTarget })
    }
  }

  handleClose = (postfix) => {
    if (postfix==='Layout') {
      openLayout = false
      this.setState({ ... this.state, anchorElLayout: null })
    } else if (postfix==='Vis') {
      openVis = false
      this.setState({ ... this.state, anchorElVis: null })
    }
  }

  handleRedrawState = () => {
    const current = this.state.redraw
    this.setState({...this.state, redraw: !current})
  }

  render () {
    try {
      const numViews = this.props.partialGrid
      let seite = (Math.min(this.props.width, this.props.height) - 4) / 2
      if (numViews === 2) {
        seite = seite * 0.7
      }

      const width = seite// this.props.width;
      const height = seite// this.props.height;
      const widthHisto = numViews > 1 ? width * 0.9 : width * 0.75// this.props.width;
      const widthLegend = numViews > 1 ? width * 0.55 : width * 0.55 // for pictures
      const heightLegend = numViews > 1 ? width * 0.45 : width * 0.45 // for pictures
      const heightHisto =  numViews !== 1 && glyphmodeNr !== 0
        ? height * 3 / 8
        : height * 5 / 8// this.props.height;
      const marginBottomLegend = numViews > 1 ? 0 : 30
      const heightBox = this.props.height + marginBox
      const widthBox = this.props.width

      const seiteScatter = numViews !== 1
        ? Math.max(seite, (Math.min(this.props.width, this.props.height) - 4) / (numViews * 0.7))
        : (Math.min(this.props.width, this.props.height - 60))

      const seiteDiv = numViews !== 1
      ? seite
      : seiteScatter

      const widthscale = seiteScatter * scale
      const heightscale = seiteScatter * scale

      let modelUsedFlag = this.props.modelUsedFlag

      const loadedModels = this.props.loadedModels

      const modelUsed = this.props.data.modelUsed
      const unique = modelUsed.filter((v, i, a) => a.indexOf(v) === i)
      
      if(unique.length <= 2)
        modelUsedFlag = true
      else  
        modelUsedFlag = false

      const parent = this.props.data.parent
      const callback = this.props.callback
      const data = this.props.data
      const notes = data.notes
      const items = notes
      const ai = this.props.data.ai
      const temp = this.props.data.temp
      const color = this.props.data.color
      // var close = this.props.close-1;
      rnnSteps = this.props.rnnsteps
      // const temprange = this.props.temprange
      const darkmode = this.props.darkmode
      const getBPM = this.props.getBPM
      const minmaxpitch = this.props.minmaxpitch

      const closeView = this.props.closeView

      const that = this

      const display = this.props.display

      const anchorElLayout = this.state.anchorElLayout
      const anchorElVis = this.state.anchorElVis

      valuesForColor = []

      const noteColormap = [
        '#ff0000',
        '#ff4e00',
        '#db7b00',
        '#ffcc00',
        '#e4ed00',
        '#81d700',
        '#00ffb4',
        '#00ffea',
        '#00baff',
        '#3c00ff',
        '#a800ff',
        '#ff00fd'
      ].map(d => {
        // Make colors less saturated
        const c = d3.hsl(d)
        c.s = 0.5
        return c.toString()
      })

      // model categorical color
      const modelColors3 = j => d3.schemeTableau10[j % 10]// 4+(2*modelUsed[j-1])+modelUsed[j-1]%2];

      if (weightDist === '') { weightDist = 0.5 } // 0 -> Rythmus, 1 -> Melody

      if (clicked[0] === '') {
        clicked = [-1, -1]
      } else {
        clicked[0] = parseInt(clicked[0])
        clicked[1] = parseInt(clicked[1])
      }
      // if(close === "")
      // close = -1;

      xArray = []
      yArray = []

      const ttemp = []
      temp.forEach((t) => {
        if (t > 0) { ttemp.push(t) }
      })

      // const min = Math.min(...ttemp)
      // const max = Math.max(...temp)

      /* const items =  [{notes:[
          {pitch: 60, startTime: 0.0, endTime: 0.5, quantizedStartStep: 0, quantizedEndStep: 4},
          {pitch: 65, startTime: 0.5, endTime: 1.0, quantizedStartStep: 4, quantizedEndStep: 8},
          {pitch: 67, startTime: 1.0, endTime: 1.5, quantizedStartStep: 8, quantizedEndStep: 12},
          {pitch: 67, startTime: 1.5, endTime: 2.0, quantizedStartStep: 12, quantizedEndStep: 16}]},
        {notes:[{pitch: 69, startTime: 0.0, endTime: 0.5, quantizedStartStep: 0, quantizedEndStep: 4},
          {pitch: 64, startTime: 0.5, endTime: 1.0, quantizedStartStep: 4, quantizedEndStep: 8},
          {pitch: 67, startTime: 1.0, endTime: 1.5, quantizedStartStep: 8, quantizedEndStep: 12}]},
        {notes:[{pitch: 65, startTime: 0.0, endTime: 0.5, quantizedStartStep: 0, quantizedEndStep: 4},
          {pitch: 65, startTime: 0.5, endTime: 1.0, quantizedStartStep: 4, quantizedEndStep: 8},
          {pitch: 64, startTime: 1.0, endTime: 1.5, quantizedStartStep: 8, quantizedEndStep: 12},
          {pitch: 64, startTime: 1.5, endTime: 2.0, quantizedStartStep: 12, quantizedEndStep: 16}]}];
      */
      window.onload = function () {
        loaded = true
      }
      let once = false// true;

      let wheeling

      // resize wheel + ctrl
      function resizeByWheel (e) {
        if (!once && !e.ctrlKey) {
          once = false
          e.preventDefault()
          /* if(e.ctrlKey){
            scale = Math.max(Math.min(scale+(e.deltaY/(100*zoomsteps)),10),1);
            canvas.width=seite*scale;
            canvas.height=seite*scale;
          if(scale+(e.deltaY/(100*zoomsteps))<=10&&e.deltaY>0){
            console.log(e.offsetX,e.offsetY);
            currentX = -e.offsetX/zoomsteps;
            currentY = -e.offsetY/zoomsteps;
            allscales[Math.round((scale-1)*zoomsteps)] = {x:currentX,y:currentY};
            console.log(allscales);
          }else if(scale+(e.deltaY/(100*zoomsteps))<=10&&e.deltaY<0){
            currentX = allscales[Math.round((scale-1)*zoomsteps)].x;
            currentY = allscales[Math.round((scale-1)*zoomsteps)].y;
          }
            //currentX = -((e.offsetX)-(width/2));
            //currentY = -((e.offsetY)-(height/2));
          }else{
            */

          // original wheel
          /*
            onclickradius = Math.max(Math.min(onclickradius+(e.deltaY/10),seiteScatter*1.3),10);
          //}
          onceEv=false;
          panzoomcanvas.dispose()
          that.render();
          */

          // new wheel test
          clearTimeout(wheeling)
          wheeling = setTimeout(function () {
            wheeling = undefined
            onceEv = false
            if (panzoomcanvas !== undefined) { panzoomcanvas.dispose() }
            that.render()
          }, 300)

          onclickradius = Math.max(Math.min(onclickradius + (e.deltaY / 10), seiteScatter * 1.3), 10)

          const canvas = document.getElementById('mycanvas')
          const context = canvas.getContext('2d')
          context.strokeStyle = e.deltaY < 0 ? 'rgba(225, 87, 89,0.2)' : 'rgba(242, 142, 44, 0.2)'
          context.lineWidth = 10
          mvlib.Canvas.drawCircle(context, clicked[0], clicked[1], onclickradius)
        }
      }

      /* function dataLength(data){
        var result = 0;
        data.length!==0 ? data.forEach(arr => arr.forEach(obj => obj.quantizedEndStep>result ? result=obj.quantizedEndStep : null)): result=64;
        return result;
      }
*/

      function getDurationOfSeq (notes) {
        let duration = 0
        if (notes.length > 0) {
          let min = notes[0].quantizedStartStep
          let max = notes[0].quantizedEndStep
          notes.forEach((note) => {
            if (min > note.quantizedStartStep) { min = note.quantizedStartStep }
            if (max < note.quantizedEndStep) { max = note.quantizedEndStep }
          })
          duration = max - min
        }
        return duration
      }

      // play with right click
      function Play (i, play, playback, xData, lengthmin) {
        if (player !== undefined) {
          if (i !== currentPlayIndex) {
            d3.select('#playback_line_scatter' + currentPlayIndex)
              .transition()
              .duration(1)
              .attr('transform', `translate(${0},0)`)
            player.stop()
          }

          let xScale
          let bpm = getBPM()
          let duration = getDurationOfSeq(notes[i])
          let endPlace
          if (playback) {
            xScale = d3.scaleLinear()
              .domain([0, lengthmin[0] - lengthmin[1]])
              .range([0, xData[1] - xData[0] - xData[2]])
            endPlace = xScale(dataLength(notes[i]) - lengthmin[1])
          }
          if ((!player.isPlaying() || i !== currentPlayIndex) && play && i >= 0) {
            player.stop()
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

            bpm = getBPM()
            const seq = mm.sequences.createQuantizedNoteSequence(4)
            seq.notes = transformToStart(notes[i])
            if (playback) {
              xScale = d3.scaleLinear()
                .domain([0, lengthmin[0] - lengthmin[1]])
                .range([0, xData[1] - xData[0] - xData[2]])
              d3.select('#playback_line_scatter' + i)
                .raise()
                .attr('transform', `translate(${xScale(dataLength(notes[i]) - getDurationOfSeq(seq.notes) - lengthmin[1])},0)`)
                .attr('duration', 0)
            }

            currentPlayIndex = i
            player.loadSamples(seq).then(() => {
              player.start(seq, bpm)
              if (playback) {
                duration = getDurationOfSeq(seq.notes)
                endPlace = xScale(dataLength(notes[i]) - lengthmin[1])
                d3.select('#playback_line_scatter' + i)
                  .raise()
                  .transition()
                  .ease(d3.easeLinear)
                  .duration(duration * ((60000) / (bpm * 4)))
                  .attr('transform', `translate(${endPlace},0)`)
                  .attr('duration', duration)
              }
            })
          } else {
            if (player.getPlayState() === 'started') {
              d3.select('#playback_line_scatter' + i).transition()
                .duration(0)
              player.pause()
            } else if (player.getPlayState() === 'paused') {
              player.resume()
              if (playback) {
                const currDuration = duration - parseFloat(d3.select('#playback_line_scatter' + i).attr('duration'))
                d3.select('#playback_line_scatter' + i)
                  .raise()
                  .transition()
                  .ease(d3.easeLinear)
                  .duration(currDuration * ((60000) / (bpm * 4)))
                  .attr('transform', `translate(${endPlace},0)`)
                  .attr('duration', duration)
              }
            }
          }
        } else {
          player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander')
          Play(i, play, playback, xData, lengthmin)
        }
      }

      // play with right click
      function context (e) {
        e.preventDefault()
        if (e.button === 2) {
          function getClosestIndex (x, y) {
            let close = -1
            let min = 20 * scale
            for (let i = 0; i < xArray.length; i++) {
              if (xArray[i] >= 0 && yArray[i] >= 0) {
                const deltaX = Math.abs(x - xArray[i])
                const deltaY = Math.abs(y - yArray[i])
                const dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
                if (dist < min) {
                  min = dist
                  close = i
                }
              }
            }
            return close
          }

          const x = e.nativeEvent.offsetX
          const y = e.nativeEvent.offsetY
          const closest = getClosestIndex(x, y)
          if (closest > -1) {
            Play(closest, true, false)
          } else {
            player.stop()
          }
        }
      }

      // set circular brush
      function click (e) {
        if (!e.ctrlKey && e.button === 0) {
          if (!e.altKey) {
            const x = e.nativeEvent.offsetX
            const y = e.nativeEvent.offsetY
            /* var closest = [0,0];
            var closesti = -1;
            for(var i = 0; i<xArray.length;i++){
              var deltaX = Math.abs(x-xArray[i]);
              var deltaY = Math.abs(y-yArray[i]);
              var dn = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
              if(dn<=onclickradius){
                var deltaXc = Math.abs(x-closest[0]);
                var deltaYc = Math.abs(y-closest[1]);
                var dc = Math.sqrt(Math.pow(deltaXc, 2) + Math.pow(deltaYc, 2));
                if(dn<dc){
                  closest = [xArray[i],yArray[i]];
                  closesti = i;
                }
              }
            } */
            // try not to rerender everything
            clicked = [x, y]
            onceEv = false
            if (panzoomcanvas !== undefined) { panzoomcanvas.dispose() }
            that.render()
          // callback(closesti,x,y);
          } else {
            currentzoom = 1 / scale
            currentX = 0
            currentY = 0
            panzoomcanvas.moveTo(currentX, currentY)
            panzoomcanvas.zoomTo(currentX, currentY, currentzoom)
          }
        }
      }

      /**
    // weight update
    function updateTextInput (value) {
      definiteRender = true
      document.getElementById('weights4').value = value.target.valueAsNumber
    }
     */

      // all indizes from inside circle
      function getCloseIndex (x, y) {
        const close = []
        for (let i = 0; i < xArray.length; i++) {
          if (xArray[i] >= 0 && yArray[i] >= 0) {
            const deltaX = Math.abs(x - xArray[i])
            const deltaY = Math.abs(y - yArray[i])
            if (Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) <= onclickradius) {
              close.push(i)
            }
          }
        }
        return close
      }

      function getLab (i) {
        const note = MIDI_NOTES.filter(obj => obj.pitch === i)
        return note[0]
      }
      // mean note duration
      function getMeanLength (data) {
        let total = 0
        let lengths = 0
        data.forEach((d) => {
          lengths = lengths + d.quantizedEndStep - d.quantizedStartStep
          total++
        })
        return lengths !== 0 ? lengths / total : 1
      }

      // pitch ticks with or without C
      function getPitches (withoutC, ax) {
        const pitche = []
        let a = 0
        for (let i = ax.pmin; i < ax.pmax + 1; i++) {
          const bla = getLab(i).name
          const wc = withoutC ? false : bla.includes('C')
          if ((!(bla.includes('#')) && wc) || (withoutC)) {
            pitche[a] = getLab(i).pitch
            a++
          }
        }
        return pitche
      }

      // transform start to 0 for playing and display in roll
      function transformRec (rec, steps) {
        let recNew = []
        let min = dataLength(rec)
        let max = 0
        rec.forEach((note) => {
          if (note.quantizedStartStep < min) { min = note.quantizedStartStep }
          if (note.quantizedEndStep > max) { max = note.quantizedEndStep }
        })
        /*
          rec.forEach((note)=>{
            recNew.push({pitch:note.pitch,
            quantizedStartStep:note.quantizedStartStep-min,
            quantizedEndStep:note.quantizedEndStep-min});
          });
          */
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

      function dataLength (data) {
        let result = 0
        if (data !== undefined && data.length !== 0) {
          data.forEach(obj => {
            if (obj.quantizedEndStep > result) {
              result = obj.quantizedEndStep
            }
          })
        } else {
          return 64
        }
        return result
      }

      // ClusterCode
      if (loaded && display) {
        d3.select('#scattersvg').selectAll('*').remove()

        if (!onceEv) {
          d3.select('#mycanvas').on('wheel', (e) => { resizeByWheel(e) }, { passive: false })
        }
        onceEv = true

        function getDrProjectedPoints (distMatrix) {
          const druidMatrix = druid.Matrix.from(distMatrix)
          // const DR = new druid.TSNE(druidMatrix).init(druidMatrix).transform();
          let DR
          if (drMethod === 'MDS') {
            DR = new druid.MDS(druidMatrix, { d: 2, metric: 'precomputed' }).transform()
          } else if (drMethod === 'TSNE') {
            let perplexity = 40
            if (temp.length >= 55) {
              perplexity = 50
            } else if (temp.length <= 10) {
              perplexity = 5
            } else {
              perplexity = temp.length - 5
            }
            DR = new druid.TSNE(druidMatrix, { perplexity: perplexity, epsilon: 10, d: 2, metric: 'precomputed' }).transform()
          // console.log("perp: "+perplexity+", eps: 10, Anzahl: "+temp.length);
          } else if (drMethod === 'UMAP') {
            DR = new druid.UMAP(druidMatrix, { n_neighbors: Math.min(items.length, 15), local_connectivity: 1, min_dist: 1, d: 2, metric: 'precomputed' })
            DR._X = druidMatrix
            DR = DR.transform()
          }
          const points = DR.to2dArray
          return points
        }

        function getDistanceMatrix (array, distanceFunction, symmetric) {
          const n = array.length
          const matrix = Array.from({ length: n }).map(() => Array.from({ length: n }))
          for (const [index1, item1] of array.entries()) {
            const start = symmetric ? index1 : 0
            for (let index2 = start; index2 < n; index2++) {
              const item2 = array[index2]
              let distance = distanceFunction(item1, item2, 1)
              if (isNaN(distance)) { distance = 1 }
              // Need a distance matrix, so invert similarity
              matrix[index1][index2] = distance
              if (symmetric) {
                matrix[index2][index1] = distance
              }
            }
          }
          return matrix
        }

        const meanlength = []
        let meanmax = 0 // 0 if you want max mean length as 1
        for (let i = 0; i < notes.length; i++) {
          meanlength.push(getMeanLength(notes[i]))
          if (meanlength[i] > meanmax) { meanmax = meanlength[i] }
        }

        /*
      const c = d3.scaleLinear()
        .domain([min, max])
      // .range(["blue", "red"])
      */
        /**
      const pitchcolor = d3.scaleLinear()
        .domain([0, 11])
      */
        /*
      const v = (val) => d3.interpolateRdYlBu(1 - val)
      const noteColormap = [
        '#17becf',
        '#9edae5',
        '#bcbd22',
        '#dbdb8d',
        '#c7c7c7',
        '#f7b6d2',
        '#e377c2',
        '#c49c94',
        '#8c564b',
        '#c5b0d5',
        '#9467bd',
        '#ff9896',
        '#7f7f7f'
      ]/* .map(d => {
            // Make colors less saturated
            const c = mvlib.dist.musicvislib.color_formatHsl(d);
            c.s = 0.5;
            return c.toString();
        }); */

        // const colorscheme = (p) => noteColormap[p]
        /* {
          var p = p%12
            if(p===0||p===1)
              p=0;
            else if(p===2||p===3)
              p=1;
            else if(p===4)
              p=3;
            else if(p===5||p===6)
              p=4;
            else if(p===7||p===8)
              p=5;
            else if(p===9||p===10)
              p=6;
            else
              p=7;
            var d = d3.schemeTableau10[p];
            return d;
          }; */

        // schemePaired because it had 12 colors maybe better if one use own scheme
        // var colorscheme = (val) => d3.schemePaired[val];

        let maxLength = 0 // max number of notes gets size 10 other in relation
        for (let i = 0; i < notes.length; i++) {
          if (maxLength < notes[i].length) { maxLength = notes[i].length }
        }
        // const sizescale = d3.scaleLinear().domain([0, maxLength]).range([0, Math.PI * 100])
        // const lengthscale = d3.scaleLinear().domain([1, meanmax])

        // color determin and store in array
        function getColor (i, mode, push) {
          if (push) { valuesForColor.push(color[i]) }
          return color[i]
        /*
        if (mode === 'cByTempArray') {
          if (push) { valuesForColor.push(c(temp[i])) }
          return temp[i] > 0 ? v(c(temp[i])) : 'black'
        } else if (mode === 'cByTemp') {
          if (push) { valuesForColor.push(c(i)) }
          return v(c(i))
        } else if (mode === 'cByModel') {
          if (push) { valuesForColor.push(modelColors3(modelUsed[i])) }
          return modelColors3(modelUsed[i])
        } else if (mode === 'cByPitch') {
          if (push) { valuesForColor.push(getMostPitch(notes[i], false)) }
          return colorscheme(getMostPitch(notes[i], true))
        } else if (mode === 1 || mode === 2) {
          if (i >= 0) { return v(i) } else { return 'black' }
        } else if (mode === 3) {
          return v(i)
        } else if (mode === 4) {
          return colorscheme(i.indexOf(Math.max(...i)))
        } else {
          return color[i]
        }
        */
        }

        /*
      function getMostPitch (data, mode) {
        const arraypitch = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        data.forEach((d) => {
          arraypitch[d.pitch % 12]++
        })
        const maxindex = arraypitch.indexOf(Math.max(...arraypitch))
        return mode ? maxindex : arraypitch
      }
      */

        /**
      function calcSize (i) {
        return Math.sqrt(sizescale(i) / Math.PI)
      }

      function pitch_invariant (rec) {
        const recNew = []
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
        const most = mosti[mostv.indexOf(Math.max(...mostv))]
        rec.forEach((note) => {
          recNew.push({
            pitch: note.pitch - most,
            quantizedStartStep: note.quantizedStartStep,
            quantizedEndStep: note.quantizedEndStep
          })
        })
        return recNew
      }
       */

        // intervals between pitches
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

        // distanceFunction with separate rhythm and melody difference

        function distanceFunction (recOld1, recOld2, timeBinSize) {
          const rec1 = pitchDiff(transformRec(recOld1, rnnSteps))
          const rec2 = pitchDiff(transformRec(recOld2, rnnSteps))
          if (distfuncmode === 1) {
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
            return (rhythm * (1 - weightDist) + melody * weightDist)
          } else if (distfuncmode === 2) {
            const rec1String = getStringfromRec(rec1)
            const rec2String = getStringfromRec(rec2)
            return 1 - mvlib.StringBased.Levenshtein.levenshtein(rec1String, rec2String, true)
          } else if (distfuncmode === 3) {
            const rec1String = getStringfromRec(rec1)
            const rec2String = getStringfromRec(rec2)
            return 1 - mvlib.StringBased.Levenshtein.damerauLevenshtein(rec1String, rec2String, true)
          } else if (distfuncmode === 4) {
            function eucDistance (a, b) {
              return a
                .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
                .reduce((sum, now) => sum + now) ** // sum
                    (1 / 2)
            }
            const occ1 = calcHistoGlyphData(rec1)
            const occ2 = calcHistoGlyphData(rec2)
            const sim = eucDistance(occ1, occ2)
            /*
              //scale Distance to [0,1] with[different,similar]
              var scale = d3.scaleLinear().domain([0,6]).range([1,0])
              sim = scale(sim)
              sim<0?sim=0:sim=sim;
              */
            return sim
          }
        }

        // string for levenshtein
        function getStringfromRec (rec) {
          let string = ''
          let nonote = true
          for (let i = 0; i < dataLength(rec); i++) {
            nonote = true
            rec.forEach((d) => {
              if (d.quantizedEndStep > i && d.quantizedStartStep <= i) {
                nonote = false
                string = string + d.pitch
              }
            })
            if (nonote) {
              string = string + 'p'
            }
          }
          return string
        }

        // distance funktion Old with same pitch at same time and difference of melodies
        /**
      function distanceFunction_old (recOld1, rec_old2, timeBinSize) {
        /* const diffMap = mvlib.Utils.differenceMap(
              rec1.notes,
              rec2.notes,
              timeBinSize
            );
            console.log(mvlib.Utils);
            console.log(diffMap);
            // Don't take correct, information should be redundant and then
            // comparing a recording to itself would have a distance > 0
            const { additional, missing } = mvlib.Utils.differenceMapErrorAreas(diffMap);
            return additional + missing;
        // my Version
        let rec1 = transformRec(recOld1, rnnSteps)
        let rec2 = transformRec(rec_old2, rnnSteps)
        let total = 0
        let same = 0
        const result = []
        // if(longer1){
        // Similarity in 1 -> 2 direction
        rec1.forEach((note) => {
          for (var i = note.quantizedStartStep; i < note.quantizedEndStep; i = i + timeBinSize) {
            rec2.forEach((note2) => {
              if (note2.quantizedStartStep <= i && note2.quantizedEndStep > i) {
                note.pitch === note2.pitch ? same++ : same = same
              }
            })
            total++
          }
        })
        result.push(same / total)
        total = 0
        same = 0
        // }else{
        // Similarity in 2 -> 1 direction
        rec2.forEach((note) => {
          for (var i = note.quantizedStartStep; i < note.quantizedEndStep; i = i + timeBinSize) {
            rec1.forEach((note2) => {
              if (note2.quantizedStartStep <= i && note2.quantizedEndStep > i) {
                note.pitch === note2.pitch ? same++ : same = same
              }
            })
            total++
          }
        })

        result.push(same / total)
        total = 0
        same = 0
        // similarity with invariance in pitch but not time
        rec1 = pitchDiff(rec1)
        rec2 = pitchDiff(rec2)
        // Similarity in 1 -> 2 direction
        rec1.forEach((note) => {
          for (var i = note.quantizedStartStep; i < note.quantizedEndStep; i = i + timeBinSize) {
            rec2.forEach((note2) => {
              if (note2.quantizedStartStep <= i && note2.quantizedEndStep > i) {
                note.pitch === note2.pitch ? same++ : same = same
              }
            })
            total++
          }
        })
        result.push(same / total)
        total = 0
        same = 0
        // }else{
        // Similarity in 2 -> 1 direction
        rec2.forEach((note) => {
          for (var i = note.quantizedStartStep; i < note.quantizedEndStep; i = i + timeBinSize) {
            rec1.forEach((note2) => {
              if (note2.quantizedStartStep <= i && note2.quantizedEndStep > i) {
                note.pitch === note2.pitch ? same++ : same = same
              }
            })
            total++
          }
        })
        result.push(same / total)
        total = 0
        same = 0
        // }
        let gesamt = 0
        let num = 0
        result.forEach((i) => {
          gesamt = gesamt + i
          num++
        })

        return (1 - (gesamt / num))
      }
      */

        function getPoints (titems) {
          const distMatrix = getDistanceMatrix(titems, distanceFunction, true)
          distMat = distMatrix
          const points = getDrProjectedPoints(distMatrix)
          return points
        }

        function getLabel (val) {
          const note = MIDI_NOTES.find(obj => {
            return obj.pitch === val
          })
          if (note !== undefined) { return note.label }
          return ''
        }

        // ticks for axis
        function getVal (mode, axis) {
          const result = []
          if (mode === 'x') {
            for (let i = 0; i <= axis.l - axis.lmin; i++) {
              if (i % 4 === 0) { result.push(i) }
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

        function grad (c, op, id, svg, where) {
          return c
          /**
        // if opacity
        const hexToRgb = hex =>
          hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

        const addAToRGB = (rgb, op) => {
          let str = rgb.slice(0, -1)
          str += ',' + op + ')'
          return str
        }

        const rgb = addAToRGB(c, op)
        const rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + op + ')'
        return rgb // a if from hex
        */
          // else
          // return c
        /*
            svg.select("#GradCluster"+id+where).remove();
            //gradient for opacity but didnt work with color so opacity in x dir and color in y dir
            const linearGradient = svg.append("linearGradient").attr("id","GradCluster"+id+where);
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

        /**
      // unused
      function clickableTable (
        rows,
        cols,
        values,
        w = width,
        h = height,
        scaleColor = (d) => 'white',
        drawText = 'auto', // true, false, "auto",
        color
      ) {
        // Initial value, can be interpreted as a selection of all or none of the cells, as you like

        // Small margin, makes highlight boxes look better
        const W = w - 2
        const H = h - 2
        const cellHeight = H / (rows.length + 1)
        const cellWidth = W / (cols.length + 1)

        if (drawText === 'auto') {
          drawText = Math.min(cellWidth, cellHeight) > 25
        }

        const canvas = document.getElementById('matrixcan')
        const context = canvas.getContext('2d')

        function drawTable () {
          // White background, better when saving as file or with dark themes
          context.fillStyle = 'white'
          context.fillRect(0, 0, w, h)

          context.fillStyle = 'black'
          context.strokeStyle = 'black'
          context.textAlign = 'center'
          context.textBaseline = 'middle'

          // Labels

          if (drawText === true) {
            for (const [r, row] of rows.entries()) {
              const x = 0
              const y = (r + 1) * cellHeight
              context.fillStyle = color[r]
              context.fillRect(x, y, cellWidth, cellHeight)
              context.fillStyle = 'black'
              context.strokeStyle = 'black'
              context.fillText(r, x + cellWidth / 2, y + cellHeight / 2)
            }
            for (const [c, col] of cols.entries()) {
              const x = (c + 1) * cellWidth
              const y = 0
              context.fillStyle = color[c]
              context.fillRect(x, y, cellWidth, cellHeight)
              context.fillStyle = 'black'
              context.strokeStyle = 'black'
              context.fillText(c, x + cellWidth / 2, y + cellHeight / 2)
            }
          }

          // Cells
          for (const [r, row] of rows.entries()) {
            for (const [c, col] of cols.entries()) {
              const x = (c + 1) * cellWidth
              const y = (r + 1) * cellHeight
              const fillColor = scaleColor(values[r][c], r, c)
              context.fillStyle = fillColor
              context.fillRect(x, y, cellWidth, cellHeight)
              if (drawText === true) {
                // Make text white or black, depending on fill color's lightness
                if (values[r][c] > 0.5) {
                  context.fillStyle = 'white'
                } else {
                  context.fillStyle = 'black'
                }
                context.fillText(values[r][c].toFixed(2), x + cellWidth / 2, y + cellHeight / 2)
              }
            }
          }
        }
        drawTable()

        return canvas
      }
      */

        // create piano rolls, different modes for all in one, density or separate
        function createSimpleRoll (data, twidth, theight, color, axis, index, where, h) {
          if (index < 0) {
            theight *= 0.66
          }

          const tmargin = { top: 20, right: 30, bottom: 10, left: 30 }

          let occu = []

          let maxocc = 0

          let noteheight = 0
          let s = (a) => { return 0 }

          if (data.length > 0) {
            if (where === 'pianowithevery' && index === -1) {
              occu = new Array(axis.pmax - axis.pmin)
              for (let i = 0; i < occu.length; i++) {
                occu[i] = new Array(axis.l - axis.lmin + 1)
              }
              for (let l = 0; l < axis.l - axis.lmin + 1; l++) {
                for (let g = 0; g < axis.pmax - axis.pmin; g++) {
                  occu[g][l] = { pitch: g + axis.pmin, start: l + axis.lmin, l: 1, occ: 0 }
                }
              }

              maxocc = 0
              // var changed = false;

              for (let i = axis.lmin; i < axis.l; i++) {
                data.forEach((d) => {
                  if (d.quantizedStartStep <= i && d.quantizedEndStep > i) {
                  // changed = false;
                  // occu[d.pitch-axis.pmin][i-axis.lmin].occ++;
                    const o = occu[d.pitch - axis.pmin][i - axis.lmin]
                    o.occ++
                    if (maxocc < o.occ) { maxocc = o.occ }
                  /* if(!changed){
                        occu[d.pitch-axis.pmin].push({pitch:d.pitch,start:i,l:1,occ:1});
                      } */
                  }
                })
              }
            }

            // const padding = ((theight - tmargin.top - tmargin.bottom) / (axis.pmax - axis.pmin)) / 5
            noteheight = ((theight - tmargin.top - tmargin.bottom) / (axis.pmax - axis.pmin + 1))// -padding
            s = d3.scaleLinear().domain([0, maxocc]).range([0, noteheight / 2])
          }

          const x = d3.scaleLinear()
            .domain([0, axis.l - axis.lmin])
            .range([tmargin.left, twidth * 0.8 - tmargin.right])

          const y = d3.scaleLinear()
            .domain([axis.pmax + 0.5, axis.pmin - 0.5])
            .rangeRound([tmargin.top, theight - tmargin.bottom])

          // ("#"+where) instead of fixed
          // var svg = d3.select("#"+where).append("svg")
          const svg = d3.select('#pianorolls').append('svg')
            .attr('class', 'pointer')
            .attr('id', 'roll' + index)
            .attr('index', index)
            .attr('width', twidth)
            .attr('height', theight)
            .on('click', function (e) {
              const ind = index
              if (ind >= 0) {
                callback(ind, clicked[0], clicked[1])
              }
            })
            .on('contextmenu', function (e) {
              e.preventDefault()
              if (e.button === 2) {
                svg.select('#playback_line_scatter' + index)
                  .attr('height', theight - tmargin.top - tmargin.bottom)
                  .attr('width', 2)
                  .attr('x', tmargin.left)
                  .attr('y', tmargin.top)
                  .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
                  .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
                  .attr('opacity', 1)
                Play(index, true, true, [tmargin.left, twidth * 0.8, tmargin.right], [axis.l, axis.lmin])
              }
            })
          svg.append('rect')
            .attr('id', 'playback_line_scatter' + index)

          const xticks = []
          for (let t = axis.lmin; t <= axis.l; t++) {
            if (t % 16 === 0) {
              xticks.push(t - axis.lmin)
            }
          }

          function xAxis (g) {
            g
              .attr('transform', `translate(${0},${0 + tmargin.top})`)
              .call(d3.axisTop(x).tickValues(xticks).tickFormat((t) => {
                return Math.round(t / 16)
              }))
          }

          function yAxis (g) {
            g
              .attr('transform', `translate(${tmargin.left},0)`)
              .style('font', Math.max(Math.min(noteheight, 20), 11) + 'px times')
              .call(d3.axisLeft(y).ticks((axis.pmax - axis.pmin)).tickFormat((t) => {
                if (t % 12 === 0 || t % 12 === 5/* ||t%12===4||t%12===5||t%12===7||t%12===9||t%12===11 */) {
                  return getLabel(t)
                }
              }).tickSize(0))
          }

          svg.append('g').call(xAxis)
          svg.append('g').call(yAxis)

          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(0,${theight - tmargin.bottom})`)
            .call(d3.axisBottom(x).tickSize(-theight + tmargin.top + tmargin.bottom).tickFormat('')
              .tickValues(getVal('x', axis)))

          svg.append('g')
            .style('opacity', '0.25')
            .attr('class', 'x axis-grid')
            .attr('transform', `translate(${0},${0 + tmargin.top})`)
            .attr('stroke-width', 2)
            .call(d3.axisTop(x).tickSize(-theight + tmargin.bottom + tmargin.top)
              .tickFormat('').tickValues(getVal('xc', axis)))

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
          function isSharp (num) {
            if (num % 12 === 1 || num % 12 === 3 || num % 12 === 6 || num % 12 === 8 || num % 12 === 10) {
              return true
            } else {
              return false
            }
          }

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
            .attr('width', d => twidth * 0.8 - tmargin.left - tmargin.right)
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
            .call(d3.axisLeft(y).tickSize(-twidth * 0.8 + tmargin.left + tmargin.right)
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
            .call(d3.axisLeft(y).tickSize(-twidth * 0.8 + tmargin.left + tmargin.right)
              .tickFormat('').tickValues(pitchesWc))
            .selectAll('line')
            .attr('transform', `translate(0,${(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
          // .attr("stroke","blue")
            .attr('stroke-width', 2)
          /*
            svg.append('g')
            .style("opacity","0.25")
            .attr('class', 'y axis-grid')
            .attr('transform', `translate(${tmargin.left},0)`)
            .call(d3.axisLeft(y).tickSize(-twidth + tmargin.left + tmargin.right).tickFormat("").ticks(axis.pmax-axis.pmin))
            */

          if (where === 'pianorolls') {
            const occuBeside = new Array(axis.pmax - axis.pmin)
            for (let e = 0; e < occuBeside.length; e++) {
              occuBeside[e] = { sum: 0, num: 0 }
            }
            data[0].forEach((note) => {
              occuBeside[note.pitch - axis.pmin].sum = occuBeside[note.pitch - axis.pmin].sum + (note.quantizedEndStep - note.quantizedStartStep)
              occuBeside[note.pitch - axis.pmin].num = occuBeside[note.pitch - axis.pmin].num + 1
            })

            let occumax = 0
            for (let e = 0; e < occuBeside.length; e++) {
              if (occuBeside[e].num !== 0) {
                // this line is for mean length --> comment to get the combined
                // length of all notes for this pitch
                if (modeRect === 'meanLength') { occuBeside[e].sum = occuBeside[e].sum / occuBeside[e].num }
              }
              if (occuBeside[e].sum > occumax) { occumax = Math.ceil(occuBeside[e].sum) }
            }

            const xHisto = d3.scaleLinear()
              .domain([0, occumax])
              .range([twidth * 0.8 - tmargin.left / 4, (twidth * 0.8 - tmargin.left / 4) + twidth * 1 / 8])
            /**
          const yHisto = d3.scaleLinear()
            .domain([axis.pmax, axis.pmin])
            .rangeRound([tmargin.top, theight - tmargin.bottom])
          */

            function xAxisHisto (g) {
              const ticks = []
              for(let i=0; i <= occumax; i = i+(Math.max(1, 2 * Math.round(occumax/8)))){
                ticks.push(toInteger(i))
              }
              ticks.push(toInteger(occumax))
              g
                .attr('transform', `translate(${0},${tmargin.top})`)
                .call(d3.axisTop(xHisto).tickValues(ticks).tickFormat((t)=>{return toInteger(t).toString()}))
            }

            /**
          function yAxisHisto (g) {
            g
              .attr('transform', `translate(${twidth - tmargin.left / 4},0)`)
              .call(d3.axisLeft(yHisto).ticks((axis.pmax - axis.pmin)).tickFormat((t) => {
                if (t % 12 === 0 || t % 12 === 2 || t % 12 === 4/* ||t%12===5  || t % 12 === 7 || t % 12 === 9/* ||t%12===11 ) {
                  return ''
                }
              }))
          }
          */

            svg.append('g').call(xAxisHisto)
            // svg.append("g").call(yAxisHisto);

            svg.append('g')
              .selectAll('rect')
              .data(occuBeside)
              .enter()
              .append('rect')
              .attr('stroke-width', 0.9 / h)
              .attr('stroke', color[0] === 'black' && index >= 0 ? 'red' : 'black')
              .attr('height', noteheight)
              .attr('width', d => (xHisto(d.sum) - xHisto(0)))
              .attr('x', d => xHisto(0))
              .attr('y', (d, i) => (y(i + 1 + axis.pmin) + noteheight / 2))
            // .attr("fill", color[i])
              .attr('fill', color[0])
              .attr('opacity', 0.7)
          }

          if (where === 'pianowithevery' && index === -1) {
            svg.append('g')
              .selectAll('path')
              .data(occu)
              .enter()
              .append('path')
            // .attr('transform', `translate(0,${(y(axis.pmin)-y(axis.pmin+1))})`)
              .style('stroke', 'none')
              .style('fill', color[0])
              .style('fill-opacity', 0.8)
              .attr('d', d3.area()
                .y0(function (d) { return (y(d.pitch - 1) - s(d.occ)) })
                .y1(function (d) { return (y(d.pitch - 1) + s(d.occ)) })
                .x(function (d) { return (x(d.start - axis.lmin)) })
              // .curve(d3.curveStepAfter)
                .curve(d3.curveMonotoneX)
              )
          } else {
          // .attr("fill", d => {grad(color[i],i,svg); return "URL(#GradCluster"+i+")";})
            let k = 0
            // notes added
            let localaxislmin = 100000
            for (let i = 0; i < data.length; i++) {
              data[i].forEach((d)=>{
                if (localaxislmin > d.quantizedStartStep) { localaxislmin = d.quantizedStartStep }
              })
            }

            for (let i = 0; i < data.length; i++) {
              if (index === -2) { k = i } else { k = index }
              svg.append('g')
                .selectAll('rect')
                .data(data[i])
                .enter()
                .append('rect')
                .attr('transform', `translate(0,${-(y(axis.pmin) - y(axis.pmin + 1)) / 2})`)
                .attr('rx', 4)
                .attr('ry', 4) // previous 6
                .attr('stroke-width', 0.9 / h)
                .attr('stroke', color[i] === 'black' && index >= 0 ? 'red' : 'black')
                .attr('height', noteheight)
                .attr('width', d => (x(d.quantizedEndStep) - x(d.quantizedStartStep)))
                .attr('x', d => x(d.quantizedStartStep - localaxislmin))
                .attr('y', d => y(d.pitch))// +0.5)+padding/2)
              // .attr("fill-opacity",index===-2?0.5:1)
              // .attr("fill", color[i])
                .attr('fill', d => grad(color[i], index !== -2 ? 1 : 0.5, k, svg, where))// ; return "URL(#GradCluster"+k+where+")";})
                .attr('opacity', 0.7)
            }
          }

          occu = []
        }

        // calc data for piano rolls
        function drawPianoRolls (x, y, colormode) {
          d3.select('#pianorolls').selectAll('*').remove()
          d3.select('#pianowithevery').selectAll('*').remove()

          const dataindices = getCloseIndex(x, y)

          let everynotes = []
          const selectednotes = []
          const tcolors = []

          let maxlength = 0
          let start = 10000
          let end = 0

          dataindices.forEach((i) => {
            end = 0
            start = 10000
            notes[i].forEach((d)=>{
              if (end < d.quantizedEndStep) { end = d.quantizedEndStep }
              if (start > d.quantizedStartStep) { start = d.quantizedStartStep }
            })
            if (maxlength < end - start) { maxlength = end - start }
            everynotes = everynotes.concat(notes[i])
            selectednotes.push(notes[i])
            if (colormode === 'color=temperature') {
              tcolors.push(getColor(i, 'cByTempArray', false))
            } else if (colormode === 'color=model') {
              tcolors.push(getColor(i, 'cByModel', false))
            } else {
              tcolors.push(getColor(i, 'cByLength', false))
            }
          })
          let lmin = 10000
          if (everynotes[0] !== undefined) { lmin = everynotes[0].quantizedStartStep }
          const axis = { pmin: 128, pmax: 0, lmin: lmin, l: 0 }


          everynotes.forEach((d) => {
            if (axis.pmin > d.pitch) { axis.pmin = d.pitch }
            if (axis.pmax < d.pitch) { axis.pmax = d.pitch }
            if (axis.l < d.quantizedEndStep) { axis.l = d.quantizedEndStep }
            if (axis.lmin > d.quantizedStartStep) { axis.lmin = d.quantizedStartStep }
          })

          axis.l = axis.lmin + maxlength

          axis.pmin = axis.pmin - 1
          axis.pmax = axis.pmax + 1

          if (rollmode === 'density') { createSimpleRoll(everynotes, seite, seite, [d3.schemeTableau10[9]], axis, -1, 'pianowithevery', 1) }
          if (rollmode === 'all-one') { createSimpleRoll(selectednotes, seite, seite, tcolors, axis, -2, 'pianowithevery', 1) }

          let h = 0
          dataindices.length < 3 ? h = dataindices.length : h = 3
          /*
            axis = {pmin:120,pmax:0,lmin:32,l:0};
            var transformed = [];
            dataindices.forEach((i)=>{
              transformed[i] = notes[i]//transformRec(notes[i]);
              transformed[i].forEach((note)=>{
                axis.pmin>note.pitch?axis.pmin=note.pitch:axis.pmin=axis.pmin;
                axis.pmax<note.pitch?axis.pmax=note.pitch:axis.pmin=axis.pmin;
                axis.l<note.quantizedEndStep?axis.l=note.quantizedEndStep:axis.pmin=axis.pmin;
                axis.lmin>note.quantizedStartStep?axis.lmin=note.quantizedStartStep:axis.pmin=axis.pmin;
              })
              axis.pmin = axis.pmin-1;
              axis.pmax = axis.pmax+1;
            })
            */

          function compare (a, b) {
            if (sortmode === 'temperature') {
              return temp[a] - temp[b]
            } else if (sortmode === 'similarity') {
              return distMat[a][parent[a]] - distMat[b][parent[b]]
            } else if (sortmode === 'variance') {
              return calcVariance(notes[a]) - calcVariance(notes[b])
            } else {
              return 0
            }
          }
          dataindices.sort(compare)

          if (sortDesc) {
            dataindices.reverse()
          }

          if (rollmode === 'separate') {
            dataindices.forEach((i, j) => {
              let tcolor
              if (colormode === 'color=temperature') {
                tcolors.push(getColor(i, 'cByTempArray', false))
                tcolor = getColor(i, 'cByTempArray', false)
              } else if (colormode === 'color=model') {
                tcolors.push(getColor(i, 'cByModel', false))
                tcolor = getColor(i, 'cByModel', false)
              } else {
                tcolor = getColor(i, 'cByLength', false)
              } // s[j]
              createSimpleRoll([notes[i]], seite, Math.min(seiteDiv / h, seite), [tcolor], axis, i, 'pianorolls', h)
            })
          }
        }

        // global histogram
        function drawHistogram (x, y, localmode, colormode) {
          d3.select('#histogram' + localmode).selectAll('*').remove()
          let svg = d3.select('#histogram' + localmode)
          const margin = { top: 30, right: 30, bottom: 30, left: 30 }
          const data = getCloseIndex(x, y)
          let dataNotes = []
          let j = 0
          let count = 0
          let min = 120
          let max = 0

          data.forEach((i) => {
            dataNotes = dataNotes.concat(items[i])
            count++
            if (colormode !== 4) { valuesForColor[i] >= 0 ? j += valuesForColor[i] : count-- } else {
              j = j.map((e, k) => e + valuesForColor[i][k])
            }
          })

          dataNotes.forEach((d) => {
            if (localmode === 'notes') {
              if (min > d.pitch) { min = d.pitch }
              if (max < d.pitch) { max = d.pitch }
            } else if (localmode === 'length') {
              if (max < d.quantizedEndStep - d.quantizedStartStep) { max = d.quantizedEndStep - d.quantizedStartStep }
            }
          })

          if (data.length !== 0 && colormode !== 4 && count !== 0) {
            j = j / count
          }

          if (localmode === 'notes') {
            min = min - 2
            max = max + 2
          } else {
            min = 0
            max = max + 2
          }
          const xScale = d3.scaleLinear()
            .domain([min, max])
            .range([margin.left, widthHisto])

          svg = svg.attr('transform', `translate(0,${-margin.bottom / 2})`)

          if (localmode === 'notes') {
            let divide = (minmaxpitch.highest - minmaxpitch.lowest) / 5 + 3
            let ticks = (minmaxpitch.highest - minmaxpitch.lowest) / divide<6?6:(minmaxpitch.highest - minmaxpitch.lowest) / divide
            svg.append('g')
              .attr('transform', `translate(0,${heightHisto - margin.bottom})`)
              .call(d3.axisBottom(xScale).ticks(ticks)
                .tickFormat(function (d) {
                  return getLabel(d)
                }))
              .append("text")             
                .attr('transform', `translate(${widthHisto / 2}, ${margin.bottom})`)
                .attr('class', 'axisLabel')
                .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
                .style("text-anchor", "middle")
                .text("Pitch occurrance");
          } else {
            svg.append('g')
              .attr('transform', `translate(0,${heightHisto - margin.bottom})`)
              .call(d3.axisBottom(xScale).ticks(max - min).tickFormat((d) => { if (d < max) { return d } else { return '' } })
                // .text('Y Axis Label')
                )
              .append("text")             
                .attr('transform', `translate(${widthHisto / 2}, ${margin.bottom})`)
                .attr('class', 'axisLabel')
                .attr('fill', darkmode === 'LightMode' ? 'black' : 'white')
                .style("text-anchor", "middle")
                .text("Duration occurrance");
          }

          const histogram = d3.histogram()
            .value(function (d) { return localmode === 'notes' ? d.pitch : d.quantizedEndStep - d.quantizedStartStep })
            .domain(xScale.domain())
            .thresholds(xScale.ticks(max - min))

          const bins = histogram(dataNotes)

          max = Math.max(1, d3.max(bins, function (d) { return d.length }))

          const yScale = d3.scaleLinear()
            .domain([max, 0])
            .range([margin.top, heightHisto - margin.bottom])

          let ticks = max
          const tickrate = Math.round(max / 5)
          tickrate === 0 ? ticks = max : ticks = Math.round(max / tickrate)
          svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(ticks))

          svg.selectAll('rect')
            .data(bins)
            .enter()
            .append('rect')
            .attr('x', function (d) { return xScale(d.x0 - 0.5) })
            .attr('y', function (d) { return yScale(0) + margin.bottom - yScale(max - d.length) })
            .attr('width', function (d) { return Math.max(xScale(d.x1) - xScale(d.x0) - 1, 0) })
            .attr('height', function (d) { return yScale(max - d.length) - margin.top })
            .style('fill', d3.schemeTableau10[9])// getColor(j,colormode,false))
        }

        if (items.length > 0) {
        /* weightDist = document.getElementById("weights4").value;
          if(weightDist===""){
            weightDist = 0.5;
            document.getElementById("weights4").value=0.5;
            document.getElementById("weights").value=0.5;
          }
          */
          // drMethod = document.getElementById('DRselect').value
          mode = compositionDisplay // parseInt(document.getElementById('mode').value)
          // distfuncmode = parseInt(document.getElementById('distfunc').value)

          let points
          if (items.length > 0) {
            if (JSON.stringify(olddata) !== JSON.stringify(items) || weightDist !== oldWeight || distfuncmode !== olddistmode || mode !== oldmode || drMethod !== olddr || definiteRender || oldgrid !== gridify) {
              points = getPoints(items)
              definiteRender = false
              if (gridify) {
                points = hagrid.gridify(points, 'hilbert', {
                  l_min: 0,
                  pluslevel: items.length<64?plusLevel+1:plusLevel,
                  keep_aspect_ratio: true
                })
              }
              dataChanged = true
            } else {
              //points = Object.assign([], oldpoints)
            }
          } else {
            points = []
          }
          // if (oldmode !== mode || olddistmode !== distfuncmode || drMethod !== olddr) { clicked = [0, 0] }

          //olddata = Object.assign([], items)
          oldmode = mode
          olddr = drMethod
          //oldpoints = Object.assign([], points)
          olddistmode = distfuncmode
          oldgrid = gridify
          oldWeight = weightDist

          /* var points = [[0.7071067811865476, 0.7071067811865475],
                        [0.12391705374312639, 0.18821745668215994],
                        [-0.7071067811865476, -0.7071067811865475]];
          */

          const canvas = document.getElementById('mycanvas')
          // pan, zoom for canvas

          panzoomcanvas = createPanZoom(canvas, {
            beforeWheel: function (e) {
            // allow wheel-zoom only if altKey is down. Otherwise - ignore
              const shouldIgnore = !e.ctrlKey
              return shouldIgnore
            },
            beforeMouseDown: function (e) {
            // allow mouse-down panning only if altKey is down. Otherwise - ignore
              const shouldIgnore = !e.ctrlKey
              return shouldIgnore
            },
            maxZoom: 10,
            minZoom: 1 / scale,
            initialZoom: currentzoom,
            bounds: true,
            boundsPadding: 0.5,
            transformOrigin: { x: 0, y: 0 },
            zoomSpeed: 0.065
          })

          /* if(currentzoom===panzoomcanvas.getMinZoom()){
            currentX = 0;
            currentY = 0;
          } */

          panzoomcanvas.moveTo(currentX, currentY)

          panzoomcanvas.on('panend', function (e) {
          // var diff = {x:currentX-panzoomcanvas.getTransform().x,y:currentY-panzoomcanvas.getTransform().y}
            currentzoom = panzoomcanvas.getTransform().scale
            currentX = panzoomcanvas.getTransform().x
            currentY = panzoomcanvas.getTransform().y

          /* for(var i = 1;i<Math.min(Math.round(scale*zoomsteps),allscales.length);i++){
              allscales[i].x = allscales[i].x-(diff.x/((scale-i)*zoomsteps));
              allscales[i].y = allscales[i].y-(diff.y/((scale-i)*zoomsteps));
            } */
          })
          panzoomcanvas.on('zoom', function (e) {
            currentzoom = panzoomcanvas.getTransform().scale
            currentX = panzoomcanvas.getTransform().x
            currentY = panzoomcanvas.getTransform().y
            panzoomcanvas.moveTo(currentX, currentY)
          })

          const context = canvas.getContext('2d')
          // context.scale(scale,scale);
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.strokeStyle = darkmode === 'LightMode' ? '#bbb' : '#eee'
          context.lineWidth = 2
          mvlib.Canvas.drawRoundedRect(context, 1, 1, canvas.width - 2, canvas.height - 2, 0)
          context.stroke()

          const legend = document.getElementById('legend')
          const contextlegend = legend.getContext('2d')
          contextlegend.clearRect(0, 0, legend.width, legend.height)

          const xExtent = d3.extent(points, (d) => d[0])
          const yExtent = d3.extent(points, (d) => d[1])

          const scaleX = d3
            .scaleLinear()
            .domain(xExtent)
            .range([marginScatter.left, canvas.width - marginScatter.right])
          const scaleY = d3
            .scaleLinear()
            .domain(yExtent)
            .range([marginScatter.top, canvas.height - marginScatter.top - 10])

          /**
        const fullItems = items.map((d, i) => {
          return {
            recording: d,
            point: points[i]
          }
        })
         */
          // const grouped = d3.group(fullItems, (d) => d);

          context.textAlign = 'center'

          // fill points in array

          xArray = []
          yArray = []
          let ind = 0
          let point2
          let x
          let y
          for (const [index] of points.entries()) {
            point2 = points[index]
            if (point2 !== undefined) {
              x = scaleX(point2[0])
              y = scaleY(point2[1])
            } else {
              x = NaN
              y = NaN
            }
            if (isNaN(x) && isNaN(y)) {
              x = width / 2
              y = height / 2
            }
            if (mode === 2 && ai[ind]) {
              xArray.push(x)
              yArray.push(y)
            } else if (mode === 1) {
              xArray.push(x)
              yArray.push(y)
            } else {
              xArray.push(-1000)
              yArray.push(-1000)
            }
            ind++
          }
          if(notes.length === 2) {
            xArray = [-1000, canvas.width / 2]
            yArray = [-1000, canvas.height / 2]
          }

          // const linewidth = d3.scaleLinear().domain([0, 1]).range([0.2, 5])

          if (clicked[0] !== -1 && clicked[1] !== -1) {
          // context.strokeStyle = "rgba(0,0,0,0.1)";
            context.strokeStyle = darkmode === 'LightMode' ? '#bbb' : '#eee'
            context.lineWidth = 10
            mvlib.Canvas.drawCircle(context, clicked[0], clicked[1], onclickradius)
            context.fillStyle = darkmode !== 'LightMode' ? '#bbb' : '#eee'
            mvlib.Canvas.drawFilledCircle(context, clicked[0], clicked[1], onclickradius)
          }

          /**
        // for tree structure in DR graph
        if (mode === 1 && false) {
          context.beginPath()
          context.strokeStyle = 'rgba(128,128,128,0.01)'
          for (var i = 0; i < xArray.length; i++) {
            if (parent[i] !== i) {
              context.lineWidth = 1
              if (distMat !== undefined) {
                // context.lineWidth = scale*linewidth(distMat[parent[i]][i]);
              }
              context.moveTo(xArray[i], yArray[i])
              context.lineTo(xArray[parent[i]], yArray[parent[i]])
              context.stroke()
            }
          }
        }
         */

          function getCellsizeFromGrid () {
          // return (scaleX(2)-scaleX(1))*0.9
            points.push(points[0])
            points.push(points[0])

            points[points.length - 1] = [xExtent[0], yExtent[0]]
            points[points.length - 2] = [xExtent[0], yExtent[0]]

            const cellPoints = hagrid.gridify(points, 'hilbert', {
              l_min: 0,
              pluslevel: items.length<64?plusLevel+1:plusLevel,
              keep_aspect_ratio: true
            })

            const xExtentl = d3.extent(cellPoints, (d) => d[0])
            const yExtentl = d3.extent(cellPoints, (d) => d[1])

            const scaleX = d3
              .scaleLinear()
              .domain(xExtentl)
              .range([marginScatter.left, canvas.width - marginScatter.right])
            const scaleY = d3
              .scaleLinear()
              .domain(yExtentl)
              .range([marginScatter.top, canvas.height - marginScatter.top - 10])

            return Math.min(160,(Math.max(Math.abs(scaleX(cellPoints[points.length - 1][0]) - scaleX(cellPoints[points.length - 2][0])),
              Math.abs(scaleY(cellPoints[points.length - 1][1]) - scaleY(cellPoints[points.length - 2][1])))) * 0.95)
          }

          // calc data, colors and sizes for different visualizations

          let quotient = 1
          let num = 64
          while (num < xArray.length) {
            quotient++
            num *= 4
          }
          // quotient = Math.ceil(Math.log(xArray.length)/Math.log(4))
          let size = 5
          const colors = []
          let tcol

          const cellsize = getCellsizeFromGrid() / 4
          for (let i = 0; i < xArray.length; i++) {
            if (colormode === 'color=temperature') {
              tcol = getColor(i, 'cByTempArray', true)
              context.strokeStyle = tcol
            } else {
              tcol = getColor(i, 'cByModel', true)
              context.strokeStyle = tcol
            }
            if (xArray[i] !== -1000 && yArray[i] !== -1000) {
              colors.push(color[i])
              if (!ai[i]) {
                size = cellsize * 4/5// (20)/(2**quotient);
              } else {
              // smaller grid smaller size of glyph
                size = cellsize * 4/5// (30)/(2**quotient);
              }
              if(notes.length === 2) {
                size = canvas.width/6
              }
              context.lineWidth = (5 * scale) / 3
              let histoGlpyhData
              let maxHisto
              if (glyphmode === 'circles') {
                if (ai[i]) {
                  if (size > 5) { size = 5 }
                } else {
                  if (size > 10) { size = 10 }
                }
                if ((!modelUsedFlag) && modelUsed[i] !== -1) {
                  context.fillStyle = modelColors3(modelUsed[i])// d3.schemeTableau10[4+(2*modelUsed[i-1])+modelUsed[i-1]%2];
                }
                // mvlib.Canvas.drawFilledCircle(context, xArray[i], yArray[i], (size) * scale)
                mvlib.Canvas.drawCircle(context, xArray[i], yArray[i], size * scale)
              } else if (glyphmode === 'glyphs') {
                console.log(starglyphmode)
                if(starglyphmode){// && !previousStarglyph){
                  maxvalues = calcGlyphMax()
                }else if(!starglyphmode){// && previousStarglyph){
                  maxvalues = {maxl:8,maxnum:16, maxvar:10}
                }
                console.log(maxvalues)
                calcGlyph(context, xArray[i], yArray[i], size * scale, tcol, i, quotient, dataChanged, maxvalues)
              } else if (glyphmode === 'piechartPitch') {
                calcPie(context, xArray[i], yArray[i], size * scale, tcol, notes[i], i, true, dataChanged)
              } else if (glyphmode === 'piechartNotes') {
                calcPie(context, xArray[i], yArray[i], size * scale, tcol, notes[i], i, false, dataChanged)
              } else if (glyphmode === 'histoJumpSingle') {
                if (dataChanged) {
                  histoGlpyhData = calcAllHistoGlyphData()
                  maxHisto = getMaxOcc(histoGlpyhData, mode)
                  glyphData[i] = { d: histoGlpyhData, max: maxHisto }
                } else {
                  histoGlpyhData = glyphData[i].d
                  maxHisto = glyphData[i].max
                }
                calcHistoGlyph(context, xArray[i], yArray[i], size * scale, tcol, histoGlpyhData[i], maxHisto, i, true)
              } else if (glyphmode === 'histoJumpDouble') {
                if (dataChanged) {
                  histoGlpyhData = calcAllHistoGlyphData()
                  maxHisto = getMaxOcc(histoGlpyhData, mode)
                  glyphData[i] = { d: histoGlpyhData, max: maxHisto }
                } else {
                  histoGlpyhData = glyphData[i].d
                  maxHisto = glyphData[i].max
                }
                calcHistoGlyph(context, xArray[i], yArray[i], size * scale, tcol, histoGlpyhData[i], maxHisto, i, false)
              } else if (glyphmode === 'pianoRoll') {
                calcRollGlyph(context, xArray[i], yArray[i], size * scale, tcol, notes[i], i, false, dataChanged)
              }
            /*
              if(close===i&&false){
                context.strokeStyle = "black";
                //color[i]!=="black"?context.strokeStyle = "black":context.strokeStyle = "red";
                mvlib.Canvas.drawCircle(context, xArray[i], yArray[i], size*scale);
              }
              */
            }
          }

          if (clicked[0] !== -1 && clicked[1] !== -1) {
            drawHistogram(clicked[0], clicked[1], 'notes', 1)
            drawHistogram(clicked[0], clicked[1], 'length', 1)
            drawPianoRolls(clicked[0], clicked[1], colormode)
            if (glyphmode === 'piechartPitch') {
              /*const tableau20 = ['(31, 119, 180)', '(174, 199, 232)', '(255, 127, 14)', '(255, 187, 120)',  
                                  ' (44, 160, 44)', '(152, 223, 138)', '(214, 39, 40)', '(255, 152, 150)',  
                                    '(148, 103, 189)', '(197, 176, 213)', '(140, 86, 75)', '(196, 156, 148)',  
                                    '(227, 119, 194)', '(247, 182, 210)', '(127, 127, 127)', '(199, 199, 199)',  
                                    '(188, 189, 34)', '(219, 219, 141)', '(23, 190, 207)', '(158, 218, 229)']
              */
              for (let n = 0; n < 12; n++) {
                contextlegend.fillStyle = noteColormap[n]//d3.schemeTableau10[n % 10] //'rgb' + tableau20[val]
                contextlegend.font = '15px Georgia'
                contextlegend.fillText(MIDI_NOTES[n].name, (n) * (legend.width / 12) + margin.left, legend.height - 4)
              }
            } else if (glyphmode === 'piechartNotes') {
              contextlegend.fillStyle = d3.schemeTableau10[0]
              contextlegend.fillText('no. notes', (0) * (legend.width / 24) + margin.left, legend.height - 4)
              contextlegend.fillStyle = d3.schemeTableau10[1]
              contextlegend.fillText('mean length', (6) * (legend.width / 24) + margin.left, legend.height - 4)
            } else if (colormode === 'color=model') {
              const unique = [...new Set(modelUsed)]
              let n = 0
              unique.forEach((index) => {
                if (index >= 0) {
                  contextlegend.fillStyle = d3.schemeTableau10[index % 10]
                  contextlegend.font = '15px Georgia'
                  contextlegend.fillText(loadedModels[index].name, (n) * (legend.width / unique.length) + margin.left, legend.height - 4)
                  n++
                }
              })
            }
          // context.stroke()
          } else {
            d3.select('#histogramnotes').selectAll('*').remove()
            d3.select('#histogramlength').selectAll('*').remove()
            d3.select('#pianowithevery').selectAll('*').remove()
            d3.select('#pianorolls').selectAll('*').remove()
          // context.stroke()
          }

          /**
        function runScatter () {
          if (distMat !== undefined) {
            const linearRegression = d3r.regressionQuad()
              .x(d => d.temp)
              .y(d => d.dist)
              .domain([temprange.min, temprange.max])

            const scatterdata = []
            const minmaxdata = []
            const mean = []
            let notempmean = true
            let notemp = true
            for (var i = 1; i < distMat[0].length; i++) {
              notemp = true
              scatterdata.push({ temp: temp[i], dist: distMat[parent[i]][i] })
              minmaxdata.forEach((d) => {
                if (d.x1 === temp[i] && d.y0 > distMat[parent[i]][i]) {
                  d.y0 = distMat[parent[i]][i]
                  notemp = false
                } else if (d.x1 === temp[i] && d.y1 < distMat[parent[i]][i]) {
                  d.y1 = distMat[parent[i]][i]
                  notemp = false
                } else if (d.x1 === temp[i]) {
                  notemp = false
                }
              })
              if (notemp === true) { minmaxdata.push({ temp: temp[i], x1: temp[i], y0: distMat[parent[i]][i], y1: distMat[parent[i]][i] }) }

              notempmean = true
              mean.forEach((d) => {
                if (d.temp === temp[i]) {
                  d.sum = d.sum + distMat[parent[i]][i]
                  d.num = d.num + 1
                  notempmean = false
                }
              })
              if (notempmean === true) { mean.push({ temp: temp[i], sum: distMat[parent[i]][i], num: 1 }) }
            }

            mean.forEach((d) => {
              d.sum = d.sum / d.num
            })

            function compare (a, b) {
              if (a.temp < b.temp) {
                return -1
              }
              if (a.temp > b.temp) {
                return 1
              }
              // a muss gleich b sein
              return 0
            }

            minmaxdata.sort(compare)
            mean.sort(compare)

            // var lr = linearRegression(scatterdata);

            return Plot.plot({
              height: (height) - margin.top,
              width: (width) - margin.left,
              marginTop: margin.top,
              grid: true,
              x: {
                axis: 'bottom',
                tickFormat: (e) => { if (e !== 1) return e },
                label: 'temperature',
                labelAnchor: 'center',
                labelOffset: 30
              },
              y: {
                label: 'similarity',
                tickFormat: d3.format('.2')
              },
              marks: [
                /*
                    Plot.line(minmaxdata,{
                      x: "x1",
                      y: "y0",
                      stroke: "#bbb",
                      strokeOpacity: 0.3
                    }),
                    Plot.line(minmaxdata,{
                      x: "x1",
                      y: "y1",
                      stroke: "#bbb",
                      strokeOpacity: 0.3
                    }), *//*
                Plot.area(minmaxdata, {
                  x1: 'x1',
                  y1: 'y0',
                  y2: 'y1',
                  fill: d3.schemeTableau10[0],
                  fillOpacity: 0.3
                }),
                Plot.line(mean, {
                  x: 'temp',
                  y: 'sum',
                  stroke: d3.schemeTableau10[0],
                  strokeOpacity: 1
                }),
                Plot.dot(scatterdata, {
                  x: 'temp',
                  y: 'dist',
                  fill: 'black'
                })
              ]
            })
          }
        }
        */
          // document.getElementById("scattersvg").appendChild(runScatter());
        /*
          var row = distMat[0];
          var values = distMat;
          if(distfuncmode!==4)
            var scaleColor = (d, row, colum) => d3.interpolateViridis(d3.scaleLinear().domain([1,0])(d))
          else{
            var maxValue = getMaxOcc(distMat,1);
            var scaleColor = (d, row, colum) => d3.interpolateViridis(d3.scaleLinear().domain([maxValue,0])(d))
          }
          */
        // clickableTable(row, row, values, width, height, scaleColor,true,color)
        }
      }

      // piano roll glyph
      function calcRollGlyph (ctx, x, y, r, c, notes, j, single, changed) {
        function getColorLightness (color) {
        // return +d3.color(color).formatHsl().split(",")[2].trim().slice(0, -2);
        // Made faster with https://stackoverflow.com/a/596241, but normalizing to 0, 100
          if (color !== undefined) {
            const { r, g, b } = d3.color(color).rgb()
            const Y = (r + r + r + b + g + g + g + g) >> 3
            return Y / 2.55
          } else {
            return 100
          }
        }

        const size = r
        let d

        if (changed) {
          const notes1 = transformRec(notes, 32)
          let pmax = 0
          let pmin = 128
          const length = dataLength(notes1)
          notes1.forEach((note) => {
            if (note.pitch > pmax) { pmax = note.pitch }
            if (note.pitch < pmin) { pmin = note.pitch }
          })
          while(pmax - pmin < 3){
            pmax++
            pmin--
          }
          // pmin --;
          pmax++
          const scaleY = d3.scaleLinear().domain([pmin, pmax]).range([y + size, y - size])
          const scaleX = d3.scaleLinear().domain([0, length]).range([x - size, x + size])
          ctx.strokeOpacity = 1
          const height = scaleY(pmin + 1) - scaleY(pmin)
          d = { notes1: notes1, pmax: pmax, scaleX: scaleX, scaleY: scaleY, height: height }
          glyphData[j] = d
        } else {
          d = glyphData[j]
        }
        // var myColor = (val)=>d3.schemeTableau10[val%10];

        ctx.strokeStyle = c
        ctx.strokeOpacity = 0.3
        ctx.fillStyle = c
        mvlib.Canvas.drawRoundedRect(ctx, d.scaleX(0), d.scaleY(d.pmax), size * 2, size * 2, 0)
        ctx.fill()
        if ((!modelUsedFlag) && modelUsed[j] !== -1) {
          ctx.strokeStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
        }
        ctx.stroke()

        ctx.fillStyle = getColorLightness(c) < 50 ? 'white' : 'black'
        d.notes1.forEach((note) => {
          const width = d.scaleX(note.quantizedEndStep) - d.scaleX(note.quantizedStartStep)
          const tx = d.scaleX(note.quantizedStartStep)
          const ty = d.scaleY(note.pitch)
          mvlib.Canvas.drawRoundedRect(ctx, tx, ty, width, d.height, 0)
          ctx.fill()
        })
      }

      function getMaxOcc (data, mode) {
        let max = 1
        data.forEach((arr, i) => {
          if (!(mode === 2 && i === 0)) {
            const tmax = Math.max(...arr)
            if (tmax > max) { max = tmax }
          }
        })
        return max
      }

      function calcAllHistoGlyphData () {
        const glyphData = Array(notes.length - 1)
        notes.forEach((seq, i) => {
          glyphData[i] = calcHistoGlyphData(seq)
        })
        return glyphData
      }

      // stores occ for jump -12 to 12 in array from 0 to 24; offset 12
      function calcHistoGlyphData (notes) {
        const occ = Array(25).fill(0)
        const distNotes = pitchDiff(notes)
        distNotes.shift()
        distNotes.forEach((diff) => {
          let dist = diff.pitch
          if (dist > 12) { dist = 24 } else if (dist < -12) { dist = 0 } else { dist += 12 }
          occ[dist] = occ[dist] + 1
        })
        return occ
      }

      // single=true is all in one line; false is half upside others downside
      function calcHistoGlyph (ctx, x, y, r, c, histodata, max, j, single) {
        const size = r
        const colorscale = d3.scaleLinear().domain([0, 24])

        // relativer Vergleich normiert auf höhe
        if (relativemode) { 
          max = Math.max(1, Math.max(...histodata))
        }
        // nur Test sonst Blue to Red mit v aber mitte schlecht sichtbar
        const v = (d) => {
          const internscale = d3.scaleLinear().domain([0, 0.5, 1]).range([1, 0, 1])
          /* aber mitte wieder hell
          var lowerColor = (d) => d3.interpolateReds(internscale(d))
          var higherColor = (d) => d3.interpolateBlues(internscale(d))
          */
          const lowerColor = (d) => d3.interpolateRgb('grey', 'blue')(d)
          const higherColor = (d) => d3.interpolateRgb('grey', 'red')(d)
          return d < 0.5 ? lowerColor(internscale(d)) : higherColor(internscale(d))
        }// d3.interpolateRgb("blue","red")(d);

        let scaleY
        let barsize
        let scaleX
        if (single) {
          scaleY = d3.scaleLinear().domain([0, max]).range([y + size / 2, y - size / 2])
          barsize = size / 25
          scaleX = d3.scaleLinear().domain([0, 24]).range([x - size, x + size - barsize - 1])
          ctx.strokeOpacity = 1
          ctx.lineWidth = 1
          histodata.forEach((occ, i) => {
            if (occ > 0) {
              const height = scaleY(occ) - scaleY(0)
              mvlib.Canvas.drawRoundedRect(ctx, scaleX(i), scaleY(0), barsize, height, 0)
              ctx.fillStyle = v(colorscale(i))
              ctx.strokeStyle = v(colorscale(i))
              ctx.fill()
              ctx.stroke()
            }
          })
          ctx.strokeStyle = 'grey'
          ctx.lineWidth = 0.5
          //ctx.strokeOpacity = 0.3
          if ((!modelUsedFlag) && modelUsed[j] !== -1) {
            ctx.strokeStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.fillStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.lineWidth = 1
            mvlib.Canvas.drawRoundedRect(ctx, scaleX(0) - 2, scaleY(max) - 2, size * 2 + 2, size + 2, 0)
          }else{
            mvlib.Canvas.drawRoundedRect(ctx, scaleX(0) - 1, scaleY(max) - 1, size * 2 + 1, size + 1, 0)
          }
          ctx.stroke()
        } else {
          scaleY = d3.scaleLinear().domain([0, max]).range([y, y - size])
          barsize = size / 13
          scaleX = d3.scaleLinear().domain([12, 24]).range([x - size, x + size - barsize - 1])
          ctx.strokeOpacity = 1
          ctx.lineWidth = 1

          if(Math.max(...histodata) === 0)
            console.log(j, y, scaleY(0), max)

          histodata.forEach((occ, i) => {
            if (occ > 0) {
              const height = scaleY(occ) - y
              if(i === 12) {
                const tx = scaleX(24 - i)
                const ty = y - height
                mvlib.Canvas.drawRoundedRect(ctx, tx, ty, barsize, height, 0)
                ctx.fillStyle = v(colorscale(i))
                ctx.strokeStyle = v(colorscale(i))
                ctx.strokeOpacity = 1
                ctx.fill()
                ctx.stroke()
              }
              const tx = i >= 12 ? scaleX(i) : scaleX(24 - i)
              const ty = i >= 12 ? y : y - height
              mvlib.Canvas.drawRoundedRect(ctx, tx, ty, barsize, height, 0)
              ctx.fillStyle = v(colorscale(i))
              ctx.strokeStyle = v(colorscale(i))
              ctx.strokeOpacity = 1
              ctx.fill()
              ctx.stroke()
            }
          })
          ctx.strokeStyle = 'grey'
          //ctx.strokeOpacity = 0.3
          ctx.lineWidth = 0.5
          mvlib.Canvas.drawLine(ctx, scaleX(12), y, scaleX(24) + barsize, y)
          if ((!modelUsedFlag) && modelUsed[j] !== -1) {
            ctx.strokeStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.fillStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.lineWidth = 1
            mvlib.Canvas.drawRoundedRect(ctx, scaleX(12) - 2, scaleY(max) - 2, size * 2 + 2, size * 2 + 2, 0)
          }else{
            mvlib.Canvas.drawRoundedRect(ctx, scaleX(12) - 1, scaleY(max) - 1, size * 2 + 1, size * 2 + 1, 0)
          }
          
          ctx.stroke()
        }
        ctx.fillStyle = c

      // mvlib.Canvas.drawFilledCircle(ctx,x,y,5);
      }

      // intervals of pitches
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

      // variance of sequence
      function calcVariance (notesi) {
      /* var arrayforVariance = [];
        notesi.forEach((note)=>{
          arrayforVariance.push(note.pitch);
        }) */
        if (notesi.length > 0) {
          const newnotes = pitchDiff(notesi)
          newnotes[0].pitch = 0
          const variance = d3.variance(newnotes, d => d.pitch)
          return !isNaN(variance) ? variance : 0
        } else {
          return 0
        }
      }

      function getDist (j, i) {
        if (distMat !== undefined && distMat.length > j && distMat[0].length > i) { return distMat[j][i] } else { return 0 }
      }

      function calcGlyphMax(){
        let maxl = 0
        let maxnum = 0
        let maxvar = 0
        notes.forEach((notesi, i)=>{
          if(i!==0){
            if (maxl < getMeanLength(notesi)) { maxl = getMeanLength(notesi) }
            if (maxnum < notesi.length) { maxnum = notesi.length }
            if (maxvar < calcVariance(notesi)) { maxvar = calcVariance(notesi) }
          }
        })
        return {maxl:maxl,maxnum:maxnum, maxvar:maxvar}
      }

      // data for star glyph
      function calcData (j, maxvalues) {
        let scale = d3.scaleLinear().domain([0, maxvalues.maxnum]).range([0, 1])
        const numberNotes = Math.min(1, scale(notes[j].length))
        scale = d3.scaleLinear().domain([0.2, 1.8]).range([0, 1])
        let temperature = Math.min(1, scale(temp[j]))
        if (temperature < 0) { temperature = 0 }
        scale = d3.scaleLinear().domain([1, maxvalues.maxl]).range([0, 1])
        const meanLength = Math.min(1, scale(getMeanLength(notes[j])))
        scale = d3.scaleLinear().domain([0, maxvalues.maxvar]).range([0, 1])
        const varianceJumps = Math.min(1, scale(calcVariance(notes[j])))
        const dist = getDist(parent[j], j)

        // console.log(numberNotes,meanLength,varianceJumps,dist)

        // numberNotes = 1
        return [{
          className: j,
          axes: [
            { axis: 'numberNotes', value: numberNotes },
            { axis: 'meanLength', value: meanLength },
            { axis: 'varianceJumps', value: varianceJumps },
            // {axis: "temperature", value: temperature},
            { axis: 'similarity', value: dist }
          ]
        }]
      }

      function calcDataPie (notes, pitch) {
        let occ
        if (pitch) {
          occ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          if (notes.length > 0) {
            notes.forEach((note) => {
              const index = note.pitch % 12
              occ[index] = occ[index] + 1
            })
          }
        } else {
          occ = [0, 0]
          if (notes.length > 0) {
            occ[0] = notes.length
            occ[1] = getMeanLength(notes)
          }
        }
        return occ
      }

      function calcPie (ctx, x, y, r, c, notes, j, pitch, changed) {
        /*const tableau20 = ['(31, 119, 180)', '(174, 199, 232)', '(255, 127, 14)', '(255, 187, 120)',  
         ' (44, 160, 44)', '(152, 223, 138)', '(214, 39, 40)', '(255, 152, 150)',  
          '(148, 103, 189)', '(197, 176, 213)', '(140, 86, 75)', '(196, 156, 148)',  
          '(227, 119, 194)', '(247, 182, 210)', '(127, 127, 127)', '(199, 199, 199)',  
          '(188, 189, 34)', '(219, 219, 141)', '(23, 190, 207)', '(158, 218, 229)']
          */

        const size = r
        let lastend = Math.PI * 2 * 0.75
        let myTotal = 0
        const myColor = (val) => noteColormap[val%12]//d3.schemeTableau10[val % 10] //'rgb' + tableau20[val]

        let data
        if (changed) {
          data = calcDataPie(notes, pitch)
          glyphData[j] = data
        } else { data = glyphData[j] }

        for (let e = 0; e < data.length; e++) {
          myTotal += data[e]
        }
        if (myTotal > 1) {
          for (let i = 0; i < data.length; i++) {
            ctx.fillStyle = myColor(i)
            ctx.beginPath()
            ctx.moveTo(x, y)
            // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
            ctx.arc(x, y, size, lastend, (lastend + (Math.PI * 2 * (data[i] / myTotal))) % (Math.PI * 2), false)
            ctx.lineTo(x, y)
            ctx.fill()
            lastend = (lastend + (Math.PI * 2 * (data[i] / myTotal))) % (Math.PI * 2)
          }
          ctx.fillStyle = c
          ctx.lineWidth = 1
          // mvlib.Canvas.drawFilledCircle(ctx,x,y,5);
          if ((!modelUsedFlag) && modelUsed[j] !== -1) {
            ctx.strokeStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.fillStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.lineWidth = 6
            mvlib.Canvas.drawCircle(ctx, x, y, size + 3)
          }
        }
        if (myTotal ===1) {
          for (let i = 0; i < 2; i++) {
            ctx.fillStyle = myColor(data.indexOf(1))
            ctx.beginPath()
            ctx.moveTo(x, y)
            // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
            ctx.arc(x, y, size, 0, (Math.PI) % (Math.PI * 2), false)
            ctx.lineTo(x, y)
            ctx.fill()
            ctx.arc(x, y, size, Math.PI, 0 % (Math.PI * 2), false)
            ctx.lineTo(x, y)
            ctx.fill()
          }
          ctx.fillStyle = c
          // mvlib.Canvas.drawFilledCircle(ctx,x,y,5);
          if ((!modelUsedFlag) && modelUsed[j] !== -1) {
            ctx.strokeStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            ctx.fillStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
            mvlib.Canvas.drawCircle(ctx, x, y, size + 3)
          }
        }
      }

      function calcPolygon (x, y, data, size) {
        const NUM_OF_SIDES = data.axes.length
        const offset = Math.PI
        const polyangle = (Math.PI * 2) / NUM_OF_SIDES
        const center =
              {
                x: x,
                y: y
              }

        const wrapper = d3.select('.chart')
          .append('svg')
          .attr('width', size)
          .attr('height', size)

        d3.select('svg').append('g')
        const generatePoint = ({ length, angle }) => {
          const point =
                {
                  x: center.x - (length * Math.sin(offset - angle)),
                  y: center.y - (length * Math.cos(offset - angle))
                }
          return point
        }

        const points = []
        let length = size
        for (let vertex = 0; vertex < NUM_OF_SIDES; vertex++) {
          const theta = vertex * polyangle
          length = size * data.axes[vertex].value
          points.push(generatePoint({ length, angle: theta }))
        }

        wrapper.remove()
        return points
      }

      // star glyph
      function calcGlyph (ctx, x, y, r, c, j, quotient, changed, maxvalues) {
        const size = r

        let path = []
        /*
        if(changed){

          var svg = d3.select("#glyphtest")
          .append("svg").attr("id","star").attr("width",r).attr("height",r);

          var glyph = RadarChart.chart();

          glyph.config({axisText: false, circles:false,color:(i)=>{return c}, axisLine:true,
          w:size*2,h:size*2,minValue:0,maxValue:1})

          svg.datum(dat).call(glyph);

          var string = d3.select("polygon").attr("pointsString");
          var arr = string.split(" ")
          arr.forEach((d)=>{
            var a = d.split(",")
            path.push({x:x-size+parseFloat(a[0]),y:y-size+parseFloat(a[1])});
          })
          glyphData[j] = path;
          svg.remove();
        }else{
          path = glyphData[j];
        }
        */
        const dat = calcData(j, maxvalues)
        path = calcPolygon(x, y, dat[0], r)
        ctx.strokeStyle = c
        ctx.fillStyle = c
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y)
        }
        ctx.fill()
        ctx.strokeStyle = 'grey'
        ctx.fillStyle = 'grey'
        if ((!modelUsedFlag) && modelUsed[j] !== -1) {
          ctx.strokeStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
          ctx.fillStyle = modelColors3(modelUsed[j])// d3.schemeTableau10[4+(2*modelUsed[j-1])+modelUsed[j-1]%2];
        }
        mvlib.Canvas.drawCircle(ctx, x, y, size)
        ctx.strokeStyle = 'grey'
        ctx.fillStyle = 'grey'
        mvlib.Canvas.drawFilledCircle(ctx, x, y, Math.max(3 / quotient, 0.5))
      }

      function changeModeRect () {
        if (modeRect === 'meanLength') {
          modeRect = 'combinedLength'
        // document.getElementById('histoRect').innerText = modeRect
        } else {
          modeRect = 'meanLength'
        // document.getElementById('histoRect').innerText = modeRect
        }
        once = false
        that.handleRedrawState()
      }

      function gridifyMode () {
      /**
        if(gridify){
          document.getElementById("gridMode").innerText = "gridify off";
        }else {
          document.getElementById("gridMode").innerText = "gridify on";
        }
         */
        gridify = !gridify
        once = false
        that.handleRedrawState()
      }

      function changeRollMode (e) {
        const val = e.target.value
        if (val === 1) {
          rollmode = 'density'
          rollmodeNr = 1
        } else if (val === 2) {
          rollmode = 'all-one'
          rollmodeNr = 2
        } else {
          rollmode = 'separate'
          rollmodeNr = 0
        }
        once = false
        that.handleRedrawState()
      }

      function changeSortMode (e) {
        if (e !== undefined) {
          const val = e.target.value
          if (val === 1) {
            sortmode = 'similarity'
            sortmodeNr = 1
          } else if (val === 2) {
            sortmode = 'variance'
            sortmodeNr = 2
          } else {
            sortmode = 'temperature'
            sortmodeNr = 0
          }
        } else {
          if (sortmode === 'temperature') {
            sortmode = 'similarity'
            sortmodeNr = 1
            tooltipText = 'Sort melodies by similarity in ascending order'
          // document.getElementById('sortmode').innerText = sortmode
          } else if (sortmode === 'similarity') {
            sortmode = 'variance'
            sortmodeNr = 2
            tooltipText = 'Sort melodies by variance in ascending order'
          // document.getElementById('sortmode').innerText = sortmode
          } else {
            sortmode = 'temperature'
            sortmodeNr = 0
            tooltipText = 'Sort melodies by temperature in ascending order'
          // document.getElementById('sortmode').innerText = sortmode
          }
        }
        once = false
        that.handleRedrawState()
      }

      /**
    function changeColorScale () {
      if (colormode === 'color=temperature') {
        colormode = 'color=model'
        // document.getElementById('colorScale').innerText = colormode
      } else {
        colormode = 'color=temperature'
        // document.getElementById('colorScale').innerText = colormode
      }
      once = false
      that.render()
    }
     */

      function changeGlyphMode (e) {
        const val = e.target.value
        if (val === 1) {
          glyphmode = 'glyphs'
          glyphmodeNr = 1
        } else if (val === 2) {
          glyphmode = 'piechartPitch'
          glyphmodeNr = 2
          /**
       * } else if (glyphmode === 'piechartPitch' ) {
        glyphmode = 'piechartNotes'
        document.getElementById('glyphmode').innerText = glyphmode
      */
        } else if (val === 3) { // (glyphmode === "piechartNotes"){
          glyphmode = 'histoJumpSingle'
          glyphmodeNr = 3
        } else if (val === 4) {
          glyphmode = 'histoJumpDouble'
          glyphmodeNr = 4
        } else if (val === 5) {
          glyphmode = 'pianoRoll'
          glyphmodeNr = 5
        } else {
          glyphmode = 'circles'
          glyphmodeNr = 0
        }
        /**
      if (glyphmode === 'circles') {
        glyphmode = 'glyphs'
        document.getElementById('glyphmode').innerText = glyphmode
      } else if (glyphmode === 'glyphs') {
        glyphmode = 'piechartPitch'
        document.getElementById('glyphmode').innerText = glyphmode
      /**
       * } else if (glyphmode === 'piechartPitch' ) {
        glyphmode = 'piechartNotes'
        document.getElementById('glyphmode').innerText = glyphmode
      *//**
      } else if (glyphmode === 'piechartPitch') { // (glyphmode === "piechartNotes"){
        glyphmode = 'histoJumpSingle'
        document.getElementById('glyphmode').innerText = glyphmode
      } else if (glyphmode === 'histoJumpSingle') {
        glyphmode = 'histoJumpDouble'
        document.getElementById('glyphmode').innerText = glyphmode
      } else if (glyphmode === 'histoJumpDouble') {
        glyphmode = 'pianoRoll'
        document.getElementById('glyphmode').innerText = glyphmode
      } else {
        glyphmode = 'circles'
        document.getElementById('glyphmode').innerText = glyphmode
      }
      */
        dataChanged = true
        once = false
        that.handleRedrawState()
      }

      // dataChanged = false

      function tooltip (id, button, data) {
        if (button === 'glyph') {
        // document.getElementById(id).classList.toggle('show')
          tooltipText = 'IF THE SCATTERPLOT IS NOT SHOWN PRESS THE EYE ON THE LEFT UNTIL IT WORKS \n Glypheplanation: \n Starglyph: \n top = number notes \n left = mean length \n bottom = variance of jumps \n right = similarity to parent \n' +
          'Piechartglyph: \n Starting top clockwise C to B \n' +
          'Histogramglyph: \n Intervals: \n blue=-12 keys\n  grey=0\n  red=12\n' +
          'Piano Roll: \n color=Temperature'
        } else if (button === 'separate') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Select visualizations samples: \n Separate Piano Roll \n Combined density \n All-in one piano roll'
        } else if (button === 'circles') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Cycle through different glyphstypes: \n Starglyph \n (multiple attributes) \n Piechartglyph \n (occurrences of keys) \n Histogramglyph \n (occurrences of intervals between notes) \n Pianorollglyph \n (melody)'
        } else if (button === 'grid') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Gridify/ungridify scatterplot to avoid overlapping glyphs'
        } else if (button === 'histo') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Activate relative scale for the histogramglyph or use default absolute scale'
        } else if (button === 'starglyph') {
            // document.getElementById(id).classList.toggle('showlong')
              tooltipText = 'default fix max values for starglyphs but activate to relative max values based on others'
        } else if (button === 'mean') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Activate accumulated duration in histogram beside separate rolls; default mean duration'
        } else if (button === 'weight') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Weight of Rhythm (left) and Melody (right) for distance function'
        } else if (button === 'color') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Activate model differentiation as colorscale; default temperature colorscale'
        } else if (button === 'sortSeparate') {
          tooltipText = 'Sort melodies by metrics  .default ascending order'
        } else if (button === 'seed') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Show composition as point'
        } else if (button === 'distFunction') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Select a distance function'
        } else if (button === 'DRMethod') {
        // document.getElementById(id).classList.toggle('showlong')
          tooltipText = 'Select a dimensionality recudtion method to display similarities in 2D'
        }
      }

      /**
       * <div id="cvscontainer" style={{width:seite+"px",height:seite+"px",overflow:"scroll"}}>
                <canvas width={widthscale} height={heightscale} onMouseUp={(e)=>click(e)} id="mycanvas"></canvas>
              </div>
       */

      // style={{overflowY:"auto"}}

      // after div style text align auto
      // <div id="pianowithevery">
      // </div>
      let img = ''
      if(glyphmode === 'glyphs')
        img = glyphs
      else if(glyphmode === 'pianoRoll')
        img = pianoRoll
      else if(glyphmode === 'piechartPitch')
        img = piechartPitch
      else if(glyphmode === 'histoJumpDouble')
        img = histoJumpDouble
      else if(glyphmode === 'histoJumpSingle')
        img = histoJumpSingle

      try {
        if (glyphmode === 'circles') {
          
          document.getElementById('glyphLegend').style.display = 'none'
        }else{
          document.getElementById('glyphLegend').style.display = 'inline-block'
        }
      } catch (e) {
        console.log(e)
      }

      return (
        <div>
          <div width={widthBox} height={heightBox} style={{ height: heightBox + 'px', width: widthBox + 'px', overflow: 'hidden' }} className='viewDiv'>
            <AppBar position='static' sx={{ backgroundColor: 'toolbar.main' }}>
              <Toolbar variant='dense' sx={{ backgroundColor: 'toolbar.main', height: heightBox * 0.025 }}>
                <Typography color='secondary'>Similarity</Typography>
                <Box sx={{ flexGrow: 0.2 }} />
                <IconButton onClick={(e) => this.render()} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                  <VisibilityIcon
                    id='clusterShow'
                    color='secondary'
                  />
                </IconButton>
                <Box sx={{ flexGrow: 10 }} />
                <IconButton onClick={(e) => this.handleClick(e, 'Layout')} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                  <ScatterPlotIcon
                    id='clusterbutton'
                    aria-controls={openLayout ? 'clustermenu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openLayout ? 'true' : undefined}
                    color='secondary'
                  />
                </IconButton>
                <Menu
                  id='clustermenu'
                  aria-labelledby='clusterbutton'
                  anchorEl={anchorElLayout}
                  open={openLayout}
                  onClose={() => this.handleClose('Layout')}
                // getContentAnchorEl={null}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  sx={{ '& .MuiPaper-root': { backgroundColor: 'toolbar.main' } }}
                >
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Typography>
                      Layout Calculation Parameters
                    </Typography>
                  </MenuItem>
                  <Divider />
                  {/* <button className="button" id="gridMode" onClick={()=>{gridifyMode();}} onMouseEnter={(e)=>{tooltip("infoGlyph","grid")}} onMouseLeave={(e)=>{tooltip("infoGlyph","grid")}}>gridify off</button>
                        */}
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'DRMethod')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='left'>
                      <FormControl variant='standard'>
                        <InputLabel sx={{ color: 'text.main' }} id='drlabel'>DR-Method</InputLabel>
                        <Select
                          label='DRMethod' labelId='drlabel' defaultValue={drMethod} color='primary' variant='standard' autoWidth
                          sx={{
                            color: 'text.main',
                            width: 120,
                            '& .MuiSvgIcon-root': {
                              color: 'text.main'
                            }
                          }}
                          onChange={val => { drMethod = val.target.value; once = false; this.render() }}
                        >
                          <MenuItem key={1} value='MDS'>MDS</MenuItem>
                          <MenuItem key={0} value='TSNE'>t-SNE (notWorking)</MenuItem>
                          <MenuItem key={2} value='UMAP'>UMAP</MenuItem>
                        </Select>
                      </FormControl>
                      {/* <select className='button' id='DRselect' onChange={(val) => { this.value = val; onceEv = false; if (panzoomcanvas !== undefined)panzoomcanvas.dispose(); this.render() }}>
                    <option key={1} value='MDS'>MDS</option>
                    <option key={0} value='TSNE'>t-SNE</option>
                    <option key={2} value='UMAP'>UMAP</option>
                  </select> */}
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'grid')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='left'>
                      <FormControlLabel color='secondary' checked={gridify} control={<Switch onClick={gridifyMode} />} label='Grid' labelPlacement='bottom' />
                    </Tooltip>
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    {/* <select className='button' id='mode' onChange={(val) => { this.value = val; onceEv = false; if (panzoomcanvas !== undefined)panzoomcanvas.dispose(); this.render() }}>
                    <option key={0} value={2}>w/o  seed</option>
                    <option key={1} value={1}>w/ seed</option>
                  </select>
                  <select className="button" id="colorsizecluster" onChange={(val) => {this.value=val;onceEv=false;panzoomcanvas.dispose();this.render();}}>
                        <option key={0} value={1}>Color: Temperature; Size: Fixed</option>
                        <option key={1} value={2}>Color: Temperature; Size: Number of Notes</option>
                        <option key={2} value={3}>Color: Mean of Length; Size: Number of Notes</option>
                        <option key={3} value={4}>Color: Most Pitch; Size: Number of Notes</option>
                      </select> */}

                    <Tooltip onOpen={tooltip('infoGlyph', 'distFunction')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='left'>
                      <FormControl variant='standard'>
                        <InputLabel sx={{ color: 'text.main' }} id='distlabel'>Distance Function</InputLabel>
                        <Select
                          label='distfunc' labelId='distlabel' defaultValue={distfuncmode} color='primary' variant='standard' autoWidth
                          sx={{
                            color: 'text.main',
                            width: 120,
                            '& .MuiSvgIcon-root': {
                              color: 'text.main'
                            }
                          }}
                          onChange={val => { distfuncmode = val.target.value; once = false; this.render() }}
                        >
                          <MenuItem key={0} value={1}>Our Weighted Distance Function</MenuItem>
                          <MenuItem key={1} value={2}>Stringbase Levenshtein</MenuItem>
                          <MenuItem key={2} value={3}>Stringbased Damerau-Levenshtein</MenuItem>
                          <MenuItem key={3} value={4}>Euclidean Distance of Notejumps</MenuItem>
                        </Select>
                        {/* <select className='button' id='distfunc' onChange={(val) => { this.value = val; onceEv = false; if (panzoomcanvas !== undefined)panzoomcanvas.dispose(); this.render() }}>
                      <option key={0} value={1}>Our Weighted Distance Function</option>
                      <option key={1} value={2}>Stringbase Levenshtein</option>
                      <option key={2} value={3}>Stringbased Damerau-Levenshtein</option>
                      <option key={3} value={4}>Euclidean Distance of Notejumps</option>
                    </select> */}
                      </FormControl>
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{color: 'text.main', backgroundColor: 'toolbar.main',justifyContent: 'center'}}>
                      <Typography>
                          Weighting
                      </Typography>
                    </MenuItem>
                    <MenuItem sx={{color: 'text.main', backgroundColor: 'toolbar.main',justifyContent: 'center'}}>
                      <Typography>
                          Rhythm - Melody
                      </Typography>
                    </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'weight')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='left'>
                      <Slider
                        sx={{ width: 180 }}
                        color='primary'
                        getAriaLabel={() => 'Weight'}
                        onChange={(e, d) => { weightDist = d }}
                        onChangeCommitted={(e) => { if (e.type === 'mouseup') { once = false; this.render() } }}
                        valueLabelDisplay='auto'
                        step={0.05}
                        min={0}
                        max={1}
                        defaultValue={weightDist}
                      />
                    </Tooltip>
                  </MenuItem>

                  {/** <input className="button" type="text" id="weights4" onChange={(v)=>this.value=v}></input> */}
                  {/**
                  <div className='infotip'>
                    <span className='infotiptext' id='infoGlyph' />
                  </div>
                  */}

                  {/* Rhythm
                      <input type="range" min="0" max="1" className="slider" id="weights" orient="vertical" step="0.05" onChange={(val)=> {updateTextInput(val);onceEv=false;this.render()}} onMouseEnter={(e)=>{tooltip("infoGlyph","weight")}} onMouseLeave={(e)=>{tooltip("infoGlyph","weight")}}></input>
                      Melody */}
                </Menu>
                <Box sx={{ flexGrow: 0.2 }} />
                <IconButton onClick={(e) => this.handleClick(e, 'Vis')} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                  <VisibilityIcon
                    id='clusterbuttonVis'
                    aria-controls={openVis ? 'clustermenuVis' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openVis ? 'true' : undefined}
                    color='secondary'
                  />
                </IconButton>
                <Menu
                  id='clustermenuVis'
                  aria-labelledby='clusterbuttonVis'
                  anchorEl={anchorElVis}
                  open={openVis}
                  onClose={() => this.handleClose('Vis')}
                // getContentAnchorEl={null}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  sx={{ '& .MuiPaper-root': { backgroundColor: 'toolbar.main' } }}
                >
                  <MenuItem sx={{ color: 'text.main' }}>
                    <Typography>
                      Visual Parameters
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'circles')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='right'>
                      {/**  <button className='button' id='glyphmode' onClick={changeGlyphMode}>circles</button> */}
                      <FormControl variant='standard'>
                        <InputLabel sx={{ color: 'text.main' }} id='glyphlabel'>Glyphs</InputLabel>
                        <Select
                          labelId='glyphlabel' defaultValue={glyphmodeNr} color='primary' variant='standard' autoWidth
                          sx={{
                            color: 'text.main',
                            width: 100,
                            '& .MuiSvgIcon-root': {
                              color: 'text.main'
                            }
                          }}
                          onChange={val => { changeGlyphMode(val) }}
                        >
                          <MenuItem key={0} value={0}>Circles</MenuItem>
                          <MenuItem key={1} value={1}>Starglyph</MenuItem>
                          <MenuItem key={2} value={2}>Pieglyph</MenuItem>
                          <MenuItem key={3} value={3}>Histoglyph</MenuItem>
                          <MenuItem key={4} value={4}>dHistoglyph</MenuItem>
                          <MenuItem key={5} value={5}>Pianorollglyph</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    {/**
                  <Tooltip onOpen={tooltip('infoGlyph', 'color')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='top'>
                    <FormControlLabel color='secondary' control={<Switch onClick={changeColorScale} />} label='Model Diff' labelPlacement='bottom' />
                  </Tooltip>
                  */}
                    <Tooltip onOpen={tooltip('infoGlyph', 'histo')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='right'>
                      <FormControlLabel color='secondary' checked={relativemode} control={<Switch onClick={() => { relativemode ? relativemode = false : relativemode = true; this.handleRedrawState() }} />} label='Histo scale' labelPlacement='bottom' />
                      {/** <button className='button' id='histoGlyphRela' onClick={() => { relativemode ? relativemode = false : relativemode = true; this.render() }}>histGlyphRelativeMode</button> */}
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'starglyph')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='right'>
                      <FormControlLabel color='secondary' checked={starglyphmode} control={<Switch onClick={() => { starglyphmode ? starglyphmode = false : starglyphmode = true; this.render(); }} />} label='Starglyph scale' labelPlacement='bottom' />
                      {/** <button className='button' id='histoGlyphRela' onClick={() => { relativemode ? relativemode = false : relativemode = true; this.render() }}>histGlyphRelativeMode</button> */}
                    </Tooltip>
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'separate')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='right'>
                      {/* <button className='button' id='rollmode' onClick={changeRollMode}>separate</button> */}
                      <FormControl variant='standard'>
                        <InputLabel sx={{ color: 'text.main' }} id='acclabel'>Accumulation</InputLabel>
                        <Select
                          labelId='acclabel' defaultValue={rollmodeNr} color='primary' variant='standard' autoWidth
                          sx={{
                            color: 'text.main',
                            width: 100,
                            '& .MuiSvgIcon-root': {
                              color: 'text.main'
                            }
                          }}
                          onChange={val => { changeRollMode(val) }}
                        >
                          <MenuItem key={0} value={0}>Seperate</MenuItem>
                          <MenuItem key={1} value={1}>Density</MenuItem>
                          <MenuItem key={2} value={2}>AllinOne</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'sortSeparate', sortmode)} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='right'>
                      {/** <IconButton color='inherit' onClick={changeSortMode}>
                      <SortIcon />
                    </IconButton>
                    <button className='button' id='sortmode' onClick={changeSortMode}>temperature</button> */}
                      <FormControl variant='standard'>
                        <InputLabel sx={{ color: 'text.main' }} id='sortlabel'>Sorting</InputLabel>
                        <Select
                          labelId='sortlabel' defaultValue={sortmodeNr} color='primary' variant='standard' autoWidth
                          sx={{
                            color: 'text.main',
                            width: 120,
                            '& .MuiSvgIcon-root': {
                              color: 'text.main'
                            }
                          }}
                          onChange={val => { changeSortMode(val) }}
                        >
                          <MenuItem key={0} value={0}>Temperature</MenuItem>
                          <MenuItem key={1} value={1}>Similarity</MenuItem>
                          <MenuItem key={2} value={2}>Variance</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip title='Activate descending order else accending' placement='right'>
                      <FormControlLabel color='secondary' checked={sortDesc} control={<Switch onClick={() => { sortDesc = !sortDesc; once = false; that.handleRedrawState() }} />} label='Desc' labelPlacement='bottom' />
                    </Tooltip>
                  </MenuItem>
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'mean')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='right'>
                      <FormControlLabel color='secondary' checked={modeRect !== 'meanLength'} control={<Switch onClick={changeModeRect} />} label='Duration' labelPlacement='bottom' />
                      {/* <button className='button' id='histoRect' onClick={changeModeRect}>meanLength</button> */}
                    </Tooltip>
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main', justifyContent: 'center' }}>
                    <Tooltip onOpen={tooltip('infoGlyph', 'seed')} title={tooltipText} placement='right'>
                      <FormControlLabel
                        color='secondary' checked={compositionDisplay === 1} control={
                          <Switch onClick={() => {
                            compositionDisplay = compositionDisplay === 1 ? 2 : 1
                            once = false
                            this.handleRedrawState()
                          }}
                          />
                        } label='Composition' labelPlacement='bottom'
                      />
                    </Tooltip>
                  </MenuItem>
                </Menu>
                <Box sx={{ flexGrow: 0.2 }} />
                <Tooltip onOpen={tooltip('infoGlyph', 'glyph')} title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>} placement='top'>
                  <HelpIcon color='secondary' />
                </Tooltip>
                <Box sx={{ flexGrow: 0.3 }} />
                <IconButton onClick={() => closeView(2, false)} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                  <CloseIcon color='secondary' />
                </IconButton>
              </Toolbar>
            </AppBar>
            <div style={{ marginTop: '-7px', textAlign: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-block', width: seiteScatter + 'px', height: seiteScatter + 20 + 'px', marginTop: '16px', marginLeft: '2px' }}>
                <div id='cvscontainer' style={{ display: 'inline-block', width: seiteScatter + 'px', height: seiteScatter + 'px', overflow: 'hidden' }}>
                  <canvas width={widthscale} height={heightscale} onMouseUp={(e) => click(e)} onContextMenu={(e) => context(e)} id='mycanvas' class='pointer' />
                </div>
                <canvas id='legend' width={seiteScatter} height={15} />
              </div>
              <div id='pianorolls' style={{ display: 'inline-block', width: seite + 'px', height: seiteDiv + 10 + 'px', overflowX: 'hidden', overflowY: 'auto' }} />
              <div style={{ display: 'inline-block', marginTop: '2px', marginLeft: '2px'}} >
                <img id='glyphLegend' src={img} width={widthLegend} height={heightLegend} style={{ display: 'inline-block', marginBottom: marginBottomLegend+'px' }}/>
                <div style={{ display: 'inline-block', textAlign: 'center', justifyContent: 'space-between', width: widthHisto + 3 + 'px', height: 2 * heightHisto + 6 + 'px' }}>
                  <svg width={widthHisto} height={heightHisto + margin.bottom} id='histogramnotes' />
                  <svg width={widthHisto} height={heightHisto + margin.bottom} id='histogramlength' />
                </div>
              </div>
              {/* <div>
                  <div width={width} height={height} id="scattersvg"></div>
                    <canvas width={width} height={height} id="matrixcan"></canvas>
                  </div>
                <div><svg width={0} height={0} id="glyphtest"></svg>
                </div> */}
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
export default ClusterChart
