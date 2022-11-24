import './App.css'
import * as mm from '@magenta/music'
import React, { useState } from 'react'
import * as Tone from 'tone'
import * as mvlib from 'musicvis-lib'
import PianoChart from './Chart'
import ClusterChart from './Cluster'
// import DiffChart from './Diff'
import * as d3 from 'd3'
// import CellChart from './Cells'
import ScatterChooseChart from './2DChoose'
import Fretboard from './Fretboard'
import IcicleRolls from './IcicleRolls'
import NodeLinkRolls from './NodeLinkRolls'
import { saveAs } from 'file-saver'
import { Midi } from '@tonejs/midi'
import * as Tonal from '@tonaljs/tonal'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faInfo } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'
import Select /* {Select as Select} */ from 'react-select'
import IconButton from '@mui/material/IconButton'
import UndoIcon from '@mui/icons-material/Undo'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import MicIcon from '@mui/icons-material/Mic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import TextField from '@mui/material/TextField'
// import { Select as mSelect } from '@mui/material/Select'
import * as muiSelect from '@mui/material/Select'
// import * as mui /*muiSelect.default*/ from '@mui/material/Select';
import Grid from '@mui/material/Grid'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Tooltip from '@mui/material/Tooltip'
import HelpIcon from '@mui/icons-material/Help'
import Modal from '@mui/material/Modal'
import Divider from '@mui/material/Divider'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const modelUsedFlag = false // false multimodel; true no visual differentiation

const rnnsteps = 32
const brush = { min: 0, max: 0, active: false }
const octaveRange = { lowest: 48, highest: 72, adjust: true }
let darkmode = 'LightMode'
let player
let rec
const midiinputs = []
let popmeloval = 0
const temprange = { min: 0.8, max: 1.2 }
let bpm = 120
let loadRNNAuto = false
let musicRnn
const synth = new Tone.PolySynth().toDestination()

let fretData = []
let dataminGuitar = 0

// var tabState = 1

let loadedModels = []
let allModels = []
let loadModelsOnce = false

let autoUpdate = true

let xPlay

let midiInputSelected = 0
/**
var checkpoints = ["https://storage.googleapis.com/magentadata/js/checkpoints/musicRnn/basic_rnn",
  "https://storage.googleapis.com/magentadata/js/checkpoints/musicRnn/melody_rnn",
  "https://storage.googleapis.com/magentadata/js/checkpoints/musicRnn/chord_pitches_improv"
]
*/

let currentCheckpoint = 0

const spec = {
  type: 'MusicRNN',
  dataConverter: {
    type: 'MelodyConverter',
    args: {
      minPitch: 48,
      maxPitch: 83
    }
  },
  chordEncoder: 'PitchChordEncoder'
}

const chord = ['D7', 'C4']

const scattertest = false

let mainmeloStates = []

let meloViewStates = []

let selectedModelValue = []

let dropdownselection = 0

let firstLoad = false

let colorscale = 2

let colorScaleForLegend

let partialGrid = 0

let lastcall = 0

let numnotesrecorded = 0

const gridMargin = 8

let views = [false, false, false, false, false]
let preGuitarView = [false, false, false, false, false]
const viewID = ['ird', 'nld', 'simd', 'cord', 'fretd']

let provVis = false

let firsttime = true

let nums = 3
let minNotes = 1

let onceHooked = true

let indexesOfView = []

let currentMeloView = {
  notes: [],
  ai: [],
  color: [],
  temp: [],
  parent: [],
  lastnotai: 0,
  fill: [],
  modelUsed: []
}

const openStringSeperate = true

let theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Roboto',
      // textTransform: 'none',
      fontSize: 16
    }
  },
  palette: {
    primary: {
      main: '#6b6b6b'
    },
    secondary: {
      main: '#6b6b6b'
    },
    text: {
      main: '#6b6b6b'
    },
    toolbar: {
      main: '#ffffff'
    }
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1em'
        }
      }
    }
  }
})

