import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import InternshipListing from '../components/InternshipListing'


const Home = () => {
  return (
    <div>
        <NavBar />
        <Hero />
        <InternshipListing/>
    </div>
  )
}

export default Home