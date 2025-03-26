import React, { useContext } from 'react'
import {Routes,Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Applications from './pages/Applications'
import ApplyIntern from './pages/ApplyIntern'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import DashBoard from './pages/DashBoard'
import ManageInternships from './pages/ManageInternships'
import AddInternship from './pages/AddInternship'
import ViewApplications from './pages/ViewApplications'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
const App = () => {
  const {showRecruiterLogin} = useContext(AppContext)
  return (
    <div>
      { showRecruiterLogin && <RecruiterLogin/>}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-intern/:id" element={<ApplyIntern />} />
        <Route path ='/intern-applications' element={< Applications/>} />
        <Route path="/dashboard" element={<DashBoard />}>
          <Route path="add-internship" element={<AddInternship />} />
          <Route path="manage-internships" element={<ManageInternships />} />
          <Route path="applications" element={<ViewApplications />} />
        </Route>
      </Routes>
      
      

    </div>
  )
}

export default App