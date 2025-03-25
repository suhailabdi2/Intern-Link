import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const RecruiterLogin = () => {
  const [state,setState] = useState('Login')
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [image,setImage] =useState(false)
  const {setShowRecruiterLogin} = useContext(AppContext)

  const [isTextDataSubmitted,setIsTextDataSubmitted] = useState(false)
  const onSubmitHandler = async (e) =>{
    e.preventDefault()
    if(state ==='Sign Up' && !isTextDataSubmitted){
        setIsTextDataSubmitted(true)
        
    }
  }
  useEffect(() => {
    document.body.style.overflow ='hidden'
    return () => {
        document.body.style.overflow = 'unset'
    }
}, []);


  useEffect(() => {
    console.log("State changed:", state);
    console.log("isTextDataSubmitted changed:", isTextDataSubmitted);
}, [state, isTextDataSubmitted]);
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
            <p className='text-sm'>
               {state ==='Login' ? 'Welcome please Log in' : 'Welcome please sign up '}</p>
            {
                state === 'Sign Up' && isTextDataSubmitted ? 
            <>
                <div className='flex items-center gap-4 my-10'>
                    <label htmlFor="image">
                        <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                        <input onChange={e=>setImage(e.target.files[0])} type="file" id='image' hidden />
                    </label>
                    <p>Upload Company <br/> Logo</p>
                </div>
            
            </> :
            <>
            {state !== 'Login' &&(
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.person_icon} alt="" />
                <input onChange={e => setName(e.target.value)} value={name} required type="text" placeholder='Company Name' name="" id="" />
            </div>
            )}
            
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt="" />
                <input onChange={e => setEmail(e.target.value)} value={email} required type="email" placeholder='Company Email' name="" id="" />
            </div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.lock_icon} alt="" />
                <input onChange={e => setPassword(e.target.value)} value={password} required type="password" placeholder='Password' name="" id="" />
            </div>
            </>
            }
            
            
            <button type="submit" className='bg-blue-600 w-full text-white py-2 rounded-full'>
                {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'create account' :  'next' }
            </button>

            {
                state === 'Login' ?<p className='mt-5 text-center'>Don't have an Account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign Up")}>Sign up</span></p> :
                 <p className='mt-5 text-center'>Already have an Account ?<span className='text-blue-600 cursor-pointer' onClick={() => setState("Login")}>Log in</span></p>
            }
             <img  className='absolute top-5 right-5 cursor-pointer' onClick={() => setShowRecruiterLogin(false)} src={assets.cross_icon} alt="" />
            
            
        </form>
    </div>
  )
}

export default RecruiterLogin