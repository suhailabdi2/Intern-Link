import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { use } from 'react'
import 'quill/dist/quill.snow.css';
import {  InternCategories, InternLocations, } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


const AddInternship = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Kisumu')
  const [category, setCategory] = useState('')
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const { backendUrl, companyToken } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const description = quillRef.current.root.innerHTML
      const { data } = await axios.post(`${backendUrl}/api/company/post-internship`,
        { title, description, location, category },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success("Internship posted successfully")
        setTitle('')
        setCategory('')
        quillRef.current.root.innerHTML = ""
      } else {
        toast.error(data.message || "Failed to post internship")
      }
    } catch (error) {
      console.error("Error creating internship:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to create internship")
    }
  }

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3 ' action="">
      <div className='w-full'>
        <p className='mb-2'>Title</p>
        <input className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' onChange={e => (setTitle(e.target.value))} value={title} required type="text" name="" id="" placeholder='Title here' />
      </div>
      <div className='w-full max-w-lg'>
        <p className='my-2'>Tasks Description</p>
        <div ref={editorRef}></div>
      </div>
      
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Category</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)} value={category} name="" id="">
            <option value="">Select Category</option>
            {InternCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='mb-2'>Location</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)} value={location} name="" id="">
            {InternLocations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>
      <button className='w-28 py-3 mt-4 bg-black text-white'>Add</button>
    </form>
  )
}

export default AddInternship