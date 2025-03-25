import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import NavBar from '../components/NavBar'
import { assets } from '../assets/assets'
import moment from 'moment'
import InternshipCard from '../components/InternshipCard'

const ApplyIntern = () => {
  const {id} = useParams()
  
  const [internshipData, setInternshipData] = useState(null)
  const { internships} = useContext(AppContext)
  const fetchInternship = async () =>{
    const data = internships.filter(internship => internship._id === id)
    if(data.length !== 0){
      setInternshipData(data[0])
      console.log(data[0])
    }
  }
  useEffect(() =>{
    if(internships.length > 0){
      fetchInternship()
    }
  },[id,internships])
  return internshipData ? (
    <>
      <NavBar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'> 
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
            <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={internshipData.companyId.image} alt="" />
            <div className='text-center md:text-left text-neutral-700'>
              <h1 className='text-2xl sm:text-4xl font-medium'>{internshipData.title}</h1>
              <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                <span className='flex items-center gap-1'>
                <img src={assets.suitcase_icon} alt="" />
                {internshipData.companyId.name}
              </span>
              <span className='flex items-center gap-1'>
                <img src={assets.location_icon} alt="" />
                {internshipData.location}
              </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
            <button className='bg-blue-600 p-2.5 px-10 text-white rounded'>Apply Now</button>
            <p className='mt-1 text-gray-600'>Posted {moment(internshipData.date).fromNow()} </p>
          </div>
        </div>
      </div>
      <div className='gap-10 lg:gap-16 flex flex-col lg:flex-row justify-between items-start'>
        <div className='w-full lg:w-2/3 '>
          <h2 className='font-bold text-2xl mb-4' >Tasks</h2>
          <div className='mb-4'  dangerouslySetInnerHTML={{__html:internshipData.description}}></div>
          <button className='bg-blue-600 p-2.5 px-10 text-white rounded'>Apply now</button>
        </div>
        <div>
          {/* Right side */}
          <div className='w-full lg:w-2/5 mt-8 lg:mt-0 shadow-md space-y-4 ml-auto'>
            <h2 className='mb-4'>More internships from {internshipData.companyId.name}</h2>
            {internships.filter(internship => internship._id !== internshipData._id && internship.companyId._id ===internshipData.companyId._id).filter(internship => true).slice(0,3).map((internship,index)=><InternshipCard key={index} internship={internship} />)}
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