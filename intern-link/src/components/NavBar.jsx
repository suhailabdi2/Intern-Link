import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const NavBar = () => {
    const navigate = useNavigate()
    const [showAuthForm, setShowAuthForm] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        image: null
    })
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

    const { 
        setShowRecruiterLogin, 
        backendUrl, 
        userData, 
        loginUser, 
        logoutUser 
    } = useContext(AppContext)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!isLogin && !isTextDataSubmitted) {
            return setIsTextDataSubmitted(true)
        }

        try {
            if (isLogin) {
                const { data } = await axios.post(`${backendUrl}/api/users/login`, {
                    email: formData.email,
                    password: formData.password
                })

                if (data.success) {
                    loginUser(data.user, data.token)
                    setShowAuthForm(false)
                    navigate('/intern-applications')
                    toast.success('Login successful!')
                } else {
                    toast.error(data.message)
                }
            } else {
                if (!isTextDataSubmitted) {
                    return
                }

                const formDataToSend = new FormData()
                formDataToSend.append('name', formData.name)
                formDataToSend.append('email', formData.email)
                formDataToSend.append('password', formData.password)
                formDataToSend.append('image', formData.image)

                const { data } = await axios.post(`${backendUrl}/api/users/register`, formDataToSend)

                if (data.success) {
                    loginUser(data.user, data.token)
                    setShowAuthForm(false)
                    navigate('/intern-applications')
                    toast.success('Registration successful!')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred')
        }
    }

    const handleLogout = () => {
        logoutUser()
        toast.success('Logged out successfully')
        navigate('/')
    }

    return (
        <div className='shadow py-4'>
            <div className='container px-4 2x1:px-20 mx-auto flex justify-between items-center'>
                <img onClick={() => navigate('/')} className='cursor-pointer w-24 h-16' src={assets.new_logo} alt="logo" />
                {userData ? (
                    <div className='flex items-center gap-4'>
                        <Link to={'/intern-applications'} className='text-gray-600 hover:text-blue-600'>Applied Internships</Link>
                        <div className='flex items-center gap-2'>
                            <img src={userData.image} alt="Profile" className='w-8 h-8 rounded-full' />
                            <span className='text-gray-700'>Hi, {userData.name}</span>
                            <button onClick={handleLogout} className='text-gray-600 hover:text-blue-600'>Logout</button>
                        </div>
                    </div>
                ) : (
                    <div className='flex gap-4 max-sm:text-sm'>
                        <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
                        <button onClick={() => setShowAuthForm(true)} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                )}
            </div>

            {/* Auth Form Modal */}
            {showAuthForm && (
                <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
                    <form onSubmit={handleSubmit} className='relative bg-white p-10 rounded-xl text-slate-500'>
                        <h1 className='text-center text-2xl text-neutral-700 font-medium'>
                            {isLogin ? 'Login' : 'Sign Up'}
                        </h1>
                        <p className='text-sm'>
                            {isLogin ? 'Welcome please Log in' : 'Welcome please sign up'}
                        </p>

                        {!isLogin && !isTextDataSubmitted && (
                            <>
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.person_icon} alt="" />
                                    <input
                                        onChange={handleInputChange}
                                        value={formData.name}
                                        required
                                        type="text"
                                        name="name"
                                        placeholder='Full Name'
                                    />
                                </div>
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.email_icon} alt="" />
                                    <input
                                        onChange={handleInputChange}
                                        value={formData.email}
                                        required
                                        type="email"
                                        name="email"
                                        placeholder='Email'
                                    />
                                </div>
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.lock_icon} alt="" />
                                    <input
                                        onChange={handleInputChange}
                                        value={formData.password}
                                        required
                                        type="password"
                                        name="password"
                                        placeholder='Password'
                                    />
                                </div>
                            </>
                        )}

                        {(!isLogin && isTextDataSubmitted) && (
                            <div className='flex items-center gap-4 my-10'>
                                <label htmlFor="image">
                                    <img
                                        className='w-16 rounded-full'
                                        src={formData.image ? URL.createObjectURL(formData.image) : assets.upload_area}
                                        alt=""
                                    />
                                    <input
                                        onChange={handleImageChange}
                                        type="file"
                                        id='image'
                                        accept="image/*"
                                        hidden
                                    />
                                </label>
                                <p>Upload Profile <br/> Picture</p>
                            </div>
                        )}

                        {isLogin && (
                            <>
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.email_icon} alt="" />
                                    <input
                                        onChange={handleInputChange}
                                        value={formData.email}
                                        required
                                        type="email"
                                        name="email"
                                        placeholder='Email'
                                    />
                                </div>
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.lock_icon} alt="" />
                                    <input
                                        onChange={handleInputChange}
                                        value={formData.password}
                                        required
                                        type="password"
                                        name="password"
                                        placeholder='Password'
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className='bg-blue-600 w-full text-white py-2 rounded-full mt-5'>
                            {isLogin ? 'Login' : (isTextDataSubmitted ? 'Create Account' : 'Next')}
                        </button>

                        <p className='mt-5 text-center'>
                            {isLogin ? (
                                <>Don't have an Account? <span className='text-blue-600 cursor-pointer' onClick={() => setIsLogin(false)}>Sign up</span></>
                            ) : (
                                <>Already have an Account? <span className='text-blue-600 cursor-pointer' onClick={() => setIsLogin(true)}>Log in</span></>
                            )}
                        </p>

                        <img
                            className='absolute top-5 right-5 cursor-pointer'
                            onClick={() => {
                                setShowAuthForm(false)
                                setIsLogin(true)
                                setIsTextDataSubmitted(false)
                                setFormData({
                                    name: '',
                                    email: '',
                                    password: '',
                                    image: null
                                })
                            }}
                            src={assets.cross_icon}
                            alt=""
                        />
                    </form>
                </div>
            )}
        </div>
    )
}

export default NavBar