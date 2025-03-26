import React, { use } from 'react'
import { manageInternshipData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
const ManageInternships = () => {

  const navigate = useNavigate()
  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr >
              <th className='py-2 px-4 border-b text-left max-sm:hidden '>#</th>
              <th className='py-2 px-4 border-b text-left'>Title</th>
              <th className='py-2 px-4 border-b text-left'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {
              manageInternshipData.map((internship, index) => (

                <tr className='text-gray-700' key={index}>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{internship._id}</td>
                  <td className='py-2 px-4 border-b'>{internship.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{moment(internship.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{internship.location}</td>
                  <td className='py-2 px-4 border-b text-center'>{internship.applicants}</td>
                  <td className='py-2 px-4 border-b'><input className='scale-125 ml-4' type="checkbox" name="" id="" /></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className='mt-4 justify-between flex'>
        <button onClick={() =>navigate('/dashboard/add-internship')} className='bg-black text-white rounded py-2 px-4 '> Add New Job</button>
      </div>
      
    </div>
  )
}

export default ManageInternships