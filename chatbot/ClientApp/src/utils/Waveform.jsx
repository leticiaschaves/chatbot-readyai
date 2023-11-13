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
      cursorColor: 'white',
      height: 40,
      barRadius: 1,
      waveColor: 'white',
      progressColor: 'grey',
      dragToSeek: true,
    })
    waveSurfer.load(audio)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })
  
    //Volta a bolinha pro inicio quando acaba o audio
    waveSurfer.on('finish', () => {
      waveSurferRef.current.seekTo(0)
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