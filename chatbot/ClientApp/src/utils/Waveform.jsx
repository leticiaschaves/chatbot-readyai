import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import WaveSurfer from 'wavesurfer.js'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import './waveform.css'

const Waveform = ({ audio }) => {
  const containerRef = useRef()
  const waveSurferRef = useRef({
    isPlaying: () => false,
  })
  const [isPlaying, toggleIsPlaying] = useState(false)


  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      backend: 'WebAudio',
      barWidth: 2,
      cursorColor: 'black',
      height: 20,
      barRadius: 1,
      waveColor: '#2d2d2d',
      progressColor: 'grey',
      dragToSeek: true,
    })
    waveSurfer.load(audio)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [audio])

  return (
    <div className="waveform-container"> 
      <button
        onClick={() => {
          waveSurferRef.current.playPause()
          toggleIsPlaying(waveSurferRef.current.isPlaying())
        }}
        type="button"
        className="play-button"
      >
        { isPlaying ? <FaPauseCircle className="pause-icon"/> : <FaPlayCircle className="play-icon" /> }
      </button>
      <div ref={containerRef} style={{width: '100%'}}/>
    </div>
  )
}

Waveform.propTypes = {
  audio: PropTypes.string.isRequired,
}

export default Waveform