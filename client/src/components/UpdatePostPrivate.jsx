import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
const UpdatePrivateRoute = () => {
    const {currentUser} = useSelector((state) => state.user)
  return currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default UpdatePrivateRoute