function App () {
  /*
  const [tempvalue, setTempValue] = React.useState([0.8, 1.2]);
  temprange.min = tempvalue[0]
  temprange.max = tempvalue[1]
  */

  // let main

  /*  useEffect(() => {
      main = new Runtime();
      main = main.module(notebook, name => {
        if (name === "chart") return new Inspector(chartRef.current);
      });
      //return () => runtime.dispose();
    }, []);
  */

  let start = {
    notes: [],
    ai: [],
    color: [],
    temp: [],
    parent: [],
    lastnotai: 0,
    fill: [],
    modelUsed: []
  }

  if (!firstLoad) {
    console.log(firstLoad)
    const obj = mvlib.Utils.getObjectFromLocalStorage('state')
    if (obj !== undefined && obj !== null) {
      start = obj
    }
    firstLoad = true
  }
  let tt = {
    notes: [],
    ai: [],
    color: [],
    temp: [],
    parent: [],
    lastnotai: 0,
    fill: [],
    modelUsed: []
  }

  const recseq = { notes: [] }

  const adaptTT = (data, index, startData) => {
    try {
      let adapt = true
      if (startData !== undefined) {
        tt.notes = data
        tt.ai = [startData.ai]
        tt.temp = [startData.temp]
        tt.parent = [startData.parent]
        tt.lastnotai = [startData.lastnotai]
        tt.fill = [startData.fill]
        tt.modelUsed = [startData.modelUsed]
      } else if (startData === undefined && index === undefined) {
        if (data.length === 1 && data[0].length === 0) {
          adapt = false
          newData()
        } else {
          tt.notes = data
        }
      } else {
        index.forEach((noteIndex, eachIndex) => {
          tt.notes[noteIndex] = data[eachIndex]
        })
      }
      if (adapt) {
        tt.lastnotai = dataLength(tt, false)
        viewData(tt)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const adaptDropdown = (index, clickx, clicky) => {
    // document.getElementById("dropdown").value = index+1;
    if (dropdownselection !== index + 1) {
      dropdownselection = index + 1
    } else {
      dropdownselection = 0
    }
    // document.getElementById("clicked").value = clickx+","+clicky;
    viewData(tt)
  }

  const closeView = (index, state) => {
    /*
    views[index] = state
    state ? partialGrid++ : partialGrid--
    views[4] = false
    resize()
    */
    toggleView(index)
  }

  const setMeloIcicle = async (melo, mode) => {
    try {
      /*
      if (mode) {
        loadRNNAuto = true
      }
      await mainmeloStates.push(newObject(mainmelo))
      mvlib.Utils.storeObjectInLocalStorage('state', melo)
      setMainmelo(melo)
      dropdownselection = 0
      if (!mode) {
        await meloViewStates.push(newObject(meloView))
        setmeloView(melo)
      }
      */
      dropdownselection = 0
      if (!mode) {
        viewData(melo)
      } else {
        loadRNNAuto = true
        await mainmeloStates.push(newObject(mainmelo))
        mvlib.Utils.storeObjectInLocalStorage('state', melo)
        dropdownselection = 0
        await meloViewStates.push(newObject(meloView))
        setMainmelo(melo)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const setfretData = (tabs) => {
    fretData = tabs
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [drawerState, setDrawerState] = React.useState(Boolean)
  // const [viewState, setViewState] = React.useState(views)

  const [openModal, setOpenModal] = React.useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const toggleDrawer = (open, anchor) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawerState(open)
  }

  const [mainmelo, setMainmelo] = useState(start)
  const [meloView, setmeloView] = useState(start)

  tt = {
    notes: mainmelo.notes,
    ai: mainmelo.ai,
    color: mainmelo.color,
    temp: mainmelo.temp,
    parent: mainmelo.parent,
    lastnotai: mainmelo.lastnotai,
    fill: mainmelo.fill,
    modelUsed: mainmelo.modelUsed
  }

  /* brush.min = 0;
  brush.max = tt.lastnotai;
  brush.active = false;
  */

  const EMPTY = {
    notes: [{ pitch: 60, quantizedStartStep: 0, quantizedEndStep: 0, provenance: 4 }],
    totalTime: 64
  }

  const TWINKLE_TWINKLE = {
    notes: [
      { pitch: 60, quantizedStartStep: 0, quantizedEndStep: 4, id: 0, provenance: 4 },
      { pitch: 60, quantizedStartStep: 4, quantizedEndStep: 8, id: 1, provenance: 4 },
      { pitch: 67, quantizedStartStep: 8, quantizedEndStep: 12, id: 2, provenance: 4 },
      { pitch: 67, quantizedStartStep: 12, quantizedEndStep: 16, id: 3, provenance: 4 },
      { pitch: 69, quantizedStartStep: 16, quantizedEndStep: 20, id: 4, provenance: 4 },
      { pitch: 69, quantizedStartStep: 20, quantizedEndStep: 24, id: 5, provenance: 4 },
      { pitch: 67, quantizedStartStep: 24, quantizedEndStep: 32, id: 6, provenance: 4 },
      { pitch: 65, quantizedStartStep: 32, quantizedEndStep: 36, id: 7, provenance: 4 },
      { pitch: 65, quantizedStartStep: 36, quantizedEndStep: 40, id: 8, provenance: 4 },
      { pitch: 64, quantizedStartStep: 40, quantizedEndStep: 44, id: 9, provenance: 4 },
      { pitch: 64, quantizedStartStep: 44, quantizedEndStep: 48, id: 10, provenance: 4 },
      { pitch: 62, quantizedStartStep: 48, quantizedEndStep: 52, id: 11, provenance: 4 },
      { pitch: 62, quantizedStartStep: 52, quantizedEndStep: 56, id: 12, provenance: 4 },
      { pitch: 60, quantizedStartStep: 56, quantizedEndStep: 64, id: 13, provenance: 4 }
    ],
    totalTime: 8
  }

  const CRAZY_TRAIN = {
    notes: [
      { pitch: 54, quantizedStartStep: 0, quantizedEndStep: 2, provenance: 4 },
      { pitch: 54, quantizedStartStep: 2, quantizedEndStep: 4, provenance: 4 },
      { pitch: 61, quantizedStartStep: 4, quantizedEndStep: 6, provenance: 4 },
      { pitch: 54, quantizedStartStep: 6, quantizedEndStep: 8, provenance: 4 },
      { pitch: 62, quantizedStartStep: 8, quantizedEndStep: 10, provenance: 4 },
      { pitch: 54, quantizedStartStep: 10, quantizedEndStep: 12, provenance: 4 },
      { pitch: 61, quantizedStartStep: 12, quantizedEndStep: 14, provenance: 4 },
      { pitch: 54, quantizedStartStep: 14, quantizedEndStep: 16, provenance: 4 },
      { pitch: 59, quantizedStartStep: 16, quantizedEndStep: 18, provenance: 4 },
      { pitch: 57, quantizedStartStep: 18, quantizedEndStep: 20, provenance: 4 },
      { pitch: 56, quantizedStartStep: 20, quantizedEndStep: 22, provenance: 4 },
      { pitch: 57, quantizedStartStep: 22, quantizedEndStep: 24, provenance: 4 },
      { pitch: 59, quantizedStartStep: 24, quantizedEndStep: 26, provenance: 4 },
      { pitch: 57, quantizedStartStep: 26, quantizedEndStep: 28, provenance: 4 },
      { pitch: 56, quantizedStartStep: 28, quantizedEndStep: 30, provenance: 4 },
      { pitch: 52, quantizedStartStep: 30, quantizedEndStep: 32, provenance: 4 },
      { pitch: 54, quantizedStartStep: 32, quantizedEndStep: 34, provenance: 4 },
      { pitch: 54, quantizedStartStep: 34, quantizedEndStep: 36, provenance: 4 },
      { pitch: 61, quantizedStartStep: 36, quantizedEndStep: 38, provenance: 4 },
      { pitch: 54, quantizedStartStep: 38, quantizedEndStep: 40, provenance: 4 },
      { pitch: 62, quantizedStartStep: 40, quantizedEndStep: 42, provenance: 4 },
      { pitch: 54, quantizedStartStep: 42, quantizedEndStep: 44, provenance: 4 },
      { pitch: 61, quantizedStartStep: 44, quantizedEndStep: 46, provenance: 4 },
      { pitch: 54, quantizedStartStep: 46, quantizedEndStep: 48, provenance: 4 },
      { pitch: 59, quantizedStartStep: 48, quantizedEndStep: 50, provenance: 4 },
      { pitch: 57, quantizedStartStep: 50, quantizedEndStep: 52, provenance: 4 },
      { pitch: 56, quantizedStartStep: 52, quantizedEndStep: 54, provenance: 4 },
      { pitch: 57, quantizedStartStep: 54, quantizedEndStep: 56, provenance: 4 },
      { pitch: 59, quantizedStartStep: 56, quantizedEndStep: 58, provenance: 4 },
      { pitch: 57, quantizedStartStep: 58, quantizedEndStep: 60, provenance: 4 },
      { pitch: 56, quantizedStartStep: 60, quantizedEndStep: 62, provenance: 4 },
      { pitch: 52, quantizedStartStep: 62, quantizedEndStep: 64, provenance: 4 }
    ]
  }

  const SMOKE_WATER = {
    notes: [
      { pitch: 55, quantizedStartStep: 0, quantizedEndStep: 4, provenance: 4 },
      { pitch: 58, quantizedStartStep: 4, quantizedEndStep: 8, provenance: 4 },
      { pitch: 60, quantizedStartStep: 8, quantizedEndStep: 14, provenance: 4 },
      { pitch: 55, quantizedStartStep: 14, quantizedEndStep: 18, provenance: 4 },
      { pitch: 58, quantizedStartStep: 18, quantizedEndStep: 22, provenance: 4 },
      { pitch: 61, quantizedStartStep: 22, quantizedEndStep: 24, provenance: 4 },
      { pitch: 60, quantizedStartStep: 24, quantizedEndStep: 32, provenance: 4 },
      { pitch: 55, quantizedStartStep: 32, quantizedEndStep: 36, provenance: 4 },
      { pitch: 58, quantizedStartStep: 36, quantizedEndStep: 40, provenance: 4 },
      { pitch: 60, quantizedStartStep: 40, quantizedEndStep: 46, provenance: 4 },
      { pitch: 58, quantizedStartStep: 46, quantizedEndStep: 50, provenance: 4 },
      { pitch: 55, quantizedStartStep: 50, quantizedEndStep: 64, provenance: 4 }
    ]
  }

  const SHAPE_YOU = {
    notes: [
      { pitch: 64, quantizedStartStep: 6, quantizedEndStep: 7, provenance: 4 },
      { pitch: 66, quantizedStartStep: 7, quantizedEndStep: 8, provenance: 4 },
      { pitch: 68, quantizedStartStep: 8, quantizedEndStep: 10, provenance: 4 },
      { pitch: 66, quantizedStartStep: 10, quantizedEndStep: 11, provenance: 4 },
      { pitch: 64, quantizedStartStep: 11, quantizedEndStep: 12, provenance: 4 },
      { pitch: 64, quantizedStartStep: 12, quantizedEndStep: 14, provenance: 4 },
      { pitch: 66, quantizedStartStep: 14, quantizedEndStep: 16, provenance: 4 },
      { pitch: 64, quantizedStartStep: 16, quantizedEndStep: 17, provenance: 4 },
      { pitch: 61, quantizedStartStep: 21, quantizedEndStep: 22, provenance: 4 },
      { pitch: 64, quantizedStartStep: 22, quantizedEndStep: 23, provenance: 4 },
      { pitch: 66, quantizedStartStep: 23, quantizedEndStep: 24, provenance: 4 },
      { pitch: 68, quantizedStartStep: 24, quantizedEndStep: 26, provenance: 4 },
      { pitch: 66, quantizedStartStep: 26, quantizedEndStep: 27, provenance: 4 },
      { pitch: 64, quantizedStartStep: 27, quantizedEndStep: 28, provenance: 4 },
      { pitch: 64, quantizedStartStep: 28, quantizedEndStep: 30, provenance: 4 },
      { pitch: 66, quantizedStartStep: 30, quantizedEndStep: 32, provenance: 4 },
      { pitch: 61, quantizedStartStep: 32, quantizedEndStep: 33, provenance: 4 },
      { pitch: 61, quantizedStartStep: 37, quantizedEndStep: 38, provenance: 4 },
      { pitch: 64, quantizedStartStep: 38, quantizedEndStep: 39, provenance: 4 },
      { pitch: 66, quantizedStartStep: 39, quantizedEndStep: 40, provenance: 4 },
      { pitch: 68, quantizedStartStep: 40, quantizedEndStep: 42, provenance: 4 },
      { pitch: 61, quantizedStartStep: 42, quantizedEndStep: 44, provenance: 4 },
      { pitch: 64, quantizedStartStep: 44, quantizedEndStep: 46, provenance: 4 },
      { pitch: 66, quantizedStartStep: 46, quantizedEndStep: 48, provenance: 4 },
      { pitch: 66, quantizedStartStep: 48, quantizedEndStep: 49, provenance: 4 },
      { pitch: 64, quantizedStartStep: 54, quantizedEndStep: 55, provenance: 4 },
      { pitch: 66, quantizedStartStep: 55, quantizedEndStep: 56, provenance: 4 },
      { pitch: 68, quantizedStartStep: 56, quantizedEndStep: 58, provenance: 4 },
      { pitch: 66, quantizedStartStep: 58, quantizedEndStep: 59, provenance: 4 },
      { pitch: 64, quantizedStartStep: 59, quantizedEndStep: 60, provenance: 4 },
      { pitch: 66, quantizedStartStep: 60, quantizedEndStep: 63, provenance: 4 },
      { pitch: 61, quantizedStartStep: 63, quantizedEndStep: 64, provenance: 4 }
    ]
  }

  const popmelo = [EMPTY, TWINKLE_TWINKLE, CRAZY_TRAIN, SMOKE_WATER, SHAPE_YOU]
  const options = []
  for (let i = 1; i <= mainmelo.ai.length; i++) {
    options.push({ value: i })
  }

  let temp

  // const [play, setPlay] = useState("Play");
  // let playBool = true

  // let qns1 = null

  // midi Test
  // const midiOutput = null
  // let currentSequenceId = -1

  const tempbyslider = false

  // let intervals = [0, 4, 7, 11, 12, 11, 7, 4];
  // const sequence =  intervals.map(x => x + START);

  // const NOTE_ON = 0x90
  // const NOTE_OFF = 0x80

  // let NOTE_DURATION = 300

  const midiKeys = new Set(['a', 's', 'd', 'f', 'g', 'h', 'j', 'w', 'e', 't', 'z', 'u'])

  const array = [{ key: 'a', midi: 60, note: 'C4' },
    { key: 'w', midi: 61, note: 'C#4' },
    { key: 's', midi: 62, note: 'D4' },
    { key: 'e', midi: 63, note: 'D#4' },
    { key: 'd', midi: 64, note: 'E4' },
    { key: 'f', midi: 65, note: 'F4' },
    { key: 't', midi: 66, note: 'F#4' },
    { key: 'g', midi: 67, note: 'G4' },
    { key: 'z', midi: 68, note: 'G#4' },
    { key: 'y', midi: 68, note: 'G#4' },
    { key: 'h', midi: 69, note: 'A4' },
    { key: 'u', midi: 70, note: 'A#4' },
    { key: 'j', midi: 71, note: 'B4' },
    { key: 'k', midi: 72, note: 'C5' },
    { key: 'o', midi: 73, note: 'C#4' },
    { key: 'l', midi: 74, note: 'D5' }]

  let startTimeStamp = 0

  const pressed = {}

  /*
    Play Note while recording
    in: event
    out: none
  */
  function onButtonPress (e) {
    try {
      if (midiKeys.has(e.key) && rec.isRecording()) {
        if (pressed[e.which]) return
        const pitch = array.filter(obj => obj.key === e.key)
        synth.triggerAttack(pitch[0].note)//, now)
        pressed[e.which] = e.timeStamp
        e.preventDefault()
      }
    } catch (e) {
      console.log(e)
    }
  }

  /*
    Release Note while recording and store note in array
    in: event
    out: none
  */
  function onButtonRelease (e) {
    try {
      if (midiKeys.has(e.key)) {
        e.preventDefault()
        if (!pressed[e.which]) return
        let pitch = array.filter(obj => obj.key === e.key)
        synth.triggerRelease(pitch[0].note)// now)
        const duration = (e.timeStamp - pressed[e.which]) / 1000
        const startTime = (pressed[e.which] - startTimeStamp) / 1000
        const endTime = startTime + duration
        pitch = pitch[0].midi
        recseq.notes.push({ pitch: pitch, startTime: startTime, endTime: endTime, provenance: 4 })
        numnotesrecorded = recseq.notes.length
        document.getElementById('numnotesrecorded').innerHTML = numnotesrecorded
        pressed[e.which] = 0
      }
    } catch (e) {
      console.log(e)
    }
  }

  // Deep copy for history of states
  function newObject (arr) {
    const clone = cloneDeep(arr)
    return clone
  }

  /**
  // old unused deep copy
  function newObjectold (arr) {
    var clone = {
      notes: [],
      ai: [],
      color: [],
      temp: [],
      parent: [],
      lastnotai: 0,
      fill: []
    }
    clone.notes = [...arr.notes]
    clone.ai = [...arr.ai]
    clone.color = [...arr.color]
    clone.temp = [...arr.temp]
    clone.parent = [...arr.parent]
    clone.lastnotai = arr.lastnotai
    clone.fill = [...arr.fill]
    console.log(clone)
    return clone
  }

  */

  // Change between Light and Dark mode
  function func () {
    try {
      const bc = document.getElementsByClassName('button')
      if (darkmode === 'DarkMode') {
        darkmode = 'LightMode'
        // document.getElementById("colorMode").innerText = darkmode;
        document.getElementsByClassName('App')[0].style.background = ''
        document.getElementsByClassName('App')[0].style.color = ''
        for (let i = 0; i < bc.length; i++) { bc[i].style.background = '' }
        theme = createTheme({
          typography: {
            allVariants: {
              fontFamily: 'Roboto',
              // textTransform: 'none',
              fontSize: 16
            }
          },
          palette: {
            primary: {
              main: '#6b6b6b'
            },
            secondary: {
              main: '#6b6b6b'
            },
            text: {
              main: '#6b6b6b'
            },
            toolbar: {
              main: '#ffffff'
            }
          },
          components: {
            MuiTooltip: {
              styleOverrides: {
                tooltip: {
                  fontSize: '1em'
                }
              }
            }
          }
        })
      } else {
        darkmode = 'DarkMode'
        // document.getElementById("colorMode").innerText = darkmode;
        document.getElementsByClassName('App')[0].style.background = '#333'
        document.getElementsByClassName('App')[0].style.color = '#eee'
        for (let i = 0; i < bc.length; i++) { bc[i].style.background = '#333' }
        theme = createTheme({
          typography: {
            allVariants: {
              fontFamily: 'Roboto',
              // textTransform: 'none',
              fontSize: 16
            }
          },
          palette: {
            primary: {
              main: '#eeeeee'
            },
            secondary: {
              main: '#eeeeee'
            },
            text: {
              main: '#888888'
            },
            toolbar: {
              main: '#333333'
            }
          },
          components: {
            MuiTooltip: {
              styleOverrides: {
                tooltip: {
                  fontSize: '1em'
                }
              }
            }
          }
        })
      }
      resize()

    /*
    if(play === "Stop"){
      setPlay("Play");
      playBool = false;
      return;
    }else{
      navigator.requestMIDIAccess()
      .then(function(midiAccess) {
      const outputs = midiAccess.outputs.values();
      setPlay("Stop");
      for(const output of outputs) {
        if(output.name === "KROSS"){
        console.log(output);
        midiOutput = output;
        }}
        playNote();
        playNote2();
      });
      setPlay("Stop");
    } */
    } catch (e) {
      console.log(e)
    }
  }
  /**
  // unused
  const playNote = function () {
    console.log(playBool)
    if (playBool) {
      if (currentSequenceId >= 0) {
        midiOutput.send([NOTE_OFF, TWINKLE_TWINKLE.notes[currentSequenceId].pitch, 0x7f])
      }

      currentSequenceId++
      if (currentSequenceId >= TWINKLE_TWINKLE.notes.length) {
        currentSequenceId = 0
        playBool = true
        return
      }
      midiOutput.send([NOTE_ON, TWINKLE_TWINKLE.notes[currentSequenceId].pitch, 0x7f])
      // viz1.redraw(TWINKLE_TWINKLE.notes[currentSequenceId]);
      NOTE_DURATION = (TWINKLE_TWINKLE.notes[currentSequenceId].endTime - TWINKLE_TWINKLE.notes[currentSequenceId].startTime) * 1000
      setTimeout(playNote(), NOTE_DURATION)
    } else {
      playBool = true
    }
  }

  // unused
  const playNote2 = function () {
    try {
      midiOutput.send([NOTE_ON, TWINKLE_TWINKLE, 0])
    } catch (error) {
      console.log(error)
    }
  }
  */

  // Orginal

  // const [playNN, setPlayNN] = useState("Play");

  // var player = new mm.Player();
  // player.setTempo(120);

  /* function func_old(){
    if(play === "Stop"){
      console.log(player);
      setPlay("Play");
      player.stop();
      return;
    }else{
      player.start(TWINKLE_TWINKLE);
      setPlay("Stop");
    }
  } */

  // Initialize the model.

  // Create a player to play the sequence we'll get from the model.

  /**
  // old continue with RNN --> unused
  async function loadRNN () {
    const rnnSteps = 32
    const rnnTemperature = 1
    const musicRnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/musicRnn/basic_rnn')
    musicRnn.initialize()
    const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4)
    await musicRnn
      .continueSequence(qns, rnnSteps, rnnTemperature)
      .then((sample) => {
        let i = 8
        let j = 0
        sample.notes.forEach(element => {
          element.startTime = convertToStartTime(element, i, j)
          element.endTime = convertToEndTime(element, i, j)
          i = element.endTime
          j = element.quantizedEndStep
        })
        qns1 = mm.sequences.concatenate([qns, sample])
        console.log(qns1)
      })
    viewData(qns1)
  }
  */
  /*
    extract notes for number of steps
    brushed: part selected?
    fillin: part for fill-in?
    --> not brushed = take last part of size steps
    --> brushed = take brushed part
    --> brushed and fillin = delete these notes
  */
  function tranformNotesToRnnSteps (tnotes, steps, lastnotai, brushed, fillin) {
    try {
      if (tnotes.length > 1) {
        let lmax
        let lmin
        lmax = tnotes[0].quantizedEndStep
        lmin = tnotes[0].quantizedStartStep
        tnotes.forEach((d) => {
          lmax < d.quantizedEndStep ? lmax = d.quantizedEndStep : console.log()
          lmin > d.quantizedStartStep ? lmin = d.quantizedStartStep : console.log()
        })
        let result = []
        if (!brushed) {
          if (lmax - lmin > steps) {
          // var p = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 1 }
            tnotes.forEach((d) => {
              if (d.quantizedStartStep >= lmax - steps && d.quantizedEndStep <= lmax) {
              /* p.pitch = d.pitch
              p.quantizedStartStep=d.quantizedStartStep;
              p.quantizedEndStep=d.quantizedEndStep;
              */
                result.push(d)
              }
            })
            // console.log(result);
            return [result]
          } else {
            return [tnotes]
          }
        } else if (!fillin) {
          const tbrush = steps
          lmin = tbrush.min
          tbrush.max > lastnotai ? lmax = lastnotai : lmax = tbrush.max
          result = []
          // p = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 1 }
          tnotes.forEach((d) => {
            if (d.quantizedStartStep >= lmin && d.quantizedEndStep <= lmax) {
            /* p.pitch = d.pitch;
            p.quantizedStartStep=d.quantizedStartStep;
            p.quantizedEndStep=d.quantizedEndStep;
            */
              result.push(d)
            }
          })
          return [result]
        } else {
          const tbrush = steps
          lmin = tbrush.min
          tbrush.max > lastnotai ? lmax = lastnotai : lmax = tbrush.max
          result = []
          // p = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 1 }
          const deleted = {}
          for (let i = 0; i < tnotes.length; i++) {
            const d = tnotes[i]
            if (d.quantizedEndStep <= lmin) {
              result.push(d)
            } else if (d.quantizedStartStep >= lmin && d.quantizedEndStep <= lmax) {
              deleted[d.quantizedStartStep] = d.provenance
              deleteItem(0, d)
              i--
            }
          }
          return [result, deleted]
        }
      } else {
        return [tnotes]
      }
    } catch (e) {
      console.log(e)
    }
  }

  // delete note
  function deleteItem (i, d) {
    try {
      const index = tt.notes[i].indexOf(d)
      if (index > -1 && index < tt.notes[i].length) { tt.notes[i].splice(index, 1) }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * calulate End step of all note sequences
   * @param {*} AI --> true = all, false only not ai notes are taken into account
   * @returns max End step of all selected note sequences
   */
  function dataLength (data, AI) {
    try {
      let result = 0
      for (let i = 0; i < data.ai.length; i++) {
        if (!data.ai[i] || AI) {
          if (data.notes[i].length !== 0) {
            data.notes[i].forEach(obj => {
              if (obj.quantizedEndStep > result) {
                result = obj.quantizedEndStep
              }
            })
          }
        }
      }
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Calculate number of fill-ins=false
   * @param {array fill from data} fills
   * @returns number of no fill-ins
   */
  function NOnoFill (fills) {
    try {
      let counter = 0
      fills.forEach((d) => {
        if (!d) {
          counter++
        }
      })
      return counter
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Calculate chord for improv RNN
   * @param {} notes
   * @returns Chord
   */
  function getChord (notes) {
    try {
      function first (array) {
        if (array !== undefined && array.length > 0) {
          const common = Tonal.Chord.detect(array)
          return common.length ? common[0] : array[0]
        } else {
          return 'CM'
        }
      }
      function detectChord (notes) {
        notes = notes.map(n => Tonal.Note.pitchClass(Tonal.Note.fromMidi(n.pitch))).sort()
        return Tonal.PcSet.modes(notes)
          .map((mode, i) => {
            const tonic = Tonal.Note.name(notes[i])
            const names = Tonal.ChordDictionary.symbols(mode)
            return names.length ? tonic + names[0] : null
          })
          .filter((v, i, a) => a.indexOf(v) === i)
      }
      const notes1 = notes
      const chords = detectChord(notes1)
      const chord = first(chords)
      return [chord]
    } catch (e) {
      console.log(e)
    }
  }

  /**
   *
   * @param {model name} check
   * @param {specs of the model} obj
   * @returns Only Return spec for improvRNN
   */
  function getSpec (check, obj) {
    /** if (false) {
      // does not work for basic and melody somehow
      return undefined
    } else {
    */
    return check === 'improv_rnn' ? obj : undefined
    // }
  }

  function assignprovenance (data, provenance, array) {
    try {
      let newdata = []
      if (array) {
        data.forEach(note => {
          const temp = { pitch: note.pitch, quantizedStartStep: note.quantizedStartStep, quantizedEndStep: note.quantizedEndStep, provenance: provenance }
          newdata.push(temp)
        })
      } else {
        newdata = { pitch: data.pitch, quantizedStartStep: data.quantizedStartStep, quantizedEndStep: data.quantizedEndStep, provenance: provenance }
      }
      return newdata
    } catch (e) {
      console.log(e)
    }
  }

  // currentLevel --> human = true (improve provenance), false (lose provenance)
  function adjustprovenance (data, old) {
    try {
      console.log('prov adjust')
      console.log(data, old)
      data.forEach(note => {
        if (note.quantizedStartStep in old) {
          const h = old[note.quantizedStartStep]
          if (h === 4) { note.provenance = 3 } else if (h === 1) { note.provenance = 2 }
          else {note.provenance = 0}
        } else {
          note.provenance = 0
        }
      })
      return data
    } catch (e) {
      console.log(e)
    }
  }

  /**
  // unused; was test for python API
  async function fetchModel () {
    const nums = parseInt(document.getElementById('numberSamples').value)
    const minNotes = parseInt(document.getElementById('numberNotes').value)
    const checkpoint = parseInt(document.getElementById('model').value)
    /// /document.getElementById('updates').value="Waiting for RNN 0/"+nums+" results";
    const rnnSteps = rnnsteps
    const rnnTemperature = []
    const input = {
      tempos: [{ qpm: bpm }]
    }
    let max
    const parents = []
    const inputs = []
    let notAI = false
    const numberOfNotFills = NOnoFill(tt.fill)
    if (tt.notes.length > 0) {
      if (tt.notes.length === 1 || numberOfNotFills === 0) {
        input.notes = tt.notes[0]
        const l = tt.notes.length === 1
        await getBrush()
        input.notes = await tranformNotesToRnnSteps(input.notes, brush, tt.lastnotai, !!l, false)[0]
        parents.push(0)
        inputs.push(input)
        notAI = true
      } else {
        const latest = []
        let got = false
        for (var j = 0; j < mainmelo.parent.length; j++) {
          got = false
          for (let k = 0; k < mainmelo.parent.length; k++) {
            if (j === mainmelo.parent[k]) { got = true }
          }
          if (!got && !mainmelo.fill[j]) { latest.push(j) }
        }

        if (latest.length === 0) {
          latest.push(0)
        }
        for (var i = 0; i < latest.length; i++) {
          const ij = latest[i]
          input.notes = await tranformNotesToRnnSteps(tt.notes[ij], rnnSteps, 0, false, false)[0]
          parents.push(ij)
          inputs.push(input)
        }
      }
    } else {
      input.notes = popmelo[popmeloval].notes
      tt.notes.push(input.notes)
      tt.ai.push(false)
      tt.temp.push(-1)
      tt.parent.push(0)
      tt.lastnotai = 64
      if (popmeloval === 0) { tt.lastnotai = 0 }
      tt.modelUsed.push(0)
      tt.fill.push(true)
      parents.push(0)
      inputs.push(input)
    }

    for (var j = 0; j < inputs.length; j++) {
      max = calcMaxStep(inputs[j].notes)
      max !== 0 ? inputs[j].totalQuantizedSteps = max : inputs[j].totalQuantizedSteps = 4
      const qns = inputs[j]
      if (checkpoint > 3) {
        const t = d3.scaleLinear()
          .domain([0, nums - 1])
          .range([temprange.min, temprange.max])

        const thismodel = loadedModels[checkpoint - 4]
        const checkpointURL = thismodel.checkpointURL
        console.log(checkpointURL)
        var temperatureArray = []
        for (var i = 0; i < nums; i++) {
          temperatureArray[i] = t(i)
        }
        const possibleFlags = { numOut: nums, numSteps: rnnSteps, temperature: temperatureArray }
        qns.flags = [{}]
        for (const [key, value] of Object.entries(thismodel.fixflags[0])) {
          qns.flags[0][key] = value
        }
        for (const [key, value] of Object.entries(thismodel.needflags[0])) {
          if (possibleFlags[value] !== undefined) { qns.flags[0][key] = possibleFlags[value] }
        }
        try {
          await fetch(checkpointURL, {
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(qns)
          }).then(res => res.json()).then(
            dat => {
              dat.forEach((data, index) => {
                tt.notes.push(assignprovenance(data.notes, 0))
                tt.ai.push(true)
                tt.parent.push(parents[j])
                tt.fill.push(false)
                tt.temp.push(temperatureArray[index])
              })
            })
        } catch (e) {
          console.log(e)
        }
      }
    }
    viewData(tt)
    // document.getElementById("dropdown").value = 0;
    dropdownselection = 0
    /// /document.getElementById('updates').value="Waiting for action";
  }

  */

  // continue the melodies with the selected RNN, uses number of samples per model
  async function loadnewRNN () {
    try {
    // const nums = parseInt(document.getElementById('numberSamples').value)
    // const minNotes = parseInt(document.getElementById('numberNotes').value)
      let checkpoint
      if (selectedModelValue.length > 0) {
        checkpoint = selectedModelValue
      } else {
        console.log('No model chosen!')
        return 0
      }
      /// /document.getElementById('updates').value="Waiting for RNN 0/"+nums+" results";
      const progress = document.getElementById('progress')
      progress.style.display = 'block'
      const rnnSteps = rnnsteps
      let rnnTemperature = []
      const input = mm.sequences.createQuantizedNoteSequence()
      let max
      // let parent
      const parents = []
      const inputs = []
      let notAI = false
      const numberOfNotFills = NOnoFill(tt.fill)
      if (tt.notes.length > 0) {
        if (tt.notes.length === 1 || numberOfNotFills === 0) {
          input.notes = tt.notes[0]
          const l = tt.notes.length === 1
          await getBrush()
          input.notes = await tranformNotesToRnnSteps(input.notes, brush, tt.lastnotai, !!l, false)[0]
          parents.push(0)
          inputs.push(input)
          notAI = true
        } else {
          const latest = []
          let got = false
          for (let j = 0; j < mainmelo.parent.length; j++) {
            got = false
            for (let k = 0; k < mainmelo.parent.length; k++) {
              if (j === mainmelo.parent[k]) { got = true }
            }
            if (!got && !mainmelo.fill[j]) { latest.push(j) }
          }

          if (latest.length === 0) {
            latest.push(0)
          }
          for (let i = 0; i < latest.length; i++) {
            const ij = latest[i]
            input.notes = await tranformNotesToRnnSteps(tt.notes[ij], rnnSteps, 0, false, false)[0]
            parents.push(ij)
            inputs.push(input)
          }
        }
      } else {
        input.notes = popmelo[popmeloval].notes
        tt.notes.push(input.notes)
        tt.ai.push(false)
        tt.temp.push(-1)
        tt.parent.push(0)
        tt.lastnotai = 64
        if (popmeloval === 0) { tt.lastnotai = 0 }
        tt.fill.push(true)
        tt.modelUsed.push(-1)
        parents.push(0)
        inputs.push(input)
      }

      console.log(inputs)

      const loop = checkpoint.length
      const tempPopped = []
      let poppedCheckpoint
      for (let r = 0; r < loop; r++) {
        poppedCheckpoint = checkpoint[r]
        for (let j = 0; j < inputs.length; j++) {
          max = calcMaxStep(inputs[j].notes)
          max !== 0 ? inputs[j].totalQuantizedSteps = max : inputs[j].totalQuantizedSteps = 4
          const qns = inputs[j]
          if (!loadedModels[poppedCheckpoint].js) {
            const t = d3.scaleLinear()
              .domain([0, nums - 1])
              .range([temprange.min, temprange.max])

            const newqns = {
              tempos: [{ qpm: bpm }],
              notes: [],
              totalQuantizedSteps: 0,
              quantizationInfo: 4,
              flags: []
            }
            newqns.notes = qns.notes
            newqns.totalQuantizedSteps = qns.totalQuantizedSteps
            newqns.quantizationInfo = qns.quantizationInfo
            const thismodel = loadedModels[poppedCheckpoint]// -3]
            const checkpointURL = thismodel.checkpointURL
            const temperatureArray = []
            for (let i = 0; i < nums; i++) {
              temperatureArray[i] = t(i)
            }
            const possibleFlags = { numOut: nums, numSteps: rnnSteps, temperature: temperatureArray }
            newqns.flags = [{}]
            for (const [key, value] of Object.entries(thismodel.fixflags[0])) {
              newqns.flags[0][key] = value
            }
            for (const [key, value] of Object.entries(thismodel.needflags[0])) {
              if (possibleFlags[value] !== undefined) { newqns.flags[0][key] = possibleFlags[value] }
            }
            try {
            /* global fetch */
              await fetch(checkpointURL, {
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(newqns)
              }).then(res => res.json()).then(
                dat => {
                  dat.forEach((data, index) => {
                    if (data.notes.length >= minNotes) {
                      tt.notes.push(assignprovenance(data.notes, 0, true))
                      tt.ai.push(true)
                      tt.parent.push(parents[j])
                      tt.fill.push(false)
                      tt.temp.push(temperatureArray[index])
                      tt.modelUsed.push(poppedCheckpoint)
                    }
                  })
                })
            } catch (e) {
              console.log(e)
            }
          // false because we use scale for temperature
          } else if (tempbyslider) {
            rnnTemperature = [parseFloat(document.getElementById('temp1').value),
              parseFloat(document.getElementById('temp2').value)]
            for (let i = 0; i < nums; i++) {
            /// /document.getElementById('updates').value="Waiting for RNN "+((j*nums)+i)+"/"+(nums*inputs.length)+" results";
              await musicRnn
                .continueSequence(qns, rnnSteps, rnnTemperature[i % 2])
                .then((sample) => {
                  if (sample.notes.length >= minNotes) {
                    sample = calcOffset(sample, max, notAI, false)
                    const temp = sample.notes
                    tt.notes.push(temp)
                    tt.ai.push(true)
                    tt.temp.push(rnnTemperature[i % 3])
                    tt.parent.push(parents[j])
                    tt.fill.push(false)
                  }
                })
            }
          } else {
            const t = d3.scaleLinear()
              .domain([0, nums - 1])
              .range([temprange.min, temprange.max])

            const chord = getChord(qns.notes)

            if (musicRnn === undefined || currentCheckpoint !== poppedCheckpoint) {
              musicRnn = new mm.MusicRNN(loadedModels[poppedCheckpoint].checkpointURL, getSpec(loadedModels[poppedCheckpoint].name, spec))
              currentCheckpoint = poppedCheckpoint
              musicRnn.initialize()
            }
            for (let i = 0; i < nums; i++) {
            /// /document.getElementById('updates').value="Waiting for RNN "+((j*nums)+i)+"/"+(nums*inputs.length)+" results";

              await musicRnn
                .continueSequence(qns, rnnSteps, t(i), getSpec(loadedModels[poppedCheckpoint].name, chord))
                .then((sample) => {
                  if (sample.notes.length >= minNotes) {
                    sample = calcOffset(sample, max, notAI, false)
                    const temp = sample.notes
                    tt.notes.push(assignprovenance(temp, 0, true))
                    tt.ai.push(true)
                    tt.temp.push(t(i))
                    tt.parent.push(parents[j])
                    tt.fill.push(false)
                    tt.modelUsed.push(poppedCheckpoint)
                  }
                })

              if (scattertest) {
                console.log('scatter test')
                for (let k = 0; k < 9; k++) {
                  await musicRnn
                    .continueSequence(qns, rnnSteps, t(i))
                    .then((sample) => {
                      sample = calcOffset(sample, max, notAI, true)
                      const temp = sample.notes
                      tt.notes.push(temp)
                      tt.ai.push(true)
                      tt.temp.push(t(i))
                      tt.parent.push(parents[j])
                      tt.fill.push(false)
                    })
                }
              }
            }
          }
        }
        tempPopped.push(poppedCheckpoint)
      }
      // selectedModelValue = tempPopped
      viewData(tt)
      // document.getElementById("dropdown").value = 0;
      dropdownselection = 0
    /// /document.getElementById('updates').value="Waiting for action";
    } catch (e) {
      console.log(e)
    }
  }

  // fill-in instead of continue
  async function fillinRNN () {
    try {
      const progress = document.getElementById('progress')
      progress.style.display = 'block'
      const brush = await getBrush()
      console.log(brush)
      if (brush.active === 'true') { // &&brush.min>(brush.max-brush.min)){
      // const nums = parseInt(document.getElementById('numberSamples').value)
        let checkpoint
        if (selectedModelValue.length > 0) {
          checkpoint = selectedModelValue
        } else {
          console.log('No model chosen!')
          return 0
        }
        /// /document.getElementById('updates').value="Waiting for RNN 0/"+nums+" results";
        const rnnSteps = parseInt(brush.max - brush.min)

        const input = mm.sequences.createQuantizedNoteSequence()
        let max
        const parents = []
        const inputs = []
        let deleted = {}
        let notAI = false
        const lastnotai = tt.lastnotai
        if (tt.notes.length > 0) {
          input.notes = tt.notes[0]
          const temp = await tranformNotesToRnnSteps(input.notes, brush, lastnotai, true, true)
          input.notes = temp[0]
          deleted = temp[1]
          parents.push(0)
          inputs.push(input)
          notAI = true
        }

        const loop = checkpoint.length
        const tempPopped = []
        for (let r = 0; r < loop; r++) {
          const poppedCheckpoint = checkpoint[r]
          for (let j = 0; j < inputs.length; j++) {
            max = brush.min
            max !== 0 ? inputs[j].totalQuantizedSteps = max : max = 0
            const qns = inputs[j]
            const t = d3.scaleLinear()
              .domain([0, nums - 1])
              .range([temprange.min, temprange.max])

            if (!loadedModels[poppedCheckpoint].js) {
              const t = d3.scaleLinear()
                .domain([0, nums - 1])
                .range([temprange.min, temprange.max])

              const newqns = {
                tempos: [{ qpm: bpm }]
              }
              newqns.notes = qns.notes
              newqns.totalQuantizedSteps = qns.totalQuantizedSteps
              newqns.quantizationInfo = qns.quantizationInfo
              const thismodel = loadedModels[poppedCheckpoint]
              const checkpointURL = thismodel.checkpointURL
              const temperatureArray = []
              for (let i = 0; i < nums; i++) {
                temperatureArray[i] = t(i)
              }
              const possibleFlags = { numOut: nums, numSteps: rnnSteps, temperature: temperatureArray }
              newqns.flags = [{}]
              for (const [key, value] of Object.entries(thismodel.fixflags[0])) {
                newqns.flags[0][key] = value
              }
              for (const [key, value] of Object.entries(thismodel.needflags[0])) {
                if (possibleFlags[value] !== undefined) { newqns.flags[0][key] = possibleFlags[value] }
              }
              try {
                await fetch(checkpointURL, {
                  method: 'POST',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(newqns)
                }).then(res => res.json()).then(
                  dat => {
                    dat.forEach((data, index) => {
                      if (data.notes.length >= minNotes) {
                        tt.notes.push(adjustprovenance(data.notes, deleted))
                        tt.ai.push(true)
                        tt.parent.push(parents[j])
                        tt.fill.push(true)
                        tt.temp.push(temperatureArray[index])
                        tt.modelUsed.push(poppedCheckpoint)
                      }
                    })
                  })
              } catch (e) {
                console.log(e)
              }
            } else {
              if (musicRnn === undefined || currentCheckpoint !== poppedCheckpoint) {
                musicRnn = new mm.MusicRNN(loadedModels[poppedCheckpoint].checkpointURL, getSpec(loadedModels[poppedCheckpoint].name, spec))
                currentCheckpoint = poppedCheckpoint
                musicRnn.initialize()
              }
              for (let i = 0; i < nums; i++) {
              /// /document.getElementById('updates').value="Waiting for RNN "+((j*nums)+i)+"/"+(nums*inputs.length)+" results";
                await musicRnn
                  .continueSequence(qns, rnnSteps, t(i), getSpec(loadedModels[poppedCheckpoint].name, chord))
                  .then((sample) => {
                    sample = calcOffset(sample, max, notAI, true)
                    const temp = sample.notes
                    if (temp.length > minNotes) {
                      tt.notes.push(adjustprovenance(temp, deleted))
                      tt.ai.push(true)
                      tt.temp.push(t(i))
                      tt.parent.push(parents[j])
                      tt.lastnotai = lastnotai
                      tt.fill.push(true)
                      tt.modelUsed.push(poppedCheckpoint)
                    }
                  })
              }
            }
          }
          tempPopped.push(poppedCheckpoint)
        }
        // selectedModelValue = tempPopped
        viewData(tt)
        dropdownselection = 0
        // document.getElementById("dropdown").value = 0;
        // document.getElementById('updates').value="Waiting for action";
        const progress = document.getElementById('progress')
        progress.style.display = 'none'
      } else {
        console.log('no brush or brush longer than previous sequence')
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * if note outside the range adjust it so it is in the range
   * @param {*} note
   * @returns transformed note in range
   */
  function adjustNoteToRange (note) {
    return note
  }

  /**
   * Shift notes so they align with given notes
   * @param {*} data
   * @param {*} toffset
   * @param {*} notAI
   * @param {Flag to use either fixed offset or end of composition} fillin
   * @returns data with shifted notes
   */
  function calcOffset (data, toffset, notAI, fillin) {
    try {
      let offset = toffset
      if (notAI && toffset < tt.lastnotai && !fillin) { offset = tt.lastnotai }

      data.notes.forEach(obj => {
        adjustNoteToRange(obj)
        obj.quantizedStartStep = obj.quantizedStartStep + offset
        obj.quantizedEndStep = obj.quantizedEndStep + offset
      })
      return data
    } catch (e) {
      console.log(e)
    }
  }

  /**
   *
   * @param {single note sequence} data
   * @returns end step
   */
  function calcMaxStep (data) {
    try {
      let result = 0
      if (data.length !== 0) {
        data.forEach(obj => {
          if (obj.quantizedEndStep > result) {
            result = obj.quantizedEndStep
          }
        })
      }
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /**
  // unused, try to use VAE
  async function createVae () {
    const music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2')
    music_vae.initialize()
    console.log(music_vae)
    const rnnTemperature = 1
    let qns1
    await music_vae
      .sample(1, rnnTemperature)
      .then((sample) => {
        let i = 0
        let j = 0
        sample[0].notes.forEach(element => {
          element.startTime = convertToStartTime(element, i, j)
          element.endTime = convertToEndTime(element, i, j)
          i = element.endTime
          j = element.quantizedEndStep
        })
        qns1 = sample[0]
      })
    console.log(qns1)
  }
  */

  function playbackGuitar (note, tabsOfNotes, radius, x, y, datamin) {
    try {
      let seq = mm.sequences.createQuantizedNoteSequence(4, bpm)
      seq.notes = [note]
      seq = mm.sequences.quantizeNoteSequence(seq, 4)
      note = seq.notes[0]
      const guitar = tabsOfNotes.filter((guitarnote) =>
        guitarnote.pitch === note.pitch &&
      guitarnote.quantizedStartStep === note.quantizedStartStep + datamin &&
      guitarnote.quantizedEndStep === note.quantizedEndStep + datamin
      )
      console.log(note, datamin, guitar)
      if (guitar !== undefined && guitar[0] !== undefined) {
        const d = guitar[0]
        if (d.guitar.tab === 0 && openStringSeperate) {
          d3.select('#note1')
            .attr('opacity', 0)
          d3.select('#guitarString' + d.guitar.string)
            .attr('stroke', 'blue')
            .attr('stroke-width', 4)
          const strings = [1, 2, 3, 4, 5, 6]
          strings.forEach((string) => {
            if (string !== d.guitar.string) {
              d3.select('#guitarString' + string)
                .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
                .attr('stroke-width', 1)
            }
          })
        } else {
          d3.select('#note1')
            .attr('opacity', 1)
            .attr('stroke', 'black')
            .attr('fill', 'blue')
            .attr('r', radius)
            .attr('cx', x(d.guitar.tab - 0.25))
            .attr('cy', y(d.guitar.string))

          const strings = [1, 2, 3, 4, 5, 6]
          strings.forEach((string) => {
            d3.select('#guitarString' + string)
              .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
              .attr('stroke-width', 1)
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  function playFromListener () {
    const currentcall = new Date()
    if (currentcall - lastcall > 200) {
      playRNN()
      lastcall = currentcall
    }
  }

  async function playPreview (index) {
    try {
      if (player !== undefined) {
        let temp = []
        let datamin = dataLength(tt, true)
        let datamax = 0

        player.stop()
        d3.select('#playback_line_roll').interrupt()

        const datalength = dataLength(mainmelo, true)

        // var datalength = dataLength(tt);
        await mainmelo.notes[index].forEach((note) => {
          if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
          if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
        })
        dataminGuitar = datamin
        await mainmelo.notes[index].forEach((note) => {
          const tempnote = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 0 }
          tempnote.pitch = note.pitch
          tempnote.quantizedStartStep = note.quantizedStartStep - datamin
          tempnote.quantizedEndStep = note.quantizedEndStep - datamin
          temp = temp.concat(tempnote)
        })

        const margin = { top: 30, right: 50, bottom: 30, left: 30 }

        xPlay = d3.scaleLinear()
          .domain([0, datalength])
          .range([margin.left, window.innerWidth - margin.left - margin.right])

        const seq = mm.sequences.createQuantizedNoteSequence(4)
        seq.notes = temp
        player.loadSamples(seq).then(() => {
          player.start(seq, bpm)
          if (dropdownselection - 1 === index || dropdownselection === 0 || index === 0) {
            d3.select('#playback_line_roll')
              .transition().duration((60000) / (bpm * 4))
              .attr('x', xPlay(datamin))
              .attr('duration', datamin)
              .on('end', () => {
                d3.select('#playback_line_roll')
                  .transition().ease(d3.easeLinear).duration((60000) / (bpm * 4) * (datamax - datamin))
                  .attr('x', xPlay(datamax))
                  .attr('duration', datamax)
                  .on('end', (d, f, g) => { d3.select('#playback_line_roll').attr('duration', 0).attr('x', xPlay(0)) })
                // .on('start', (d, f, g) => { d3.select('#' + g[0].id).attr('opacity', 1) })
              })
          } else {
            d3.select('#playback_line_roll')
              .attr('x', xPlay(0))
              .attr('duration', 0)
          }
        })
      } else {
        player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander')// mm.Player();
        if (views[4]) {
          player.callbackObject = {
            run: (note) => {
              playbackGuitar(note, fretData[0], fretData[1], fretData[2], fretData[3], dataminGuitar)
            },
            stop: () => {
              d3.select('#note1')
                .transition(200).duration(100)
                .attr('r', 0)
              for (let string = 1; string < 7; string++) {
                d3.select('#guitarString' + string)
                  .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
                  .attr('stroke-width', 1)
              }
            }
          }
        }
        playPreview(index)
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Play the selected part / all with playback line
   * @returns
   */
  async function playRNN () {
    try {
      if (player !== undefined) {
        let temp = []
        let datamin = dataLength(tt, true)
        let datamax = 0
        if (player.isPlaying()) {
          player.stop()
          const currentX = d3.select('#playback_line_roll').attr('x')
          d3.select('#playback_line_roll').interrupt()
          d3.select('#playback_line_roll')
            .transition()
            .duration(100)
            .attr('x', xPlay(Math.round(xPlay.invert(currentX))))
          // d3.select('#playback_line_roll').attr('opacity', 0)
          // setPlayNN("Play");
          return
        } else {
          const float = parseFloat(d3.select('#playback_line_roll').attr('duration'))
          datamin = parseInt(Math.round(float))
        }

        let datalength = dataLength(currentMeloView, true)
        if (datalength < 64) {
          datalength = 64
        }

        // var datalength = dataLength(tt);
        await getBrush()
        await currentMeloView.notes.forEach(element => {
          if (brush.active === 'true') {
            element.forEach((note) => {
              if (note.quantizedStartStep >= brush.min && note.quantizedEndStep <= brush.max) {
                const tempnote = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 0 }
                tempnote.pitch = note.pitch
                tempnote.quantizedStartStep = note.quantizedStartStep - brush.min
                tempnote.quantizedEndStep = note.quantizedEndStep - brush.min
                temp = temp.concat(tempnote)
                // if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
                // if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
                datamin = brush.min
                datamax = brush.max
              }
            })
          } else {
          /*
          temp = temp.concat(element)
          element.forEach((note) => {
            // if (note.quantizedStartStep < datamin) { datamin = note.quantizedStartStep }
            if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
          })
          datamin = 0
          */
            element.forEach((note) => {
              if (note.quantizedStartStep >= datamin) {
                const tempnote = { pitch: 0, quantizedStartStep: 0, quantizedEndStep: 0 }
                tempnote.pitch = note.pitch
                tempnote.quantizedStartStep = note.quantizedStartStep - datamin
                tempnote.quantizedEndStep = note.quantizedEndStep - datamin
                temp = temp.concat(tempnote)
                if (note.quantizedEndStep > datamax) { datamax = note.quantizedEndStep }
              }
            })
          }
        })

        dataminGuitar = datamin

        const margin = { top: 30, right: 50, bottom: 30, left: 30 }

        xPlay = d3.scaleLinear()
          .domain([0, datalength])
          .range([margin.left, window.innerWidth - margin.left - margin.right])

        const seq = mm.sequences.createQuantizedNoteSequence(4)
        seq.notes = temp
        player.loadSamples(seq).then(() => {
          player.start(seq, bpm)
          d3.select('#playback_line_roll')
            .transition().duration((60000) / (bpm * 4))
            .attr('x', xPlay(datamin))
            .attr('duration', datamin)
            .on('end', () => {
              d3.select('#playback_line_roll')
                .transition().ease(d3.easeLinear).duration((60000) / (bpm * 4) * (datamax - datamin))
                .attr('x', xPlay(datamax))
                .attr('duration', datamax)
                .on('end', (d, f, g) => { d3.select('#playback_line_roll').attr('duration', 0).attr('x', xPlay(0)) })
              // .on('start', (d, f, g) => { d3.select('#' + g[0].id).attr('opacity', 1) })
            })
        })
      } else {
        player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander')// mm.Player();
        if (views[4]) {
          player.callbackObject = {
            run: (note) => {
              playbackGuitar(note, fretData[0], fretData[1], fretData[2], fretData[3], dataminGuitar)
            },
            stop: () => {
              d3.select('#note1')
                .transition(200).duration(100)
                .attr('r', 0)
              for (let string = 1; string < 7; string++) {
                d3.select('#guitarString' + string)
                  .attr('stroke', darkmode === 'LightMode' ? 'black' : 'white')
                  .attr('stroke-width', 1)
              }
            }
          }
        }
        playRNN()
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
  // unused from VAE or old func
  function convertToStartTime (element, i, j) {
    return ((element.quantizedStartStep - j) / 4) + i
  }

  // unused from VAE or old func
  function convertToEndTime (element, i, j) {
    return ((element.quantizedEndStep - element.quantizedStartStep) / 4) + i
  }
  */

  // clear old data and set up fresh cleaned objects
  async function newData () {
    try {
    // tt.notes = TWINKLE_TWINKLE.notes;//deepClone(temp);
    // main.redefine("data", tt.notes);
      document.getElementById('brushed').value = [0, 0, false, 0, 0]
      tt = {
        notes: [],
        ai: [],
        color: [],
        temp: [],
        parent: [],
        lastnotai: 0,
        fill: [],
        modelUsed: []
      }
      if(mainmeloStates.length > 1){
        await mainmeloStates.push(newObject(tt))
        await meloViewStates.push(newObject(tt))
      }else {
        mainmeloStates = [];
        meloViewStates = [];
      }
      setMainmelo({
        notes: [],
        ai: [],
        color: [],
        temp: [],
        parent: [],
        lastnotai: 0,
        fill: [],
        modelUsed: []
      })
      setmeloView({
        notes: [],
        ai: [],
        color: [],
        temp: [],
        parent: [],
        lastnotai: 0,
        fill: [],
        modelUsed: []
      })
    } catch (e) {
      console.log(e)
    }
    // mainmeloStates = [];
    // meloViewStates= [];
    setMainmelo({
      notes: [],
      ai: [],
      color: [],
      temp: [],
      parent: [],
      lastnotai: 0,
      fill: [],
      modelUsed: []
    })
    mvlib.Utils.storeObjectInLocalStorage('state', tt)
    setmeloView({
      notes: [],
      ai: [],
      color: [],
      temp: [],
      parent: [],
      lastnotai: 0,
      fill: [],
      modelUsed: []
    })

  }

  // calculate colors of sequences and then set new state to update changes visually
  async function viewData (res) {
    try {
    // document.getElementById('updates').value="Waiting for action";
      const progress = document.getElementById('progress')
      progress.style.display = 'none'
      if (res !== null && res.notes.length !== 0) {
        // main.redefine("data", res.notes);
        res.color = await colorsBySeq(res.ai, res, colorscale)
        await mainmeloStates.push(newObject(res))
        await meloViewStates.push(newObject(res))

        await calcviewDat(dropdownselection, res)// document.getElementById("dropdown").value
        onceHooked = true
        await setMainmelo(res)
        mvlib.Utils.storeObjectInLocalStorage('state', res)
      } else if (res !== null && res.notes.length === 0) {
        await mainmeloStates.push(newObject(res))
        await meloViewStates.push(newObject(res))

        await calcviewDat(dropdownselection, res)// document.getElementById("dropdown").value
        onceHooked = true
        await setMainmelo(res)
        mvlib.Utils.storeObjectInLocalStorage('state', res)
      }
      console.log(mainmeloStates, meloViewStates)
    } catch (e) {
      console.log(e)
    }
  }

  // go over all sequences and calc color if not already
  // returns array of colors
  function colorsBySeq (resai, res, colorTemp) {
    try {
      const temp = []
      let lastcolor = -1
      let col
      // let colArray
      let c
      if (colorTemp === 2) {
        col = (val, c) => d3.schemeTableau10[val]
        // colArray = d3.schemeTableau10
        colorScaleForLegend = undefined
      } else if (colorTemp === 0) {
        if (res.temp.length === 1) {
          col = (val, c) => d3.schemeTableau10[8]
        } else {
          const mintemp = res.temp.filter(val => val > 0)
          c = d3.scaleLinear()
            .domain([Math.min(...mintemp), Math.max(...res.temp)])
          col = (val, c) => val > 0 ? d3.interpolateRdYlBu(1 - c(val)) : d3.schemeTableau10[8]
          colorScaleForLegend = d3.scaleSequential([Math.min(...mintemp), Math.max(...res.temp)], d3.interpolateRdYlBu)
        }
      } else if (colorTemp === 1) {
        col = (val, c) => val > 0 ? d3.schemeTableau10[res.modelUsed[val]] : d3.schemeTableau10[8]
        colorScaleForLegend = d3.scaleOrdinal(loadedModels.map(obj => obj.name), d3.schemeTableau10)
      }

      for (let i = 0; i < resai.length; i++) {
      // if (res.color[i] === undefined ) {
        let b = 'white'
        if (colorTemp === 2) {
          b = (lastcolor + 1) % 9
        } else if (colorTemp === 0) {
          b = res.temp[i]
        } else if (colorTemp === 1) {
          b = i
        }
        temp.push(col(b, c))
        lastcolor = b
        if (colorTemp === 0) { lastcolor = b }
      /*
      } else {
        temp.push(res.color[i])
        lastcolor = colArray.indexOf(res.color[i])
      }
      */
      }
      return temp
    } catch (e) {
      console.log(e)
    }
  }

  // unused
  // record
  const countin = mm.sequences.createQuantizedNoteSequence(4)
  countin.notes = [
    { pitch: 79, quantizedStartStep: 0, quantizedEndStep: 1, id: 0 },
    { pitch: 72, quantizedStartStep: 4, quantizedEndStep: 5, id: 1 },
    { pitch: 72, quantizedStartStep: 8, quantizedEndStep: 9, id: 2 },
    { pitch: 72, quantizedStartStep: 12, quantizedEndStep: 13, id: 3 }
  ]

  // Record from MIDI or keyboard
  async function startRecord (e, countIn) {
    try {
      if (rec !== undefined) {
        const progress = document.getElementById('progress')
        if (!rec.isRecording()) {
        // document.getElementById('updates').value="Recording";
          progress.style.display = 'block'
          const tempo = bpm
          rec.setTempo(tempo)
          //rec.enablePlayCountIn(countIn)
          //rec.enablePlayClick(true)
          // await rec.initialize()
          // await player.start(countin, tempo)
          const index = midiInputSelected
          if (index !== 0 && midiinputs[midiInputSelected - 1] !== undefined) {
            rec.start([midiinputs[midiInputSelected - 1]])
          } else {
            rec.start()
          }
          startTimeStamp = e.timeStamp
        } else {
        // document.getElementById('updates').value="Recording stopped";
          progress.style.display = 'none'
          rec.stop()
          rec.getNoteSequence() === null ? showTrimResult(recseq) : showTrimResult(rec.getNoteSequence())
        }
      } else {
        /*rec = new mm.Recorder()
        rec.callbackObject = {
          run: (d) => {
            console.log(d)
          },
          stop: () => {
            console.log('end of record')
          }
        }*/
        await initRecorder(e)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function transformNotesToStart (result) {
    try {
      let min = result.notes[0].quantizedStartStep
      result.notes.forEach((note) => {
        if (note.quantizedStartStep < min) {
          min = note.quantizedStartStep
        }
      })
      result.notes.forEach((note) => {
        note.quantizedStartStep -= min
        note.quantizedEndStep -= min
      })
      return result
    } catch (e) {
      console.log(e)
    }
  }

  // convert recorded sequence to align with current notes
  async function showTrimResult (result) {
    try {
      numnotesrecorded = 0
      document.getElementById('numnotesrecorded').innerHTML = 0
      result = mm.sequences.quantizeNoteSequence(result, 4)
      if (result.notes.length > 0) {
        let max = 0
        const input = mm.sequences.createQuantizedNoteSequence()
        if (tt.notes.length > 0) {
          for (let i = 0; i < tt.notes.length; i++) {
            input.notes = tt.notes[i]
            if (max < calcMaxStep(input.notes)) { max = calcMaxStep(input.notes) }
          }
        }
        max !== 0 ? input.totalQuantizedSteps = max : max = 0
        result = transformNotesToStart(result) // mm.sequences.trim(result, 17, result.notes[result.notes.length - 1].quantizedEndStep)
        result = calcOffset(result, max, false)
        let onlyfill = true
        tt.fill.forEach((f) => {
          if (!f) { onlyfill = false }
        })
        if (tt.notes.length === 0) {
          tt.notes.push(assignprovenance(result.notes, 4, true))
          tt.ai.push(false)
          tt.temp.push(-1)
          tt.parent.push(tt.ai.length - 1)
          tt.lastnotai = dataLength(tt, false)
          tt.fill.push(true)
          tt.modelUsed.push(-1)
        } else {
          tt.notes[0] = tt.notes[0].concat(assignprovenance(result.notes, 4, true))
          tt.lastnotai = dataLength(tt, false)
          if (!onlyfill) {
            for (let f = 0; f < tt.fill.length; f++) {
              tt.fill[f] = true
            }
          }
        }
        viewData(tt)
        dropdownselection = 0
      } else {
        console.log('No recorded notes')
      }
    } catch (e) {
      console.log(e)
    }
  }

  // get brush properties
  async function getBrush () {
    try {
      let brushed = document.getElementById('brushed').value
      if (brushed !== '') {
        brushed = brushed.split(',')
        brush.min = parseInt(brushed[0])
        brush.max = parseInt(brushed[1])
        brush.active = brushed[2]
        if (brush.active === 'false') {
          brush.min = 0
          brush.max = tt.lastnotai
          brush.active = 'false'
        }
      } else {
        brush.min = 0
        brush.max = tt.lastnotai
        brush.active = 'false'
      }
      return brush
    } catch (e) {
      console.log(e)
    }
  }

  // reload view and therefore sizes
  async function resize () {
    // createVae();
    tt.color = await colorsBySeq(tt.ai, tt, colorscale)
    mvlib.Utils.storeObjectInLocalStorage('state', tt)
    setMainmelo(tt)
  }

  // calculate the current selected sequences in Piano Roll
  function calcviewDat (i, res) {
    try {
      i = parseInt(i)
      if (i === 0) {
        indexesOfView = []
        setmeloView(res)
      } else {
        indexesOfView = []
        const k = i - 1
        if (res.ai[k]) {
          for (let l = 0; l < res.ai.length; l++) {
            if (!res.ai[l]) {
              indexesOfView.push(l)
            }
          }
        }
        // var k =i+startOfOptions-1;

        indexesOfView.push(k)
        temp = { notes: [], ai: [], color: [], temp: [], parent: [], lastnotai: 0, fill: [], modelUsed: [], index: [] }
        indexesOfView.forEach(element => {
          if (res.notes[element] !== undefined) {
            temp.notes.push(res.notes[element])
            temp.ai.push(res.ai[element])
            temp.color.push(res.color[element])
            temp.temp.push(res.temp[element])
            temp.parent.push(res.parent[element])
            temp.fill.push(res.fill[element])
            temp.modelUsed.push(res.modelUsed[element])
            temp.index.push(element)
          }
        })
        temp.lastnotai = dataLength(temp, false)
        setmeloView(temp)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function getIndex (i) {
    /* i = parseInt(i);
    var startOfOptions=0;
      for(var l=0;l<mainmelo.ai.length;l++){
        if(!mainmelo.ai[l]){
          startOfOptions = l+1;
        }
      }
      var k =i+startOfOptions-1;
      return k
    */
    return i - 1
  }

  // ??
  function transformToNotAi (notes, last) {
    try {
      let index = 0
      let indexfound = false
      let count = 0
      while (!indexfound) {
        count = 0
        notes.forEach((note) => {
          if (note.quantizedStartStep >= last + (index * rnnsteps) && note.quantizedEndStep <= last + (index + 1) * rnnsteps) {
            count++
          }
        })
        if (count > notes.length / 2 || index === 500) {
          indexfound = true
        } else {
          index++
        }
      }

      const result = []
      notes.forEach((note) => {
        note.quantizedStartStep = note.quantizedStartStep - ((index) * rnnsteps)
        note.quantizedEndStep = note.quantizedEndStep - ((index) * rnnsteps)
        result.push(note)
      })

      return result
    } catch (e) {
      console.log(e)
    }
  }

  // add selected sequence to the composition
  async function setSelectToMelo () {
    try {
      const val = await getIndex(dropdownselection)// document.getElementById("dropdown").value);
      const temp1 = { notes: [], ai: [], color: [], temp: [], parent: [], lastnotai: 0, fill: [], modelUsed: [] }
      if (meloView.notes.length > 0 && val !== undefined && val !== -1) {
        let note = []
        let tnote = []
        const childs = []
        let wasFill = false
        for (let i = 0; i < meloView.notes.length; i++) {
          if (meloView.ai[i] && !meloView.fill[i]) {
            tnote = transformToNotAi(meloView.notes[i], meloView.lastnotai)
            note = note.concat(tnote)
            for (let j = 0; j < mainmelo.parent.length; j++) {
              if (mainmelo.parent[j] === val && j !== i) {
                childs.push(j)
              }
            }
            wasFill = false
          } else {
            tnote = meloView.notes[i]
            note = note.concat(tnote)
            if (i !== 0) {
              wasFill = true
            } else {
              wasFill = false
            }
          }
        }
        temp1.notes.push(note)
        temp1.ai.push(false)
        temp1.color.push(mainmelo.color[0])
        temp1.temp.push(-1)
        temp1.parent.push(0)
        temp1.lastnotai = dataLength(temp1, false)
        temp1.fill.push(true)
        temp1.modelUsed.push(-1)

        console.log(mainmelo)
        console.log(temp1)

        if (!mainmelo.fill[val]) {
          for (let j = 1; j < mainmelo.parent.length; j++) {
            if (mainmelo.fill[j] && j !== val) {
              console.log(mainmelo.fill[j], j, val)
              temp1.notes.push(mainmelo.notes[j])
              temp1.ai.push(mainmelo.ai[j])
              temp1.color.push(mainmelo.color[j])
              temp1.temp.push(mainmelo.temp[j])
              temp1.parent.push(0)
              temp1.fill.push(mainmelo.fill[j])
              temp1.modelUsed.push(mainmelo.modelUsed[j])
            }
          }
        }
        console.log(temp1)
        console.log(wasFill)
        if (wasFill) {
          for (let j = 1; j < mainmelo.parent.length; j++) {
            if (!mainmelo.fill[j] && j !== val) {
              temp1.notes.push(mainmelo.notes[j])
              temp1.ai.push(mainmelo.ai[j])
              temp1.color.push(mainmelo.color[j])
              temp1.temp.push(mainmelo.temp[j])
              temp1.parent.push(mainmelo.parent[j])
              temp1.fill.push(mainmelo.fill[j])
              temp1.modelUsed.push(mainmelo.modelUsed[j])
            }
          }
        }
        console.log(temp1)
        childs.forEach((i) => {
          temp1.notes.push(mainmelo.notes[i])
          temp1.ai.push(mainmelo.ai[i])
          temp1.color.push(mainmelo.color[i])
          temp1.temp.push(mainmelo.temp[i])
          temp1.parent.push(0)
          temp1.fill.push(mainmelo.fill[i])
          temp1.modelUsed.push(mainmelo.modelUsed[i])
        })
        console.log(temp1)
        await mainmeloStates.push(newObject(mainmelo))
        await meloViewStates.push(newObject(meloView))
        viewData(temp1)
        dropdownselection = 0
      /*
      setmeloView(temp1)
      setMainmelo(temp1)
      */
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
  // used for showing different values like bpm, weightings, temperature min/max ...
  function updateTextInput (value, val) {
    if (val < 4) {
      let num = value.target.valueAsNumber
      if (val === 1) {
        num > temprange.max ? num = temprange.max : num = num
        temprange.min = num
        document.getElementById('temp' + val).value = num
      } else if (val === 2) {
        num < temprange.min ? num = temprange.min : num = num
        temprange.max = num
        document.getElementById('temp' + val).value = num
      } else {
        bpm = num
        document.getElementById('temp' + val).value = num
      }
      document.getElementById('textInput' + val).value = num
    } else {
      document.getElementById('weights' + val).value = value.target.valueAsNumber
    }
  }
  */

  /*
  temp = deepClone(tt.notes);
  console.log(tt);
  console.log(temp);
  */

  // unused
  function getRec (i) {
    try {
      if (i === 0) {
        if (document.getElementById('dropdown') === null) {
          return -1
        } else {
          return dropdownselection// document.getElementById("dropdown").value
        }
      } else if (i < 4) {
        if (document.getElementById('rec' + i) === null) {
          return -1
        } else if (typeof parseInt(document.getElementById('rec' + i).value) === 'number') {
          const r = document.getElementById('rec' + i).value
          if (r > -1 && r < options.length) {
            return r
          } else {
            return -1
          }
        } else {
          return -1
        }
      } else {
        if (document.getElementById('weights') === null) {
          return 0.5
        } else {
          return document.getElementById('weights').valueAsNumber
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
  // change number of samples to a value between 0/1000
  function changeVal (e, id) {
    let val = e.target.value
    if (val < 0) { val = 0 }
    if (val > 1000) { val = 1000 }
    document.getElementById(id).value = val
  }
  */

  // text in dropdown menu
  function textofOpt (value) {
    try {
      let string = getIndex(value)// mainmelo.color[getIndex(value)];
      if (mainmelo.temp[getIndex(value)] > 0) { string = string + ' temp: ' + mainmelo.temp[getIndex(value)].toFixed(3) }
      if (mainmelo.fill[getIndex(value)] === true && getIndex(value) > 0) { string = string + ' fill' }

      return string
    } catch (e) {
      console.log(e)
    }
  }

  function colorofOpt (value) {
    return mainmelo.color[getIndex(value)]
  }

  // where clicked in scatterplot
  function getHidden () {
    if (document.getElementById('clicked') === null) {
      return '-1,-1'
    } else {
      return document.getElementById('clicked').value
    }
  }

  /**
  // maximize and minimize views
  function setMinMax (id, fix) {
    try {
      const x = document.getElementById(id)
      const b = document.getElementById('b' + id)
      const string = b.innerText.substring(1)
      const view = b.innerText.substring(0, 1)
      if (x !== null) {
        if (fix === undefined) {
          if (x.style.display === 'none') {
            x.style.display = 'block'
            b.innerHTML = '-' + string
          } else if (x.style.display === 'block') {
            x.style.display = 'none'
            b.innerHTML = '+' + string
          } else {
            if (view === '+') {
              x.style.display = 'block'
              b.innerHTML = '-' + string
            } else if (view === '-') {
              x.style.display = 'none'
              b.innerHTML = '+' + string
            }
          }
        } else {
          if (fix === 'block') {
            x.style.display = 'block'
            b.innerHTML = '-' + string
          } else if (fix === 'none') {
            x.style.display = 'none'
            b.innerHTML = '+' + string
          }
        }
      }
    } catch (e) {
      console.log('Something went wrong')
    }
  }
  */

  /**
  // different modes instantly maximize and minimize things
  function setViewModes (id) {
    let views = []
    let notviews = []
    if (id === 'compose') {
      views = ['prd', 'tsd', 'ird']
      notviews = ['ccd']//, "dcd","celld"]
    } else if (id === 'explore') {
      views = ['tsd', 'ccd']//, "dcd","celld"];
      notviews = ['prd', 'ird']
    } else if (id === 'all') {
      views = ['prd', 'tsd', 'ird', 'ccd']//, "dcd","celld"];
    } else if (id === 'none') {
      notviews = ['prd', 'tsd', 'ird', 'ccd']//, "dcd","celld"];
    }
    views.forEach((v) => {
      setMinMax(v, 'block')
    })
    notviews.forEach((v) => {
      setMinMax(v, 'none')
    })
  }
  */

  /**
  // note range depending on instrument
  function setInstrument () {
    const val = document.getElementById('instrument').value
    octaveRange.adjust = false
    if (val === '0') {
      octaveRange.lowest = 48
      octaveRange.highest = 72
    } else if (val === '1') {
      octaveRange.lowest = 55
      octaveRange.highest = 79
    } else if (val === '2') {
      octaveRange.lowest = 52
      octaveRange.highest = 88
    } else if (val === '3') {
      octaveRange.lowest = 55
      octaveRange.highest = 105
    } else if (val === '4') {
      octaveRange.lowest = 60
      octaveRange.highest = 96
    } else if (val === '5') {
      octaveRange.lowest = 54
      octaveRange.highest = 79
    } else if (val === '6') {
      octaveRange.lowest = 36
      octaveRange.highest = 72
    } else if (val === '7') {
      octaveRange.lowest = 0
      octaveRange.highest = 0
      octaveRange.adjust = true
    }

    resize()
  }
  */

  // export composition as midi file
  function exportMidi () {
    try {
      if (mainmelo.notes.length > 0) {
        const midi = new Midi()
        let newSec
        let sec
        for (let i = 0; i < 1; i++) { // mainmelo.notes.length;i++){
          newSec = mm.sequences.createQuantizedNoteSequence(4, bpm)
          newSec.notes = mainmelo.notes[i]
          sec = mm.sequences.unquantizeSequence(newSec, bpm)
          const track = midi.addTrack()
          sec.notes.forEach((note) => {
            track.addNote({
              midi: note.pitch,
              time: note.startTime,
              duration: note.endTime - note.startTime
            })
          })
        }
        const array = midi.toArray()
        const buffer = array.buffer
        /* global Blob */
        const blob = new Blob([buffer], { type: 'audio/mid' })
        saveAs(blob, 'composedMidi.mid')
      }
      handleClose()
    } catch (e) {
      console.log(e)
    }
  }

  function uploadMidi (e) {
    try {
    /* global FileReader */
      const fileReader = new FileReader()
      fileReader.readAsText(e.target.files[0], 'UTF-8')
      console.log(fileReader)
      fileReader.onload = e => {
      }
      handleClose()
    } catch (e) {
      console.log(e)
    }
  }

  function undo () {
    try {
      const currentcall = new Date()
      if (currentcall - lastcall > 200) {
        if (meloViewStates.length > 1) {
          meloViewStates.pop()
          const state = meloViewStates[meloViewStates.length - 1]
          setmeloView(state)
        }
        if (mainmeloStates.length > 1) {
          mainmeloStates.pop()
          const state = mainmeloStates[mainmeloStates.length - 1]
          setMainmelo(state)
          mvlib.Utils.storeObjectInLocalStorage('state', state)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  // if automatic continuation from node link diagram
  if (loadRNNAuto) {
    loadnewRNN()
    loadRNNAuto = false
  }

  // adjust tooltip text
  function tooltip (id, button) {
    try {
      if (button === 'modelselect') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>{'Select to MIDI input for recording.   Keyboard will always work.   If no input is shown --> resize'}</span>
      } else if (button === 'pianocontrol') {
      // document.getElementById(id).classList.toggle("show")
      /** document.getElementById(id).innerHTML = */ const tooltipText = 'Controls:   ctrl + wheel = zoom  ' +
          'drag + ctrl = adjust length  ' +
          'alt + click note = delete    brush + e = delete all brushed  ' +
          'drag + c = copy   v = paste'
        return <span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>
      } else if (button === 'upload') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Upload JSON file to specify loading model</span>
      } else if (button === 'fillin') {
        // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Fill-in brushed part with set number of samples per model</span>
      } else if (button === 'continue') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Continue brushed part/composition/generated options with number of notes per option and model</span>
      } else if (button === 'numsample') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Number of samples that are generated   recommended: compose 3-8, explore 50-300</span>
      } else if (button === 'play') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Play brushed part or everything in PianoRoll</span>
      } else if (button === 'seed') {
        // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Select preset melody seed if not recorded</span>
      } else if (button === 'numnotes') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Required amount of notes for a generated sample to show up</span>
      } else if (button === 'export') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Export Composition (blue part) as Midifile</span>
      } else if (button === 'resize') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Resize page to browser size</span>
      } else if (button === 'record') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Record with Midi or Keyboard   a-j = c5 to b5   w,e,t,z/y,u = # notes (if there is no countin just play)</span>
      } else if (button === 'temp') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>Adjust Temperature range.   Samples are generated with increasing temperature with equidistant values across range</span>
      } else if (button === 'infoIcicle') {
      // document.getElementById(id).classList.toggle("show")
        /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>'Controls: \n ctrl + wheel = zoom \n select icicle = add   select sankey = add and generate new continuation'</span>
      } else if (button === 'infoCluster') {
      // document.getElementById(id).classList.toggle("show")
      /** document.getElementById(id).innerHTML = */
        const tooltipText = 'Controls: \n wheel = size selection   ctrl + wheel = zoom \n ' +
      'alt + click = reset zoom/position  ' +
      'Starglyphs: ' +
      'top: number notes  ' +
      'left: mean length  ' +
      'bottom: variance of jumps  ' +
      'right: similarity to parent  '
        return <span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>
      } else if (button === 'midi') {
      // document.getElementById(id).classList.toggle("showlong")
      /** document.getElementById(id).innerHTML = */return <span style={{ whiteSpace: 'pre-line' }}>{'Select to MIDI input for recording.   Keyboard will always work.   If no input is shown --> resize'}</span>
      }
    } catch (e) {
      // console.log(e)
    }
  }

  try {
    // Midi list
    if (rec !== undefined) {
      const tempmid = rec.getMIDIInputs()
      let no = true
      tempmid.forEach((op) => {
        midiinputs.forEach((i) => {
          if (i.id === op.id) { no = false }
        })
        if (no) { midiinputs.push(op) }
        no = true
      })
    }
  } catch (e) {
    console.log(e)
  }

  // upload json file for model checkpoint
  function uploadFile (e) {
    try {
      const fileReader = new FileReader()
      fileReader.readAsText(e.target.files[0], 'UTF-8')
      fileReader.onload = e => {
        const data = JSON.parse(e.target.result)
        loadedModels.push(data)
        allModels.push({ key: loadedModels.length - 1, value: loadedModels.length - 1, label: data.name })
        console.log(loadedModels)
        console.log(allModels)
      }
      handleClose()
    // resize();
    } catch (e) {
      console.log(e)
    }
  }

  // import all models from src/checkpoints dir automatically
  function importModels () {
    try {
      function importAll (r) {
        return r.keys().map(r)
      }
      loadedModels = importAll(require.context('./checkpoints', false, /\.json$/))
      // all models as checkpoints and then in state.
      allModels = []/* [{key:0, value:0, label:"basic_rnn"},
      {key:1, value:1, label:"melody_rnn"},
      {key:2, value:2, label:"improv_rnn"}] */
      const off = 0// 3
      loadedModels.map((option, i) => (
        allModels.push({ key: off + i, value: off + i, label: option.name })
      ))
      // var loadCheckpoint = require('./checkpoints/test.json');
      // var stringCheckpoint = JSON.parse(JSON.stringify(loadCheckpoint));
      // loadedModels.push(stringCheckpoint);
      selectedModelValue = [loadedModels.length - 1]
      loadModelsOnce = true
    } catch (e) {
      console.log(e)
    }
  }

  function toggleViewListener (index) {
    /*
    const currentcall = new Date()
    if (currentcall - lastcall > 600 && false) {
      views[0] = !views[0]
      views[0] = !views[0]
      if (index === 1) {
        toggleView(5)
      } else if (index === 2) {
        toggleView(0)
      } else if (index === 3) {
        toggleView(1)
      } else if (index === 4) {
        toggleView(2)
      } else if (index === 5) {
        toggleView(3)
      } else if (index === 6) {
        toggleView(4)
      }
    }
    lastcall = currentcall
    */
  }

  function toggleView (index) {
    try {
      if (index === 5) {
        if (!provVis) {
          provVis = true
          preGuitarView = views
          views = [false, false, false, false, false]
          partialGrid = 0
        } else {
          provVis = false
          views = preGuitarView
          partialGrid = views.filter(val => val).length
        }
      } else {
        const bool = !views[index]
        provVis = false
        if (index === 4) {
          if (bool) {
            preGuitarView = views
            views = [false, false, false, false, true]
            partialGrid = 0
          } else {
            if (views === [false, false, false, false, true]) {
              views = [false, false, false, false, false]
            } else {
              views = preGuitarView
            }
            partialGrid = views.filter(val => val).length
          }
        } else {
          bool ? partialGrid++ : partialGrid--
          views[index] = bool
          views[4] = false
        }
      }
      const temp = []
      views.forEach((bool, index) => {
        try {
          const x = document.getElementById(viewID[index])
          if (x !== null) {
            if (bool) {
              x.style.display = 'block'
              temp.push(index)
            } else {
              x.style.display = 'none'
            }
          }
        } catch (e) {
          console.log('Something went wrong')
        }
      })
      resize()
    // setViewState(views)
    } catch (e) {
      console.log(e)
    }
  }

  if (!loadModelsOnce) {
    importModels()
  }

  async function initRecorder(e){
    let recorderTimeout
    let stopTimeout
    rec = new mm.Recorder()
    rec.callbackObject = {
      run: (d) => {
        numnotesrecorded = d.notes.length
        document.getElementById('numnotesrecorded').innerHTML = numnotesrecorded
        console.log(d)
      },
      stop: () => {
        numnotesrecorded = 0
      }
    }
    rec.setTempo(bpm)
    await rec.enablePlayCountIn(false)
    await rec.initialize()
    await clearTimeout(recorderTimeout)
    console.log('recorder init')
    recorderTimeout = setTimeout(function () {
      rec.start()
      recorderTimeout = undefined
      console.log('recorder started')
      clearTimeout(stopTimeout)
      stopTimeout = setTimeout(function () {
        stopTimeout = undefined
        rec.stop()
        rec.enablePlayCountIn(true)
        rec.getNoteSequence()
        console.log('recorder stop')
        startRecord(e, true)
      }, 50)
    }, 500)
  }

  try {
    if (firsttime) {
      //initRecorder()
      firsttime = false
      for (let listen = 0; listen < 5; listen++) {
        document.removeEventListener('keyup', event => {
          if (event.key === '1') {
            toggleViewListener(1)
          } else if (event.key === '2') {
            toggleViewListener(2)
          } else if (event.key === '3') {
            toggleViewListener(3)
          } else if (event.key === '4') {
            toggleViewListener(4)
          } else if (event.key === '5') {
            toggleViewListener(5)
          } else if (event.key === '6') {
            toggleViewListener(6)
          }
        })
      }
      document.addEventListener('keyup', event => {
        if (event.key === '1') {
          toggleViewListener(1)
        } else if (event.key === '2') {
          toggleViewListener(2)
        } else if (event.key === '3') {
          toggleViewListener(3)
        } else if (event.key === '4') {
          toggleViewListener(4)
        } else if (event.key === '5') {
          toggleViewListener(5)
        } else if (event.key === '6') {
          toggleViewListener(6)
        }
      })
    }

    if (onceHooked) {
      onceHooked = false
      for (let listen = 0; listen < 10; listen++) {
        document.removeEventListener('keyup', event => {
          if (event.code === 'Space') {
            event.preventDefault()
            playFromListener()
          } else if (event.key === 'z' && event.ctrlKey) {
            undo()
          }
        })
      }
      document.addEventListener('keyup', event => {
        if (event.code === 'Space') {
          event.preventDefault()
          playFromListener()
        } else if (event.key === 'z' && event.ctrlKey) {
          undo()
        }
      })
      currentMeloView = meloView
    }
  } catch (e) {
    console.log(e)
  }

  /*
  const handleTempValue = (event, newValue, activeThumb) => {
    const minDistance = 0
    if (!Array.isArray(newValue)) {
      return;
    }
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setTempValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setTempValue([clamped - minDistance, clamped]);
      }
    } else {
      setTempValue(newValue);
    }
  };
  */

  /*  for original select
      <option key={0} value={0}>basic_rnn</option>
              <option key={1} value={1}>melody_rnn</option>
              <option key={2} value={2}>improv_rnn</option>
              <option key={3} value={3}>all previous</option>
              {loadedModels.map((option,i)=>(
              <option key={4+i} value={4+i}>{option.name}</option>
            ))}
  */

  // style Select of models
  const colourStyles = {
    menu: () => {
      return { backgroundColor: '#333' }
    },
    option: (styles, { value, isFocused }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: d3.schemeTableau10[value % 10],
        color: isFocused ? 'white' : 'black'
      }
    },
    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      color: 'white'
    }),
    multiValue: (styles, { data }) => {
      const color = d3.schemeTableau10[data.value % 10]
      return {
        ...styles,
        backgroundColor: color// color.alpha(0.2).css(),

      }
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: 'white'
    })
  }

  const list = (anchor) => (
    <Box
      sx={{ width: 'auto', backgroundColor: 'toolbar.main' }}
      role='presentation'
      justifyContent='center'
      alignItems='center'
    // onClick={toggleDrawer(false)}
    // onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <Tooltip title={tooltip('infoPiano', 'seed')} placement='right-end'>
            <FormControl variant='standard'>
              <InputLabel sx={{ color: darkmode === 'LightMode' ? 'black' : 'white' }} id='seedlabel'>Seed</InputLabel>
              <muiSelect.default
                label='Midi Input' labelId='seedlabel' color='secondary' variant='standard' autoWidth
                sx={{
                  color: darkmode === 'LightMode' ? 'black' : 'white',
                  minWidth: 172,
                  '& .MuiSvgIcon-root': {
                    color: darkmode === 'LightMode' ? 'black' : 'white'
                  }
                }}
                /**
                 * InputLabelProps={{
                  style: {
                    color: 'white'
                  }
                }}
                name='Seed'
                inputProps={{
                  'aria-label': 'seed',
                  id: 'popmelo',
                  style: { color: 'white' }
                }}
                */
                defaultValue={popmeloval}
                onChange={val => { popmeloval = val.target.value }}
                onMouseEnter={(e) => { tooltip('infoPiano', 'seed') }}
                onMouseLeave={(e) => { tooltip('infoPiano', 'seed') }}
              >
                <MenuItem key={0} value={0}>Empty</MenuItem>
                <MenuItem key={1} value={1}>Twinkle Twinkle</MenuItem>
                <MenuItem key={2} value={2}>Crazy Train</MenuItem>
                <MenuItem key={3} value={3}>Smoke on the Water</MenuItem>
                <MenuItem key={4} value={4}>Shape of You</MenuItem>
              </muiSelect.default>
            </FormControl>
          </Tooltip>
        </ListItem>
        <ListItem style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '10.7ch' }
            }}
            noValidate
            autoComplete='off'
          >
            <Tooltip title='Number of Samples generated' placement='right-end'>
              <TextField
                variant='standard'
                color='secondary'
                id='numberSamples'
                label='NumberSamples'
                type='number'
                defaultValue={nums}
                onChange={(value) => { nums = parseInt(value.target.value) }}
                InputLabelProps={{
                  style: {
                    color: darkmode === 'LightMode' ? 'black' : 'white'
                  }
                }}
                InputProps={{
                  style: {
                    color: darkmode === 'LightMode' ? 'black' : 'white'
                  }
                }}
              />
            </Tooltip>
          </Box>
        </ListItem>
        <ListItem style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '12ch' }
            }}
            noValidate
            autoComplete='off'
          >
            <Tooltip title={tooltip('infoPiano', 'numnotes')} placement='right-end'>
              <TextField
                variant='standard'
                color='secondary'
                id='numberNotes'
                label='minNumberNotes'
                type='number'
                defaultValue={minNotes}
                onChange={(value) => { minNotes = parseInt(value.target.value) }}
                onMouseEnter={(e) => { tooltip('infoPiano', 'numnotes') }}
                onMouseLeave={(e) => { tooltip('infoPiano', 'numnotes') }}
                InputLabelProps={{
                  style: {
                    color: darkmode === 'LightMode' ? 'black' : 'white'
                  }
                }}
                InputProps={{
                  style: {
                    color: darkmode === 'LightMode' ? 'black' : 'white'
                  }
                }}
              />
            </Tooltip>
          </Box>
        </ListItem>
        <ListItem style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <Box display='flex' justifyContent='center'>
            <Tooltip title='Temperature to control randomness' placement='right-end'>
              <Box sx={{ width: 150 }}>
                <Typography color={darkmode === 'LightMode' ? 'black' : 'white'} id='input-slider' gutterBottom> Temperature </Typography>
                <Slider
                  color='secondary'
                  getAriaLabel={() => 'Temperature'}
                  onChange={(e, d) => { temprange.min = Math.min(d[0], d[1]); temprange.max = Math.max(d[0], d[1]) }}// handleTempValue}
                  valueLabelDisplay='auto'
                  disableSwap
                  step={0.1}
                  min={0.2}
                  max={1.8}
                  marks
                  defaultValue={[temprange.min, temprange.max]}
                />
              </Box>
            </Tooltip>
          </Box>
        </ListItem>
        <ListItem style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>

          <ButtonGroup variant='outlined' color='secondary'>
            <Tooltip title={tooltip('infoPiano', 'fillin')} placement='left-end'>
              <Button variant='outlined' color='secondary' onClick={() => { setDrawerState(false); fillinRNN() }} onMouseEnter={(e) => { tooltip('infoPiano', 'fillin') }} onMouseLeave={(e) => { tooltip('infoPiano', 'fillin') }}>Fill-in</Button>
            </Tooltip>
            <Tooltip title={tooltip('infoPiano', 'continue')} placement='right-end'>
              <Button variant='outlined' color='secondary' onClick={() => { setDrawerState(false); loadnewRNN() }} onMouseEnter={(e) => { tooltip('infoPiano', 'continue') }} onMouseLeave={(e) => { tooltip('infoPiano', 'continue') }}>Continue</Button>
            </Tooltip>
          </ButtonGroup>

        </ListItem>
      </List>
    </Box>
  )

  try {
    return (
      <ThemeProvider theme={theme}>
        <div width={window.innerWidth} height={window.innerHeight} style={{ height: window.innerHeight + 'px', width: window.innerWidth + 'px', overflowY: 'hidden', overflow: 'hidden' }} className='App'>
          {/* <header>
        Hover over buttons and info icons to get explanations of the functions
      </header>
      */}
          <script src='https://ssvg.io/ssvg-auto.js' />
          {/* <button className="button" id="colorMode" onClick={func}>LightMode</button>
      */}
          {/* toolbar */}
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static' sx={{ backgroundColor: 'toolbar.main' }}>
              <Toolbar variant='dense' sx={{ backgroundColor: 'toolbar.main', height: window.innerHeight * 0.055 }}>
                <IconButton onClick={handleClick} edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                  <MenuIcon
                    id='demo-positioned-button'
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    color='secondary'
                  />
                </IconButton>
                <Menu
                  id='demo-positioned-menu'
                  aria-labelledby='demo-positioned-button'
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  sx={{ '& .MuiPaper-root': { backgroundColor: 'toolbar.main' } }}
                >
                  <input type='file' id='inputModelFile' hidden className='button' onChange={uploadFile} onMouseEnter={(e) => { tooltip('infoPiano', 'upload') }} onMouseLeave={(e) => { tooltip('infoPiano', 'upload') }} />
                  <label htmlFor='inputModelFile'>
                    <Tooltip title='Import new models via json file' placement='right-end'>
                      <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main' }}>Import Modelfile</MenuItem>
                    </Tooltip>
                  </label>
                  <Divider sx={{ backgroundColor: 'text.main' }} />
                  {/*
                  <input type='file' id='inputMidiFile' hidden className='button' onChange={uploadMidi} onMouseEnter={(e) => { tooltip('infoPiano', 'upload') }} onMouseLeave={(e) => { tooltip('infoPiano', 'upload') }} />
                  <label htmlFor='inputMidiFile'>
                    <Tooltip title='not working' placement='right-end'>
                      <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main' }}>Import Midi (not working)</MenuItem>
                    </Tooltip>
                  </label>
                  */}
                  <Tooltip title='Export melody as Midi file' placement='right-end'>
                    <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main' }} onClick={exportMidi} onMouseEnter={(e) => { tooltip('infoPiano', 'export') }} onMouseLeave={(e) => { tooltip('infoPiano', 'export') }}>Export Midi</MenuItem>
                  </Tooltip>
                  <Divider sx={{ backgroundColor: 'text.main' }} />
                  <Tooltip title='Automatic updates after changes. Can slow down' placement='right-end'>
                    <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main' }}>
                      <FormControlLabel onMouseEnter={(e) => { tooltip('infoPiano', 1) }} onMouseLeave={(e) => { tooltip('infoPiano', 1) }} control={<Switch checked={autoUpdate} color='secondary' onClick={() => { autoUpdate = !autoUpdate; handleClose() }} />} label='Auto Update' labelPlacement='end' />
                    </MenuItem>
                  </Tooltip>
                  <Divider sx={{ backgroundColor: 'text.main' }} />
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main' }}>
                    <Box display='flex' justifyContent='center'>
                      <Box sx={{ width: 180 }} justifyContent='center'>
                        <Typography id='input-slider' gutterBottom> BPM </Typography>
                        <Slider
                          color='secondary'
                          getAriaLabel={() => 'Bpm'}
                          onChange={(e, d) => { bpm = d }}
                          onChangeCommitted={(e, d) => { bpm = d }}
                          valueLabelDisplay='auto'
                          step={1}
                          min={60}
                          max={180}
                          // value={bpm}
                          defaultValue={bpm}
                        />
                      </Box>
                    </Box>
                  </MenuItem>
                  <Divider sx={{ backgroundColor: 'text.main' }} />
                  <MenuItem sx={{ color: 'text.main', backgroundColor: 'toolbar.main' }}>
                    <FormControl variant='standard'>
                      <InputLabel sx={{ color: 'text.main' }} id='midiinputlabel'>Midi Input</InputLabel>
                      <Tooltip title={tooltip('infoPiano', 'midi')} placement='left'>
                        <muiSelect.default
                          label='Midi Input' labelId='midiinputlabel'
                          defaultValue={midiInputSelected} color='secondary' variant='standard'
                          autoWidth
                          sx={{
                            color: 'text.main',
                            minWidth: 172,
                            '& .MuiSvgIcon-root': {
                              color: 'text.main'
                            }
                          }}
                          id='midiinput'
                          onChange={value => { midiInputSelected = value }}
                          onMouseEnter={(e) => { tooltip('infoPiano', 'midi') }}
                          onMouseLeave={(e) => { tooltip('infoPiano', 'midi') }}
                        >
                          <MenuItem key={0} value={0}>All Inputs</MenuItem>
                          {midiinputs.map((option, i) => (
                            <MenuItem key={i} value={i}>{option.name}</MenuItem>
                          ))}
                        </muiSelect.default>
                      </Tooltip>
                    </FormControl>
                  </MenuItem>
                </Menu>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Tooltip title={tooltip('infoPiano', 'modelselect')} placement='right'>
                    <div
                      style={{ width: Math.min(400, window.innerWidth) + 'px' }}
                      onMouseEnter={() => { tooltip('infoPiano', 'modelselect') }}
                      onMouseLeave={() => { tooltip('infoPiano', 'modelselect') }}
                    >
                      <Select
                        menuPlacement='auto'
                        menuPosition='fixed'
                      // value={allModels.filter(obj => selectedModelValue.includes(obj.value))}
                        className='button hover basic-multi-select' classNamePrefix='select' id='model'
                        isMulti
                        defaultValue={allModels[allModels.length - 1]}
                        onChange={e => { selectedModelValue = Array.isArray(e) ? e.map(x => x.value) : [] }}
                        options={allModels}
                        styles={colourStyles}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <Tooltip title={tooltip('infoPiano', 'record')} placement='bottom'>
                    <IconButton color='inherit' onClick={(e) => startRecord(e, true)} onKeyDown={(e) => onButtonPress(e)} onKeyUp={(e) => onButtonRelease(e)} onMouseEnter={(e) => { tooltip('infoPiano', 'record') }} onMouseLeave={(e) => { tooltip('infoPiano', 'record') }}>
                      <MicIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                  <Typography color='primary' id='numnotesrecorded' gutterBottom>
                    {numnotesrecorded}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Button variant='outlined' color='secondary' onClick={toggleDrawer(true)}>Generate</Button>
                </Box>
                {/**
          <Box sx={{ flexGrow: 1 }}>
          <FormControl variant="standard">
            <InputLabel sx={{color:"white"}} id="seedlabel">Seed</InputLabel>
          <muiSelect.default
          label="Midi Input" labelId="seedlabel" defaultValue={0} color="secondary" variant="standard" autoWidth
          sx={{color: "white",minWidth: 172,
          "& .MuiSvgIcon-root": {
            color: "white",
          } }}
          InputLabelProps={{
            style: {
              color: "white"
          }
          }}
          name="Seed"
          inputProps={{
              'aria-label': 'seed' ,
              id: 'popmelo',
              style:{color:"white"}
          }}
          onChange={val => {console.log(val); popmeloval = val.target.value}}
          onMouseEnter={(e)=>{tooltip("infoPiano","seed")}}
          onMouseLeave={(e)=>{tooltip("infoPiano","seed")}}
        >
          <MenuItem key={0} value={0}>Empty</MenuItem>
          <MenuItem key={1} value={1}>Twinkle Twinkle</MenuItem>
          <MenuItem key={2} value={2}>Crazy Train</MenuItem>
          <MenuItem key={3} value={3}>Smoke on the Water</MenuItem>
          <MenuItem key={4} value={4}>Shape of You</MenuItem>
          </muiSelect.default>
          </FormControl>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '10.7ch' },
            }}
            noValidate
            autoComplete="off"
          >
          <TextField
            variant="standard"
            color="secondary"
            id="numberSamples"
            label="NumberSamples"
            type="number"
            defaultValue="3"
            InputLabelProps={{
              style: {
                color: "white"
            }
            }}
            InputProps={{
              style: {
                color: "white"
            }}}
          />
           </Box>
          </Box>
          {/*
          <input className="button" type="text" id="numberSamples" defaultValue="3" onChange={(e)=>changeVal(e,"numberSamples")} onMouseEnter={(e)=>{tooltip("infoPiano","numsample")}} onMouseLeave={(e)=>{tooltip("infoPiano","numsample")}}></input>
          <button className="button" id="play" onClick={playRNN} onMouseEnter={(e)=>{tooltip("infoPiano","play")}} onMouseLeave={(e)=>{tooltip("infoPiano","play")}}>Play</button>
          */}{/*

        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '12ch' },
            }}
            noValidate
            autoComplete="off"
          >
          <TextField
              variant="standard"
              color="secondary"
              id="numberNotes"
              label="minNumberNotes"
              type="number"
              defaultValue="1"
              onMouseEnter={(e)=>{tooltip("infoPiano","numnotes")}}
              onMouseLeave={(e)=>{tooltip("infoPiano","numnotes")}}
              InputLabelProps={{
                style: {
                  color: "white"
              }
              }}
              InputProps={{
                style: {
                  color: "white"
              }}}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box display="flex" justifyContent="center">
            <Box sx={{width:150}}>
            <Typography id="input-slider" gutterBottom> Temperature </Typography>
            <Slider
              color='secondary'
              getAriaLabel={() => 'Temperature'}
              //value={tempvalue}
              onChange={(e,d)=>{temprange.min = Math.min(d[0],d[1]);temprange.max = Math.max(d[0],d[1])}}//handleTempValue}
              valueLabelDisplay='auto'
              disableSwap
              step={0.1}
              min={0.2}
              max={1.8}
              marks
              defaultValue={[0.8,1.2]}
            ></Slider>
            </Box>
            </Box>
          </Box>
          {/**
          <div>
              <select className="button" id="popmelo" onChange={(value) => {popmeloval = parseInt(document.getElementById("popmelo").value);}} onMouseEnter={(e)=>{tooltip("infoPiano","seed")}} onMouseLeave={(e)=>{tooltip("infoPiano","seed")}}>
                <option key={0} value={0}>Empty</option>
                <option key={1} value={1}>Twinkle Twinkle</option>
                <option key={2} value={2}>Crazy Train</option>
                <option key={3} value={3}>Smoke on the Water</option>
                <option key={4} value={4}>Shape of You</option>
              </select>

              Min Number of Notes:
              <input className="button" type="text" id="numberNotes" defaultValue="1" onChange={(e)=>changeVal(e,"numberNotes")} onMouseEnter={(e)=>{tooltip("infoPiano","numnotes")}} onMouseLeave={(e)=>{tooltip("infoPiano","numnotes")}}></input>
            </div>
          */}

                {/* <button className="button" onClick={newData}>Clear</button>
          */}

                {/* <button className="button" onClick={(e)=>startRecord(e)} onKeyDown={(e) => onButtonPress(e)} onKeyUp={(e) => onButtonRelease(e)} tabIndex="0" onMouseEnter={(e)=>{tooltip("infoPiano","record")}} onMouseLeave={(e)=>{tooltip("infoPiano","record")}}>Record</button>
          */}{/*
          <Box sx={{ flexGrow: 1 }}>
            <ButtonGroup  variant="contained" color="secondary">
              <Button  variant="contained" color="secondary" onClick={fillinRNN} onMouseEnter={(e)=>{tooltip("infoPiano","fillin")}} onMouseLeave={(e)=>{tooltip("infoPiano","fillin")}}>Fill-in</Button>
              <Button  variant="contained" color="secondary" onClick={loadnewRNN} onMouseEnter={(e)=>{tooltip("infoPiano","continue")}} onMouseLeave={(e)=>{tooltip("infoPiano","continue")}}>Continue</Button>
              </ButtonGroup>
          </Box>
          */}
                {/**
              <Box sx={{ flexGrow: 1 }}>
                <Box display='flex' justifyContent='center'>
                  <Box sx={{ width: 130 }}>
                    <Typography id='input-slider' gutterBottom> BPM </Typography>
                    <Slider
                      color='secondary'
                      getAriaLabel={() => 'Bpm'}
                      onChange={(e, d) => { bpm = d }}
                      valueLabelDisplay='auto'
                      step={1}
                      min={60}
                      max={180}
                      defaultValue={120}
                    />
                  </Box>
                </Box>
              </Box>
               */}
                <Box sx={{ flexGrow: 3 }} />
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <FormControl variant='standard'>
                    <InputLabel sx={{ color: darkmode === 'LightMode' ? 'black' : 'white' }} id='sampleslabel'>Samples</InputLabel>
                    <Tooltip title='Select samples to show in piano roll' placement='left-end'>
                      <muiSelect.default
                        label='Samples' labelId='sampleslabel' defaultValue={0} color='secondary'
                        variant='standard'
                        autoWidth
                        sx={{
                          color: darkmode === 'LightMode' ? 'black' : 'white',
                          minWidth: 110,
                          '& .MuiSvgIcon-root': {
                            color: darkmode === 'LightMode' ? 'black' : 'white'
                          }
                        }}
                        id='dropdown'
                        value={dropdownselection}
                        onChange={(value) => { dropdownselection = value.target.value; viewData(tt) }}
                      >
                        <MenuItem onFocus={() => { if (player !== undefined) { player.stop(); d3.select('#playback_line_roll').interrupt() } }} key={0} value={0}>All Options</MenuItem>
                        {options.map((option) => (
                          <MenuItem onFocus={() => { playPreview(option.value - 1) }} key={option.value} value={option.value}><span style={{ color: colorofOpt(option.value) }}>⬤</span>{textofOpt(option.value)}</MenuItem>
                        ))}
                      </muiSelect.default>
                    </Tooltip>
                  </FormControl>
                  <Tooltip title='Add selection to composition' placement='bottom'>
                    <IconButton color='inherit' onClick={setSelectToMelo}>
                      <AddCircleIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <FormControl variant='standard'>
                    <InputLabel sx={{ color: darkmode === 'LightMode' ? 'black' : 'white' }} id='colorlabel'>Colorscale</InputLabel>
                    <Tooltip title='Different colorscales' placement='left-end'>
                      <muiSelect.default
                        label='Colors' labelId='colorlabel' defaultValue={2} color='secondary'
                        variant='standard'
                        autoWidth
                        sx={{
                          color: darkmode === 'LightMode' ? 'black' : 'white',
                          minWidth: 110,
                          '& .MuiSvgIcon-root': {
                            color: darkmode === 'LightMode' ? 'black' : 'white'
                          }
                        }}
                        id='dropdown'
                        value={colorscale}
                        onChange={(value) => { colorscale = value.target.value; viewData(tt) }}
                      >
                        <MenuItem key={0} value={0}>Temperature</MenuItem>
                        <MenuItem key={1} value={1}>Model</MenuItem>
                        <MenuItem key={2} value={2}>Different</MenuItem>
                      </muiSelect.default>
                    </Tooltip>
                  </FormControl>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Tooltip title={tooltip('infoPiano', 'play')} placement='bottom'>
                    <IconButton color='inherit' onClick={() => playFromListener()} onMouseEnter={(e) => { tooltip('infoPiano', 'play') }} onMouseLeave={(e) => { tooltip('infoPiano', 'play') }}>
                      <PlayArrowIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ flexGrow: 1, display: 'flex', height: 40, width: 40 }}>
                  <CircularProgress sx={{ display: 'none' }} id='progress' color='secondary' disableShrink variant='indeterminate' />
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Tooltip title='Clear data' placement='bottom'>
                    <IconButton color='inherit' onClick={newData}>
                      <ClearAllIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                  {/* <button className="button" onClick={undo}>undo</button> */}
                  <Tooltip title='Undo' placement='bottom'>
                    <IconButton color='inherit' onClick={undo}>
                      <UndoIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                  <Typography color='primary' id='numnotesrecorded' gutterBottom>
                    {Math.max(0, mainmeloStates.length - 1)}
                  </Typography>
                  <Tooltip title='Resize' placement='bottom'>
                    <IconButton color='inherit' onClick={resize} onMouseEnter={(e) => { tooltip('infoPiano', 'resize') }} onMouseLeave={(e) => { tooltip('infoPiano', 'resize') }}>
                      <FullscreenIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Light/Darkmode' placement='bottom'>
                    <IconButton color='inherit' id='colorMode' onClick={func}>
                      {darkmode === 'LightMode'
                        ? <DarkModeIcon color='secondary' />
                        : <LightModeIcon color='secondary' />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='All information you need' placement='bottom'>
                    <IconButton color='inherit' onClick={handleOpenModal}>
                      <HelpIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Toolbar>
            </AppBar>
          </Box>

          <Modal
            keepMounted
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={{
              position: 'absolute',
              top: '20%',
              left: '20%',
              transform: 'translate(0, 0)',
              width: '60%',
              height: '60%',
              bgcolor: darkmode === 'LightMode' ? 'background.paper' : '#333333',
              color: darkmode === 'LightMode' ? 'black' : 'white',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              align: 'center',
              overflowY: 'scroll'
            }}
            >
              <Typography id='modal-modal-title' variant='h6' align='center'>
                Human-AI Collaborative Composition using Visualization
              </Typography>
              <Grid container direction='column' item spacing={2} align='left'>
                <Grid
                    item
                    xs='auto'
                    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                  >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Links:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    <a href="https://visvar.github.io/" target="_blank"> Our group website</a>
                    {'\n'}
                    <a href="https://github.com/visvar/vis-ai-comp" target="_blank">Github for this project</a>
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Shortcuts:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Play: Spacebar (piano roll) or rightclick \n' +
                    'Hover selection to play preview \n Zoom: crtl + wheel \n' +
                    'Undo: crtl + z \n'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Record:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Select a specific Midi Input or use all at the same time. \n' +
                    'A simple input via pc-keyboard is possible using buttons from a to l corresponding' +
                    'to C4 to D5, while # notes are placed like on a real keyboard (w, e, t ...). ' +
                    'With the mic button start the recording session.\n' +
                    'While recording the mic button still needs to be selected so dont click away. ' +
                    'To end the recording press the mic button again.'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Generate melodies:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Select a model on the top left. Then go to generate and follow from top to bottom. \n' +
                    'First select an example melody (only when composition is empty). If composition is not' +
                    'empty, the seed is selected by brushing or automatically the last 2 bars from the composition' +
                    'or children. \n' +
                    'The number of Samples determines the number of options generated by the AI.' +
                    'Only melodies with the minimum number of notes are accepted and displayed.\n' +
                    'With the temperature, one can steer the AI\'s output. A lower temperature is a more' +
                    'conservative approach, while higher temperature leads to more randomness.' +
                    'All samples are evenly distributed along the temperature range, therefore not 2 melodies use' +
                    'the same temperature in one process.\n' +
                    'Last choose the type of AI request.\n' +
                    'Continuation: AI continues the seed melody and function is used to compose new parts.' +
                    'Fill-in: AI replaces the brushed part'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Piano Roll:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Zoom in with ctrl+mousewheel.\n' +
                    'Drag notes to adjust them, or use brush to select and adjust multiple at the same time.' +
                    'Pressing ctrl while drag changes the duration of the note.\n' +
                    'Play the brushed part or whole composition using the play button in the toolbar.\n' +
                    'Auto Update off allows for faster adjustments of notes, as changes are not cascaded to other' +
                    'views until it is turned on again.\n' +
                    'Single samples can be selected with the select besides the BPM slider and added to the composition' +
                    'using the plus on the right.\n' +
                    'Notes can be copied by pressing c while draging and be pasted via v.' +
                    'To delete notes press alt and click on a note.' +
                    'Or brush multiple notes and delete them with x.'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Provenance:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Enables Provenance, where notes are colored based on their jorney through out the composing process.' +
                    'Hover over a label to see all belonging notes.\n' +
                    'Therefore a note belongs to one of the 5 classes:\n' +
                    '(1) Notes that are only touched by the user\n' +
                    '(2) Notes that where originally the users idea but got adjusted by the Ai\n' +
                    '(3) Notes that are adjusted multiple times by both parties in alternating order\n' +
                    '(4) Notes that were generated by the AI but afterwards adjusted by the user\n' +
                    '(5) Notes that are only generated by the user'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Icicle:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Icicle View shows the hierarchy of melody samples, where the children are placed beside the parent and their' +
                    'combined height equals the height of the parent.\n' +
                    'Hover over a piano roll line to highlight the specific pitch in every piano roll.' +
                    'Click on the piano roll of a sample, to show the path to the root in the piano roll below.\n' +
                    'By brushing the x-axis, the user can select a part and play it.' +
                    'Click on select to add the selection to the composition.'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Node-Link:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Similar to the Icicle view, the Node-Link view shows the hierarchy of melody samples,' +
                    'but the nodes are connected with links. This allows sorting the nodes of each level by' +
                    'a chosen metric. The value of the metric is represented in the width of the link. \n' +
                    'Hovering over a note highlights all notes with the same pitch in every melody.' +
                    'Interacting with the samples is the same as in the icicle.\n' +
                    'Furthermore by hovering over a node, the user can play the whole path or only the single node,' +
                    'or can add the sample to the composition.' +
                    'Using this way we allow a fast progress composition as adding the sample automatically generates a new level.'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Similarity:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'A scatterplot shows all samples as circles/glyphs where their position is based on the similarity towards' +
                    'all other samples.' +
                    'Therefore similar samples should be close together while different samples are further away.\n' +
                    'Gridify allows a different layout without intersections to see all glyphs at the same time.\n' +
                    'By clicking in the scatterplot the user can select a group of samples using the circular brush (resize by scrolling).\n' +
                    'The selected samples are shown in seperate piano rolls, a density plot or the histograms.\n' +
                    'The seperate Piano rolls can be sorted by different metrics in an ascending order.\n' +
                    'We allow choosing between different dimensionality reduction methods, as well as different distance functions' +
                    'and the weighting between rhythm and melody for our distance function.'}
                  </span>
                </Grid>
                <Grid
                  item
                  xs='auto'
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Typography style={{ minWidth: '7%' }} id='modal-modal-description' sx={{ mt: 2, mr: 5 }}>
                    Correlation:
                  </Typography>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {'Shows the correlation between two selected properties for each samples.' +
                    'A clickable correlation matrix allows faster comparison as well as showing overall potential correlations' +
                    'for all samples.\n' +
                    'The color in the matrix shows correlation:\n' +
                    'blue = correlation\n' +
                    'red = negative correlation\n' +
                    'yellow = no correlation'}
                  </span>
                </Grid>
              </Grid>

            </Box>
          </Modal>

          <Drawer
            anchor='top'
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
            {list('top')}
          </Drawer>
          {/**
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: Math.min(400,window.innerWidth)+"px"}}
              onMouseEnter={()=>{tooltip("infoPiano","modelselect")}}
              onMouseLeave={()=>{tooltip("infoPiano","modelselect")}}>
      <Select
              menuPlacement="auto"
              menuPosition="fixed"
              //value={allModels.filter(obj => selectedModelValue.includes(obj.value))}
              className="button hover basic-multi-select" classNamePrefix="select" id="model"
              isMulti
              onChange={e=>selectedModelValue = Array.isArray(e) ? e.map(x => x.value) : []}
              options={allModels}
              styles={colourStyles}>
      </Select>
      </div>
      </div>
      <div></div>
      */}
          {/* <input type="file" className="button" onChange={uploadFile} onMouseEnter={(e)=>{tooltip("infoPiano","upload")}} onMouseLeave={(e)=>{tooltip("infoPiano","upload")}}/>
      <div></div>

      <div></div>
      <button className="button" onClick={exportMidi} onMouseEnter={(e)=>{tooltip("infoPiano","export")}} onMouseLeave={(e)=>{tooltip("infoPiano","export")}}>Export Midi</button>
      <button className="button" onClick={resize} onMouseEnter={(e)=>{tooltip("infoPiano","resize")}} onMouseLeave={(e)=>{tooltip("infoPiano","resize")}}>Resize</button>

      <div></div> */}
          <input hidden className='button' type='text' id='updates' value='Waiting for action' onChange={(v) => { this.value = v }} />
          <div>

            {/**
        <p>BPM<input type="range" min="60" max="180" className="slider" id="temp3" defaultValue={bpm} orient="vertical" step="5"onChange={(value)=>updateTextInput(value,3)}></input>
        <input className="button" type="text" id="textInput3" value={bpm} onChange={(v)=>this.value=v}></input></p>
        */}
          </div>
          {/* <div>
      <div style={{textAlign: "right"}}>
        <button className="button" id="btsd" onClick={(e)=>setMinMax("tsd")} onMouseEnter={(e)=>{tooltip("infoIcicle","temp")}} onMouseLeave={(e)=>{tooltip("infoIcicle","temp")}}>- TempRange</button>
      </div>
        <div id="tsd">
          <p>Temperature min<input type="range" min="0.2" max="1.8" className="slider" id="temp1" defaultValue={temprange.min} orient="vertical" step="0.1" onChange={(value)=>updateTextInput(value,1)} onMouseEnter={(e)=>{tooltip("infoIcicle","temp")}} onMouseLeave={(e)=>{tooltip("infoIcicle","temp")}}></input>
          <input className="button" type="text" id="textInput1" value={temprange.min} onChange={(v)=>this.value=v}></input></p>
          <p>Temperature max<input type="range" min="0.2" max="1.8" className="slider" id="temp2" defaultValue={temprange.max} orient="vertical" step="0.1"onChange={(value)=>updateTextInput(value,2)} onMouseEnter={(e)=>{tooltip("infoIcicle","temp")}} onMouseLeave={(e)=>{tooltip("infoIcicle","temp")}}></input>
          <input className="button" type="text" id="textInput2" value={temprange.max} onChange={(v)=>this.value=v}></input></p>

        </div>
      </div>
      */}{/**
      <div style={{textAlign: "center"}}>
      <div className="infotip icontip">
          <span className="infotiptext" id="infoPiano" onMouseEnter={()=>{tooltip("infoPiano","click")}}>
            Controls: \n
            ctrl + wheel = zoom \n
            drag + ctrl = adjust length <br/>
            alt + click note = delete \n
            brush + e = delete all brushed <br/>
            drag + c = copy <br/>
            v = paste
          </span>
      </div>
      */}{/**
      <FontAwesomeIcon className="icon" icon={faInfo} onMouseEnter={(e)=>{tooltip("infoPiano","pianocontrol")}} onMouseLeave={(e)=>{tooltip("infoPiano","pianocontrol")}}></FontAwesomeIcon>
      <button className="button" id="bcom" onClick={(e)=>setViewModes("all")}>View All</button>
      <button className="button" id="bcom" onClick={(e)=>setViewModes("none")}>View None</button>
      <button className="button" id="bcom" onClick={(e)=>setViewModes("compose")}>Simple Compose Mode</button>
      <button className="button" id="bex" onClick={(e)=>setViewModes("explore")}>Explore Mode</button>
        <button className="button" id="bprd" onClick={(e)=>setMinMax("prd")}>- PianoRoll</button>

      </div> */}

          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container spacing={0}
              width={window.innerWidth}
              height={window.innerHeigt}
              justify='space-between'
              alignItems='flex-start'
            >
              {/** xs='12' md='flex' */}
              <Grid item flexBasis='100%' minWidth='100%' maxHeight='25%'>
                <div id='prd' onContextMenu={(e) => { e.preventDefault(); playFromListener() }}>
                  <PianoChart indexesOfView={indexesOfView} selectInDropdown={adaptDropdown} colormode={colorScaleForLegend} autoUpdate={autoUpdate} provVis={provVis} width={window.innerWidth} height={window.innerHeight} data={meloView} melodies={mainmelo} minmaxpitch={octaveRange} darkmode={darkmode} callback={adaptTT} partialGrid={partialGrid} guitarView={views[4]} />
                  <input className='button' type='hidden' id='clicked' name='clicked' />
                  {/* <button className="button"  onClick={setSelectToMelo}>Add to Composition</button>
        */}{/*
        <div>
        <FormControlLabel control={<Switch onClick={()=>{if(!octaveRange.adjust){
          octaveRange.lowest = 0;
          octaveRange.highest = 0;
          octaveRange.adjust = true
        }else{
          octaveRange.lowest = 48;
          octaveRange.highest = 84;
          octaveRange.adjust = false
        }
        resize();
        }}/>} label="Adjusted Pitch Range" labelPlacement="bottom"/>
          */}{/*
          <select className="button" id="instrument" onChange={(value) => {setInstrument()}}>
            <option key={0} value={0}>Bigger Keyboard</option>
            <option key={7} value={7}>Adapted</option>
            <option key={1} value={1}>Small Keyboard</option>
            <option key={2} value={2}>Guitar</option>
            <option key={3} value={3}>Violin</option>
            <option key={4} value={4}>Flute</option>
            <option key={5} value={5}>Trumpet</option>
            <option key={6} value={6}>Double Bass</option>

          </select>

        </div> */}
                </div>
              </Grid>

              <div id='ird' style={{ display: 'none' }}>
                <Grid item minWidth={(103 / partialGrid) + '%'} maxHeight='62%'>
                  {/** <div>
        <div style={{textAlign: "right"}}>
        <div className="infotip">
          <span className="infotiptext" id="infoIcicle" onMouseEnter={tooltip("infoIcicle","click")}>
            Controls: \n
            ctrl + wheel = zoom \n
            select icicle = add <br/>
            select sankey = add and generate new continuation
          </span>
      </div>
      <FontAwesomeIcon className="icon" icon={faInfo} onMouseEnter={(e)=>{tooltip("infoIcicle","infoIcicle")}} onMouseLeave={(e)=>{tooltip("infoIcicle","infoIcicle")}}></FontAwesomeIcon>
        <button className="button" id="bird" onClick={(e)=>setMinMax("ird")} >- Icicle</button>
        </div>
        */}

                  <IcicleRolls closeView={closeView} partialGrid={partialGrid} display={views[0]} toggleState={1} width={(window.innerWidth / partialGrid) - gridMargin} height={window.innerHeight * 0.59} modelUsedFlag={modelUsedFlag} data={mainmelo} octaveRange={octaveRange} darkmode={darkmode} callback={setMeloIcicle} getBPM={() => { return bpm }} />

                  {/** </div> */}
                </Grid>
              </div>
              <div id='nld' style={{ display: 'none' }}>
                <Grid item minWidth={(103 / partialGrid) + '%'} maxHeight='60%'>
                  {/** <div>
        <div style={{textAlign: "right"}}>
        <div className="infotip">
          <span className="infotiptext" id="infoIcicle" onMouseEnter={tooltip("infoIcicle","click")}>
            Controls: \n
            ctrl + wheel = zoom \n
            select icicle = add <br/>
            select sankey = add and generate new continuation
          </span>
      </div>
      <FontAwesomeIcon className="icon" icon={faInfo} onMouseEnter={(e)=>{tooltip("infoIcicle","infoIcicle")}} onMouseLeave={(e)=>{tooltip("infoIcicle","infoIcicle")}}></FontAwesomeIcon>
        <button className="button" id="bird" onClick={(e)=>setMinMax("ird")} >- Icicle</button>
        </div> */}

                  <NodeLinkRolls closeView={closeView} partialGrid={partialGrid} display={views[1]} toggleState={2} width={(window.innerWidth / partialGrid) - gridMargin} height={window.innerHeight * 0.59} modelUsedFlag={modelUsedFlag} data={mainmelo} octaveRange={octaveRange} darkmode={darkmode} callback={setMeloIcicle} getBPM={() => { return bpm }} />

                  {/** </div> */}
                </Grid>
              </div>
              {/* <div>
        <div style={{textAlign: "right"}}>
          <div className="infotip" >
            <span className="infotiptext" id="infoCluster" onMouseEnter={tooltip("infoCluster","click")}>
              Controls: \n
              wheel = size selection <br/>
              ctrl + wheel = zoom \n
              alt + click = reset zoom/position <br/>
              <br/>
              When using all Models:<br/>
              BasicRNN = Green<br/>
              MelodyRNN = Pink<br/>
              ImrpovRNN = Brown
            </span>
          </div>
          <FontAwesomeIcon className="icon" icon={faInfo} onMouseEnter={(e)=>{tooltip("infoCluster","infoCluster")}} onMouseLeave={(e)=>{tooltip("infoCluster","infoCluster")}}></FontAwesomeIcon>
          <button className="button" id="bccd" onClick={(e)=>setMinMax("ccd")}>- Cluster</button>
        </div>
        */}
              <div id='simd' style={{ display: 'none' }}>
                <Grid item minWidth={(103 / partialGrid) + '%'} maxHeight='60%'>
                  {/* <div id="ccd" >
          <div className="bloc-tabs">
            <button
              id="scatterTab"
              className={tabState===1?"button tabs active-tabs":"button tabs"}
              onClick={() => {tabState=1; resize()}}
            >
              Scatter DR
            </button>
            <button
              id="correlationTab"
              className={tabState===2?"button tabs active-tabs":"button tabs"}
              onClick={() => {tabState=2; resize()}}
            >
              Correlationscatter
            </button>
          </div>
          <div className="content-tabs">
            <div
              className={tabState===1?"content  active-content":"content"}
            >
              */}
                  <ClusterChart closeView={closeView} partialGrid={partialGrid} display={views[2]} width={(window.innerWidth / partialGrid) - gridMargin} height={window.innerHeight * 0.59} data={mainmelo} loadedModels={loadedModels} modelUsedFlag={modelUsedFlag} darkmode={darkmode} callback={adaptDropdown} close={getRec(0)} clicked={getHidden()} minmaxpitch={octaveRange} rnnsteps={rnnsteps} temprange={temprange} getBPM={() => { return bpm }} />
                </Grid>
              </div>
              {/* </div>
            <div
              className={tabState===2?"content  active-content":"content"}
            > */}
              <div id='cord' style={{ display: 'none' }}>
                <Grid item minWidth={(103 / partialGrid) + '%'} maxHeight='60%'>
                  <ScatterChooseChart closeView={closeView} partialGrid={partialGrid} display={views[3]} width={(window.innerWidth / partialGrid) - gridMargin} height={window.innerHeight * 0.59} data={mainmelo} darkmode={darkmode} />
                </Grid>
              </div>
              {/* </div>
          </div>
        </div>

      </div> */}
              <div id='fretd' style={{ display: 'none' }}>
                <Grid item minWidth='100%' maxHeight='50%'>
                  <div className='content active-content'>
                    <Fretboard callback={setfretData} display={views[4]} width={window.innerWidth} data={meloView} height={window.innerHeight * 0.35} darkmode={darkmode} getBPM={() => { return bpm }} selection={dropdownselection} />
                  </div>
                </Grid>
              </div>
            </Grid>
          </Box>

          <Box sx={{ filter: 'drop-shadow( 0px 0px 7px #aaa)', position: 'fixed', backgroundColor: 'toolbar.main', height: '3%', bottom: 0, left: 0, right: 0 }}>
            <FormControlLabel sx={{ /* color: 'white', */ ml: '50px', mr: '50px' }} control={<Switch checked={provVis} color='secondary' onClick={() => { toggleView(5) }} />} label='Provenance' labelPlacement='end' />
            <FormControlLabel sx={{ /* color: 'white', */ ml: '50px', mr: '50px' }} control={<Switch checked={views[0]} color='secondary' onClick={() => { toggleView(0) }} />} label='Icicle' labelPlacement='end' />
            <FormControlLabel sx={{ /* color: 'white', */ ml: '50px', mr: '50px' }} control={<Switch checked={views[1]} color='secondary' onClick={() => { toggleView(1) }} />} label='Node-Link' labelPlacement='end' />
            <FormControlLabel sx={{ /* color: 'white', */ ml: '50px', mr: '50px' }} control={<Switch checked={views[2]} color='secondary' onClick={() => { toggleView(2) }} />} label='Similarity' labelPlacement='end' />
            <FormControlLabel sx={{ /* color: 'white', */ ml: '50px', mr: '50px' }} control={<Switch checked={views[3]} color='secondary' onClick={() => { toggleView(3) }} />} label='Correlation' labelPlacement='end' />
        {/*    <FormControlLabel sx={{  ml: '50px', mr: '50px' }} control={<Switch checked={views[4]} color='secondary' onClick={() => { toggleView(4) }} />} label='Guitar' labelPlacement='end' />
            
        <BottomNavigationAction label="Icicle" />
        <BottomNavigationAction label="Node-Link" />
        <BottomNavigationAction label="Similarity" />
        <BottomNavigationAction label="Correlation" />
        <BottomNavigationAction label="Guitar playback" />
      */}

          </Box>
          {/*
      <div>
        <div style={{textAlign: "right"}}>
          <button className="button" id="bdcd" onClick={(e)=>setMinMax("dcd")} >- DiffChart</button>
        </div>
        <div id="dcd" >

          <DiffChart width={window.innerWidth} data={mainmelo} height={window.innerHeight/2} rec1={getRec(1)} rec2={getRec(2)}></DiffChart>
          <div>
          <select className="button" id="rec1" onChange={(value) => viewData(tt)}>
              {options.map((option)=>(
                <option key={option.value-1} value={option.value-1}>{textofOpt(option.value)}</option>
              ))}
            </select>
            <select className="button" id="rec2" onChange={(value) => viewData(tt)}>
              {options.map((option)=>(
                <option key={option.value-1} value={option.value-1}>{textofOpt(option.value)}</option>
              ))}
            </select>
          </div>

        </div>
      </div>
      <div>
        <div style={{textAlign: "right"}}>
          <button className="button" id="bcelld" onClick={(e)=>setMinMax("celld")} >- Cells</button>
        </div>
        <div id="celld" >
          <CellChart width={window.innerWidth} height={window.innerHeight} data={mainmelo} temprange={temprange}></CellChart>
        </div>
      </div>

      <div>
        <ScatterChooseChart width={window.innerWidth*0.6} data={mainmelo} height={window.innerHeight*0.6}/>
      </div>
      */}

        </div>
      </ThemeProvider>
    )
  } catch (e) {
    console.log(e)
  }
}

export default App
