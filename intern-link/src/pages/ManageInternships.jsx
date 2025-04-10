import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Loading from '../components/Loading'

const ManageInternships = () => {
  const navigate = useNavigate()
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const { backendUrl, companyToken } = useContext(AppContext)

  // Function to fetch company internship application data
  const fetchCompanyInternships = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/company/list-internship`,
        { headers: { token: companyToken } }
      )
      if (data.success && data.internshipsData) {
        setInternships(data.internshipsData.reverse())
        console.log(data.internshipsData)
      } else {
        toast.error(data.message || "Failed to fetch internships")
      }
    } catch (error) {
      console.error("Error fetching internships:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to fetch internships")
    } finally {
      setLoading(false)
    }
  }

  // Function to toggle internship visibility
  const handleVisibilityChange = async (internshipId, newVisibility) => {
    if (!internshipId) {
      toast.error("Invalid internship ID")
      return
    }
    
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { internshipId, visible: newVisibility },
        { headers: { token: companyToken } }
      )
      
      if (data.success) {
        // Update the local state to reflect the change
        setInternships(prevInternships => 
          prevInternships.map(internship => 
            internship && internship._id === internshipId 
              ? { ...internship, visible: newVisibility } 
              : internship
          )
        )
        toast.success(newVisibility ? "Internship is now visible" : "Internship is now hidden")
      } else {
        toast.error(data.message || "Failed to update visibility")
      }
    } catch (error) {
      console.error("Error updating visibility:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to update visibility")
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyInternships()
    } else {
      setLoading(false)
    }
  }, [companyToken])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left'>Title</th>
              <th className='py-2 px-4 border-b text-left'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {internships && internships.length > 0 ? (
              internships.map((internship, index) => (
                internship ? (
                  <tr className='text-gray-700' key={internship._id || index}>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                    <td className='py-2 px-4 border-b'>{internship.title || 'Untitled'}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{internship.date ? moment(internship.date).format('ll') : 'N/A'}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{internship.location || 'N/A'}</td>
                    <td className='py-2 px-4 border-b text-center'>{internship.applicants || 0}</td>
                    <td className='py-2 px-4 border-b'>
                      <input 
                        className='scale-125 ml-4' 
                        type="checkbox" 
                        checked={internship.visible !== false} 
                        onChange={() => handleVisibilityChange(internship._id, !internship.visible)}
                      />
                    </td>
                  </tr>
                ) : null
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No internships found. Add your first internship!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='mt-4 justify-between flex'>
        <button onClick={() => navigate('/dashboard/add-internship')} className='bg-black text-white rounded py-2 px-4'>
          Add New Internship
        </button>
      </div>
    </div>
  )
}

export default ManageInternships