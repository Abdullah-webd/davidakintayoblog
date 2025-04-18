import React from 'react'
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiArrowRight,HiDocumentText,HiUser } from 'react-icons/hi'
import { useLocation } from 'react-router-dom'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { signOutSuccess } from '../rdeux/user/userSlice'
import { useSelector } from 'react-redux'
import { HiUsers } from "react-icons/hi";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaChartPie } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";



const DashSidebar = () => {
    const {currentUser} = useSelector((state) => state.user)
    
    const location = useLocation()
    const dispatch = useDispatch()
      const [tab,setTab] = useState('')
      useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        setTab(tabFromUrl)
      },[location.search])
      const [alertContent, setAlertContent] = useState(null)
      const [showAlert,setShowAlert] = useState(false)

      const handleSignOut = async () => {
            try {
              const res = await fetch('/api/user/signout', {
                method: 'POST',
                credentials: 'include', // ✅ THIS IS IMPORTANT
              });
              const data = await res.json()
              if (!res.ok) {
                setShowAlert(true)
                setAlertContent(data.message) 
              }
              dispatch(signOutSuccess())
            }
            catch (error) {
              console.error('Error signing out:', error)
            }
          }
  return (
    <Sidebar className='w-full md:w-56'>
        <SidebarItems>
            <SidebarItemGroup className='flex flex-col gap-2'>
              {
                currentUser.isAdmin && (
                  <Link to='/dashboard?tab=admin'>
                    <SidebarItem active={tab === 'admin'} icon={FaChartPie}  
                    as='div'
                    >
                        Dashboard
                      </SidebarItem>
                    </Link>
                )
              }
                <Link to='/dashboard?tab=profile'>
                    <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin': 'User'} labelColor='dark'
                    as='div'
                    >
                        Profile
                    </SidebarItem>
                </Link>
                {
                  currentUser.isAdmin && (
                    <>
                      <Link to='/dashboard?tab=posts'>
                      <SidebarItem active={tab === 'posts'} icon={HiDocumentText}  
                      as='div'
                      >
                          Posts
                        </SidebarItem>
                      </Link>
                      <Link to='/dashboard?tab=users'>
                      <SidebarItem active={tab === 'users'} icon={HiUsers}  
                      as='div'
                      >
                          Users
                        </SidebarItem>
                      </Link>
                      <Link to='/dashboard?tab=comments'>
                      <SidebarItem active={tab === 'comments'} icon={TfiCommentAlt}  
                      as='div'
                      >
                          Comments
                        </SidebarItem>
                      </Link>
                      <Link to='/dashboard?tab=create-post'>
                      <SidebarItem active={tab === 'comments'} icon={IoIosCreate}  
                      as='div'
                      >
                          Create Post
                        </SidebarItem>
                      </Link>
                    </>
                  )
                }
                
                <SidebarItem icon={HiArrowRight} labelColor='dark' className='cursor-pointer' onClick={()=> handleSignOut()}>
                    Sign Out
                </SidebarItem>
            </SidebarItemGroup>
        </SidebarItems>
    </Sidebar>
  )
}

export default DashSidebar