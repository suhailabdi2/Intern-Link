import React, { useContext } from 'react'
import {Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Applications from './pages/Applications'
import ApplyIntern from './pages/ApplyIntern'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
const App = () => {
  const {showRecruiterLogin} = useContext(AppContext)
  return (
    <div>
      { showRecruiterLogin && <RecruiterLogin/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/apply-intern/:id" element={<ApplyIntern />} />
      </Routes>
    </div>
  )
}

export default App