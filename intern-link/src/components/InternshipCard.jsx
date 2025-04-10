import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const InternshipCard = ({internship}) => {
  const navigate = useNavigate() 
  return (
    <div className='border p-6 shadow rounded'>
        <div className='flex justify-between items-center'>
            <img 
              className='h-8 w-8 object-contain' 
              src={internship.companyId?.image || assets.company_icon} 
              alt={internship.companyId?.name || "Company"} 
            />
        </div>
        <h4 className='font-medium text-xl mt-2'>{internship.title}</h4>
        <div className='flex items-center gap-3 mt-2 text-xs'>
            <span className='bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>{internship.location}</span>
            {internship.category && (
              <span className='bg-green-50 border border-green-200 px-4 py-1.5 rounded'>{internship.category}</span>
            )}
        </div>
        <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{__html:internship.description ? internship.description.slice(0,150) : ''}}></p>
        <div className='mt-4 flex gap-4 text-sm'>
            <button onClick={() => {navigate(`/apply-intern/${internship._id}`); window.scrollTo(0,0)}} className="bg-blue-600 rounded text-white px-4 py-2">Apply Now</button>
            <button onClick={() => {navigate(`/apply-intern/${internship._id}`); window.scrollTo(0,0)}} className="text-gray-500 border border-gray-500 rounded px-4 py-2">Learn More</button>
        </div>
        
    </div>
  )
}

export default InternshipCard