import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner } from 'flowbite-react'
import { TextInput } from 'flowbite-react'
import { useState } from 'react'
import Oauth from '../components/Oauth'
const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill all the fields')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setLoading(false)
      if(response.ok){
        navigate('/sign-in')
      }
      if(data.success === false){
        return setError(data.message)
        
      }
      console.log(data)
    } catch (error) {
      setError(error.message)
      setLoading(false) 
    }
  }
  console.log(formData)



  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left side */}
        <div className='flex-1 max-sm:text-2xl'>
          <Link to='/' className=' font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-[#0A3150] rounded-lg text-white max-sm:text-2xl'>
            David Akintayo's  
            </span>
            Blog
        </Link>
        <div className='mt-5'>
          <h2>
            Welcome to David Akintayo's  Blog!
          </h2>
          <p className='text-sm text-wrap w-100'>
            Join our community of thinkers, storytellers, and explorers. Sign up today and be part of the conversation!
          </p>
        </div>
        </div>
        {/* right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={(e)=>handleSubmit(e)}>
            <div >
              <Label htmlFor='username'>
                Your Name
              </Label>
              <TextInput id='username' placeholder='Enter your name' rows={1} required type='text' onChange={(e)=>handleChange(e)}/>
            </div>
            <div >
              <Label htmlFor='email'>
                Your Email
              </Label>
              <TextInput id='email' placeholder='name@company.com' rows={1} required type='email' onChange={(e)=>handleChange(e)}/>
            </div>
            <div >
              <Label htmlFor='password'>
                Your Password
              </Label>
              <TextInput id='password' placeholder='Enter your password' rows={1} required type='password'onChange={(e)=>handleChange(e)}/>
            </div>
            <Button className='bg-[#0A3150] hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800' type='submit' disabled={loading}>
              
              {loading ? <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
              </> : "Sign Up"}
            </Button>
            <Oauth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500 hover:text-blue-700 font-semibold'>
              Sign In
            </Link>
          </div>
          {error && <Alert color="failure" className='mt-5'>{error}</Alert>}
        </div>
      </div>
    </div>
  )
}

export default Signup