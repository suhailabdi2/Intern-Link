import React, { useState } from 'react'
import NavBar from '../components/NavBar'

const AddInternship = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')

  return (
   <form action="">
    <p>Title</p>
    <input onChange={e =>(setTitle(e.target.value))} value={title} required type="text" name="" id=""  placeholder='Title here'/>
    <p>Location</p>
    <input onChange={e =>(setLocation(e.target.value))} value={location} required type="text" name="" id="" placeholder='Title here' />
    
   </form>
  )
}

export default AddInternship