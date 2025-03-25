import React, { useContext } from 'react'
import logo from '../assets/logo.svg'
import { useClerk, UserButton,useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const NavBar = () => {
    const {openSignIn} = useClerk()
    const {user} = useUser()
    const navigate = useNavigate()

    const {setShowRecruiterLogin} = useContext(AppContext)


  return (
    <div className='shadow py-4'>
        <div className='container px-4 2x1:px-20 mx-auto flex justify-between items-center'>
            <img onClick={() => navigate('/')} className='cursor-pointer w-24 h-16'  src ={assets.new_logo} alt="logo" />
            {
                user?
                <div className='flex items-center gap-3'>
                    <Link to= {'/applications'}>Applied Jobs</Link>
                    <p ></p>
                    <p className='max-sm:hidden'>Hi {user.firstName + " "+ user.lastName }</p>
                    <UserButton />
                </div>
                :
                <div className='flex gap-4 max-sm:text-sm'>
                <button onClick={e =>setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
                <button onClick={e => openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>  
            }
                  
        </div>
        
    </div>
  )
}

export default NavBar