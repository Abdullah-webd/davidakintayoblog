import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPost from '../components/DashPost'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import AdminUsersDash from '../components/AdminUsersDash'
import CreatePost from './CreatePost'
const Dashboard = () => {
  const location = useLocation()
  const [tab,setTab] = useState('')
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    setTab(tabFromUrl)
  },[location.search])
  return (
    <div className='min-h-screen flex flex-row max-md:flex-col'>
      <div className=''>
        <DashSidebar/>
      </div >
        {tab === 'profile' && <DashProfile/>}
        {tab === 'posts' && <DashPost/>}
        {tab === 'users' && <DashUsers/>}
        {tab === 'comments' && <DashComments/>}

        {tab === 'admin' && <AdminUsersDash/>}
        {tab === 'create-post' && <CreatePost/>}
    </div>
  )
}

export default Dashboard