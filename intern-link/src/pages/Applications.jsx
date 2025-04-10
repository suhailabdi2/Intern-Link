import React, { useState, useContext, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { assets } from '../assets/assets'
import moment from 'moment'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Applications = () => {
  const navigate = useNavigate()
  const [isEdit, setisEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [resumePreview, setResumePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { userToken, backendUrl, userData, setUserData } = useContext(AppContext)

  useEffect(() => {
    if (userToken) {
      fetchApplications()
    }
  }, [userToken])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      
      if (data.success) {
        setApplications(data.applications)
      } else {
        toast.error(data.message || 'Failed to fetch applications')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching applications')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResume(file)
      
      // Create a preview URL for PDF files
      if (file.type === 'application/pdf') {
        const fileURL = URL.createObjectURL(file)
        setResumePreview(fileURL)
      } else {
        setResumePreview(null)
      }
    }
  }

  const handleResumeUpdate = async () => {
    if (!resume) {
      toast.error('Please select a resume file')
      return
    }

    // Validate file type
    if (resume.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    // Validate file size (5MB limit)
    if (resume.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('resume', resume)
      
      const { data } = await axios.post(`${backendUrl}/api/users/update-resume`, formData, {
        headers: { 
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (data.success) {
        // Update the user data in context with the new resume URL
        setUserData(prev => ({
          ...prev,
          resume: data.resumeUrl
        }))
        
        toast.success('Resume updated successfully')
        setisEdit(false)
        setResume(null)
        setResumePreview(null)
      } else {
        toast.error(data.message || 'Failed to update resume')
      }
    } catch (error) {
      console.error('Resume upload error:', error)
      toast.error(error.response?.data?.message || 'Error updating resume')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <NavBar />
      <div className='container px-4 min-h-{65vh} 2xl:px-20 mx-auto my-10'>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-700">Hi, {userData?.name}</h1>
        </div>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='mb-6 mt-3'>
          {
            isEdit ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Upload your resume (PDF format)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="resumeUpload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="resumeUpload" 
                        type="file" 
                        className="hidden" 
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                
                {resume && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{resume.name}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setResume(null)
                          setResumePreview(null)
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setisEdit(false)
                      setResume(null)
                      setResumePreview(null)
                    }} 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResumeUpdate} 
                    disabled={!resume || uploading}
                    className={`px-4 py-2 rounded-lg text-white ${
                      !resume || uploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : 'Upload Resume'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {userData?.resume ? (
                      <>
                        <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Your Resume</h3>
                          <p className="text-sm text-gray-500">Click to view your uploaded resume</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">No Resume Uploaded</h3>
                          <p className="text-sm text-gray-500">Upload your resume to apply for internships</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {userData?.resume && (
                      <a 
                        href={userData.resume} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        View Resume
                      </a>
                    )}
                    <button 
                      onClick={() => setisEdit(true)} 
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      {userData?.resume ? 'Update Resume' : 'Upload Resume'}
                    </button>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <h2 className='text-xl font-semibold mb-4'>Applied Internships</h2>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length > 0 ? (
          <table className='min-w-full bg-white border rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b text-left'>Company</th>
                <th className='py-3 px-4 border-b text-left'>Location</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Title</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-bottom'>
                    <img className='w-8 h-8 rounded-full' src={application.companyId?.image || assets.upload_area} alt="" />
                    {application.companyId?.name || 'Unknown Company'}
                  </td>
                  <td className='py-2 px-4 border-b'>{application.internshipId?.location || 'N/A'}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{application.internshipId?.title || 'N/A'}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{moment(application.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b'>
                    <span className={`${
                      application.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    } px-4 py-1.5 rounded`}>
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>You haven't applied to any internships yet.</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              Browse Internships
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Applications