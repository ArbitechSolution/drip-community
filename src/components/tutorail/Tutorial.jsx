import React from 'react'
import ReactPlayer from 'react-player'
import tutorial from '../../images/tutorial.mp4'
import './Tutorail.css'
function Tutorial() {
  return (
    <div className='tut-main fluid-container' >
        <div className='row'>
          <div className='col-md-12'>
               <video  controls className='Videowidth'>
               <source src={tutorial} type="video/ogg"/>
               </video>
          </div>
        </div>
    </div>
  )
}

export default Tutorial