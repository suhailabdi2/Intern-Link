import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import NavBar from '../components/NavBar'
import { assets } from '../assets/assets'
import moment from 'moment'
import InternshipCard from '../components/InternshipCard'
import axios from 'axios'
import { toast } from 'react-toastify'

const ApplyIntern = () => {
  const {id} = useParams()
  
  const [internshipData, setInternshipData] = useState(null)
  const { internships } = useContext(AppContext)

  const fetchInternship = async () => {
    const data = internships.filter(internship => internship._id === id)
    if(data.length !== 0){
      setInternshipData(data[0])
    }
  }

  useEffect(() => {
    if(internships.length > 0){
      fetchInternship()
    }
  },[id,internships])

  return internshipData ? (
    <>
      <NavBar />
      <div className='min-h-screen bg-gray-50'>
        <div className='container px-4 2xl:px-20 mx-auto py-10'>
          {/* Header Section */}
          <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-50 to-sky-50 px-8 py-12 border border-blue-100'>
              <div className='flex flex-col md:flex-row items-start gap-8 max-w-5xl mx-auto'>
                <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
                  <img 
                    className='h-20 w-20 object-contain' 
                    src={internshipData.companyId.image} 
                    alt={internshipData.companyId.name} 
                  />
                </div>
                <div className='flex-1'>
                  <h1 className='text-3xl font-semibold text-gray-800 mb-3'>
                    {internshipData.title}
                  </h1>
                  <div className='flex flex-wrap gap-4 text-gray-600'>
                    <span className='flex items-center gap-2'>
                      <img src={assets.suitcase_icon} alt="" className='w-5 h-5' />
                      {internshipData.companyId.name}
                    </span>
                    <span className='flex items-center gap-2'>
                      <img src={assets.location_icon} alt="" className='w-5 h-5' />
                      {internshipData.location}
                    </span>
                    {internshipData.category && (
                      <span className='flex items-center gap-2'>
                        <img src={assets.category_icon} alt="" className='w-5 h-5' />
                        {internshipData.category}
                      </span>
                    )}
                    <span className='flex items-center gap-2 text-gray-500 text-sm'>
                      Posted {moment(internshipData.date).fromNow()}
                    </span>
                  </div>
                </div>
                <div className='md:self-center'>
                  <button className='bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Main Content */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-xl p-8 shadow-sm'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6'>About This Role</h2>
                <div className='prose max-w-none text-gray-600' dangerouslySetInnerHTML={{__html:internshipData.description}}></div>
                <button className='mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
                  Apply Now
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-xl p-6 shadow-sm'>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                  More from {internshipData.companyId.name}
                </h3>
                <div className='space-y-4'>
                  {internships
                    .filter(internship => 
                      internship._id !== internshipData._id && 
                      internship.companyId._id === internshipData.companyId._id
                    )
                    .slice(0, 3)
                    .map((internship, index) => (
                      <InternshipCard key={index} internship={internship} />
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default ApplyIntern