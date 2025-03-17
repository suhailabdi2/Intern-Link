import React from 'react'
import { assets } from '../assets/assets'

const InternshipCard = ({internship}) => {
  return (
    <div className='border p-6 shadow rounded'>
        <div className='flex justify-between items-center'>
            <img className='h-8' src={assets.company_icon} alt="" srcset="" />
        </div>
        <h4 className='font-medium text-xl mt-2'>{internship.title}</h4>
        <div className='flex items-center gap-3 mt-2 text-xs'>
            < span className='bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>{internship.location}</ span >
            < span className='bg-red-50 border border-red-200 px-4 py-1.5 rounded'>{internship.level}</ span >
        </div>
        <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{__html:internship.description.slice(0,150)}}></p>
        <div className='mt-4 flex gap-4 text-sm'>
            <button className="bg-blue-600 rounded text-white px-4 py-2">Apply Now</button >
            <button className="text-gray-500 border border-gray-500 rounded px-4 py-2">Learn More</button >
        </div>
        
    </div>
  )
}

export default InternshipCard