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
      barWidth: 1, // Customize bar width to make it tiny
      cursorWidth: 1, // Customize cursor width to make it tiny
      cursorColor: 'red', // Customize cursor color
      height: 40, // Customize waveform height to make it tiny
      barRadius: 1, // Add rounded edges to bars for a cute look
      waveColor: 'lightblue', // Customize waveform color
      progressColor: 'blue', // Customize progress color
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
      <div ref={containerRef} />
    </div>
  )
}

Waveform.propTypes = {
  audio: PropTypes.string.isRequired,
}

export default Waveform