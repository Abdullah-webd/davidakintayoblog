import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import BlogPosts from './pages/BlogPosts'
import Header from './components/Header'
import FooterComponent from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyPrivateRoute from './components/OnlyAdminPrivate'
import CreatePost from './pages/CreatePost'
import UpdatePrivateRoute from './components/UpdatePostPrivate'
import UpdatePost from './pages/UpdatePost'
import Postpage from './pages/Postpage'
const App = () => {
  return (
    <>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/sign-in' element={<Signin/>}/>
          <Route path='/sign-up' element={<Signup/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path='/dashboard' element={<Dashboard/>}/>
          </Route>
          <Route element={<OnlyPrivateRoute/>}>
            <Route path='/create-post' element={<CreatePost/>}/>
          </Route>
          <Route element={<UpdatePrivateRoute/>}>
            <Route path='/update-post/:id' element={<UpdatePost/>}/>
          </Route>
          <Route path='/posts/:slug' element={<Postpage/>}/>
          <Route path='/posts' element={<BlogPosts/>}/>
        </Routes>
      <FooterComponent/>
    </>
    
  )
}

export default App