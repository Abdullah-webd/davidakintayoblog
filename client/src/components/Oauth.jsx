import React from 'react'
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider,signInWithPopup,getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../rdeux/user/userSlice'
import { useNavigate } from 'react-router-dom'


const Oauth = () => {
    const auth = getAuth(app)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleGoogleClick = async()=>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt:'select_account'})
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultsFromGoogle)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                })
            })
            const data = await res.json()
            if(res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Button
  type="button"
  outline
  pill
  className="bg-white text-black border border-[#0A3150] hover:bg-[#0A3150] hover:text-white transition-all duration-300" onClick={()=>handleGoogleClick()}
>
  <AiFillGoogleCircle fontSize={25} />
  Continue with Google
</Button>

  )
}

export default Oauth