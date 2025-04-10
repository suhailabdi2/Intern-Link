import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import moment from 'moment'

const ViewApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { backendUrl, companyToken } = useContext(AppContext)

  // Function to fetch company applications
  const fetchCompanyApplications = async () => {
    if (!companyToken) {
      toast.error("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("Fetching applications with token:", companyToken)
      
      const response = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { 
          token: companyToken,
          'Content-Type': 'application/json'
        }
      })
      
      console.log("API Response:", response.data)
      
      if (response.data && response.data.success) {
        if (Array.isArray(response.data.applications)) {
          setApplications(response.data.applications)
        } else {
          console.error("Applications data is not an array:", response.data.applications)
          setApplications([])
          toast.error("Invalid data format received from server")
        }
      } else {
        console.error("API returned error:", response.data)
        toast.error(response.data?.message || "Failed to fetch applications")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request)
        toast.error("No response from server. Please check your connection.")
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message)
        toast.error(`Request error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to handle application status change
  const handleStatusChange = async (applicationId, newStatus) => {
    if (!applicationId) {
      toast.error("Invalid application ID")
      return
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { 
          applicationId, 
          status: newStatus 
        },
        { 
          headers: { 
            token: companyToken,
            'Content-Type': 'application/json'
          } 
        }
      )
      
      console.log("Status change response:", response.data)
      
      if (response.data && response.data.success) {
        // Update the local state to reflect the change
        setApplications(prevApplications => 
          prevApplications.map(application => 
            application._id === applicationId 
              ? { ...application, status: newStatus } 
              : application
          )
        )
        toast.success(`Application ${newStatus.toLowerCase()} successfully`)
      } else {
        toast.error(response.data?.message || "Failed to update application status")
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      
      if (error.response) {
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`)
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.")
      } else {
        toast.error(`Request error: ${error.message}`)
      }
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyApplications()
    } else {
      setLoading(false)
      toast.error("Please log in to view applications")
    }
  }, [companyToken])

  if (loading) {
    return <Loading />
  }
  
  return (
    <div className='container mx-auto p-4 '>
      <div>
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
        <thead>
        <tr className='border-b'>
          <th className='py-2 px-4 text-left' >#</th >
          <th className='py-2 px-4 text-left'>User Name</th >
          <th className='py-2 px-4 text-left max-sm:hidden'>Internship Title</th>
          <th className='py-2 px-4 text-left max-sm:hidden'>Location</th >
          <th className='py-2 px-4 text-left max-sm:hidden'>Date</th >
          <th className='py-2 px-4 text-left'>Status</th >
          <th className='py-2 px-4 text-left'>Action</th >
        </tr>
        </thead>
        <tbody>
          {applications && applications.length > 0 ? (
            applications.map((application, index) => (
              <tr key={application._id || index} className='text-gray-700'> 
                <td className='py-2 px-4 border-b text-center max-sm:hidden'>{index + 1}</td>
                <td className='py-2 px-4 border-b flex items-center'>
                  {application.userId && application.userId.image ? (
                    <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={application.userId.image} alt="" />
                  ) : null}
                  <span>{application.userId ? application.userId.name : 'Unknown User'}</span>
                </td>
                <td className='py-2 px-4 border-b text-center max-sm:hidden'>
                  {application.internshipId ? application.internshipId.title : 'Unknown Position'}
                </td>
                <td className='py-2 px-4 border-b text-center max-sm:hidden'>
                  {application.internshipId ? application.internshipId.location : 'Unknown Location'}
                </td>
                <td className='py-2 px-4 border-b text-center max-sm:hidden'>
                  {application.date ? moment(application.date).format('ll') : 'N/A'}
                </td>
                <td className='py-2 px-4 border-b text-center'>
                  <span className={`${
                    application.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  } px-2 py-1 rounded-full text-xs`}>
                    {application.status || 'Pending'}
                  </span>
                </td>
                <td className='py-2 px-4 border-b relative'>
                  <div className='relative inline-block text-left group'> 
                    <button className='text-gray-500 action-button'>...</button>
                    <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                      <button 
                        className='block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-100'
                        onClick={() => handleStatusChange(application._id, 'Accepted')}
                      >
                        Accept
                      </button>
                      <button 
                        className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'
                        onClick={() => handleStatusChange(application._id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">
                No applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default ViewApplications