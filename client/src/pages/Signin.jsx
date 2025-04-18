import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner } from 'flowbite-react'
import { TextInput } from 'flowbite-react'
import { useState } from 'react'
import { signInStart,signInFailure,signInSuccess } from '../rdeux/user/userSlice.js'
import { useDispatch,useSelector } from 'react-redux'
import Oauth from '../components/Oauth.jsx'


const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user)
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ( !formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields'))
    }
    try {
      dispatch(signInStart())
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if(response.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
      if(data.success === false){
        return dispatch(signInFailure(data))
        
      }
      console.log(data)
    } catch (error) {
      dispatch(signInFailure(error))
    }
  }



  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-3'>
        {/* left side */}
        <div className='flex-1 max-sm:text-2xl'>
          <Link to='/' className=' font-bold dark:text-white text-4xl flex'>
            <div className=' bg-[#0A3150] rounded-lg text-white w-fit px-2 py-1 max-sm:text-2xl'>
              David Akintayo's 
            </div>
            Blog
        </Link>
        <div className='mt-5'>
          <h2>
            Welcome to David Akintayo's Blog!
          </h2>
          <p className='text-sm text-wrap w-100'>
            Join our community of thinkers, storytellers, and explorers. Sign in today and be part of the conversation!
          </p>
        </div>
        </div>
        {/* right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={(e)=>handleSubmit(e)}>
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
            <Button className='bg-[#0A3150] text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800' type='submit' disabled={loading}>
              
              {loading ? <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
              </> : "Sign In"}
            </Button>
            <Oauth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't Have an account?</span>
            <Link to='/sign-up' className='text-blue-500 hover:text-blue-700 font-semibold'>
              Sign Up
            </Link>
          </div>
          {error && <Alert color="failure" className='mt-5'>{error.message}</Alert>}
        </div>
      </div>
    </div>
  )
}

export default Signin