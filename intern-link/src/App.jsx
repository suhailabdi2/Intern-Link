import React from 'react'
import {Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Applications from './pages/Applications'
import ApplyIntern from './pages/ApplyIntern'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/apply-intern" element={<ApplyIntern />} />
      </Routes>
    </div>
  )
}

export default App