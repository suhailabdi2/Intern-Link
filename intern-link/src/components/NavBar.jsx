import React from 'react'
import logo from '../assets/logo.svg'
import { useClerk, UserButton,useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    const {openSignIn} = useClerk()
    const {user} = useUser()

  return (
    <div className='shadow py-4'>
        <div className='container px-4 2x1:px-20 mx-auto flex justify-between items-center'>
            <img src ={logo} alt="logo" />
            {
                user?
                <div className='flex items-center gap-3'>
                    <Link to= {'/applications'}>Applied Jobs</Link>
                    <p></p>
                    <p>Hi {user.firstName + " "+ user.lastName }</p>
                    <UserButton />
                </div>
                :
                <div className='flex gap-4 max-sm:text-sm'>
                <button className='text-gray-600'>Recruiter Login</button>
                <button onClick={e => openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>  
            }
                  
        </div>
        
    </div>
  )
}

export default NavBar