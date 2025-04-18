import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { supabase } from '../supabase'
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signOutSuccess } from '../rdeux/user/userSlice.js'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const DashProfile = () => {
  const dispatch = useDispatch()
  const fileRef = useRef()
  const { currentUser } = useSelector((state) => state.user)
  const [showAlert, setShowAlert] = useState(false)

  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [formData, setFormData] = useState({})
  const [alertContent, setAlertContent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  const deleteImageFromSupabase = async (url) => {
    try {
      const filePath = url.split('/storage/v1/object/public/mern-blog/')[1]
      const { error } = await supabase.storage.from('mern-blog').remove([filePath])
      if (error) console.error('Error deleting image:', error.message)
    } catch (err) {
      console.error('Failed to extract file path from URL:', err)
    }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setShowAlert(true)
        setAlertContent(data.message)
      }
      dispatch(signOutSuccess())
      setShowAlert(true)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    setShowAlert(false)
    dispatch(deleteStart())

    try {
      // Delete user's profile image from Supabase
      if (currentUser?.profilePicture) {
        await deleteImageFromSupabase(currentUser.profilePicture)
      }

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) {
        dispatch(deleteFailure(data.message))
        setShowAlert(true)
        setAlertContent(data.message)
      } else {
        dispatch(deleteSuccess())
        setShowAlert(true)
        setAlertContent('Account deleted successfully')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      dispatch(deleteFailure('An error occurred.'))
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  useEffect(() => {
    if (uploadedImageUrl) {
      setIsUploaded(true)
    }
  }, [uploadedImageUrl])

  useEffect(() => {
    if (isUploaded) {
      setTimeout(() => {
        setIsUploaded(false)
      }, 4000)
    }
  }, [isUploaded])

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false)
        setAlertContent(null)
      }, 5000)
    }
  }, [showAlert])

  const uploadImage = async () => {
    setUploading(true)
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `profile-pictures/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('mern-blog')
      .upload(filePath, imageFile)

    if (uploadError) {
      setError('Error uploading image: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('mern-blog').getPublicUrl(filePath)

    setFormData((prev) => ({
      ...prev,
      profilePicture: data.publicUrl,
    }))
    setUploadedImageUrl(data.publicUrl)
    setUploading(false)
    setError(null)
  }

  const handleFormUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.keys(formData).length === 0) {
      return setError('No changes made')
    }

    try {
      dispatch(updateStart())

      // Delete old profile image if new one uploaded
      if (formData.profilePicture && currentUser.profilePicture) {
        await deleteImageFromSupabase(currentUser.profilePicture)
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        return dispatch(updateFailure(data.message))
      }

      dispatch(updateSuccess(data))
      setShowAlert(true)
      setAlertContent('Profile updated successfully')
    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={fileRef} hidden />

        <div
          className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => fileRef.current.click()}
        >
          <img
            src={imageFileUrl || uploadedImageUrl || currentUser.profilePicture}
            alt='user'
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
          />
        </div>

        {uploading ? (
          <p className='text-center text-blue-500'>Uploading image...</p>
        ) : isUploaded ? (
          <p className='text-center text-green-500'>Image uploaded successfully!</p>
        ) : null}

        {error && <p className='text-center text-red-500'>{error}</p>}

        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleFormUpload} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleFormUpload} />
        <TextInput type='password' id='password' placeholder='Password' onChange={handleFormUpload} />

        <Button outline type='submit' disabled={uploading} className='border-1 border-[#0A3150] text-[#0A3150] w-full hover:bg-white hover:text-[#0A3150]'>
          Update
        </Button>

        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button type='button' className='bg-[#0A3150] text-white  w-full hover:bg-[#0A3150] hover:text-white'>
              Create a post
            </Button>
          </Link>
        )}

        {showAlert && <Alert color='success'>{alertContent}</Alert>}
      </form>

      <Modal show={showModal} size='md' popup onClose={() => setShowModal(false)}>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='red' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)} className='ml-2'>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className='cursor-pointer' onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  )
}

export default DashProfile
