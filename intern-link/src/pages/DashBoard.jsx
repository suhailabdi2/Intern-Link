import React, { use } from 'react'
import NavBar from '../components/NavBar'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const DashBoard = () => {

    const navigate = useNavigate()
  return (
    <div className='min-h-screen'>
        
        {/* NavBar */}
        <div className=' shadow py-4'>
            <div className='px-5 flex justify-between items-center'>
                <img onClick={e => navigate('/')} className='w-16 h-24 max-sm:w-32  cursor-pointer' src={assets.new_logo} alt="" />
                <div className='flex items-center gap-3 '>
                    <p  className='max-sm:hidden'>Welcome InternLink</p >
                    <div className='relative group'>
                        <img className='w-8 border rounded-full' src={assets.company_icon} alt="" />
                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black roundedd pt-12 '>
                            <ul className='list-none m-0 p -2 bg:white rounded-md border text-sm'>
                                <li className='py-1 px-2 cursor-pointer pr-10'>Log Out</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='flex-items-start'>
            {/* Sidebar */}
            <div className='inline-block min-h-screen border-r-2 '>
                <ul className='flex flex-col items-start pt-5 text-gray-800'>
                    <NavLink className={({isActive})=> `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${ isActive && 'bg-blue-100 border-r-4 border-blue-500'} `} to={'/dashboard/add-internship'}>
                        <img src={assets.add_icon}/>
                        <p className='max-sm:hidden' >Add Internship</p >
                    </NavLink>
                    <NavLink className={({isActive})=> `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'} `} to={'/dashboard/manage-internships'}>
                        <img src={assets.home_icon}/>
                        <p className='max-sm:hidden'>Manage Internship</p >
                    </NavLink>
                    <NavLink className={({isActive})=> `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'} `} to={'/dashboard/applications'}>
                        <img src={assets.person_tick_icon}/>
                        <p className='max-sm:hidden'>View Internship</p >
                    </NavLink>
                </ul>
            </div>
            {/* Main Content */}
            <div>
                <Outlet />
            </div>
        </div>
        
    </div>
  )
}

export default DashBoard