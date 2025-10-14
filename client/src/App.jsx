import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import { useUser,useAuth } from '@clerk/clerk-react'
import Layout from './pages/Layout'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const {user}=useUser()
  const {getToken}=useAuth()
  useEffect(()=>{
    if(user){
  getToken().then((token)=>console.log(token))
    }
   
  },[user])
  return (
  <>
 <ToastContainer 
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>

  <Routes>
    <Route path='/' element={!user ? <Login/> : <Layout/>}>
      <Route index element={<Feed/>}/>
      <Route path='messages' element={<Messages/>} />
      <Route path='messages/:userId' element={<ChatBox/>} />
      <Route path='connections' element={<Connections/>} />
      <Route path='discover' element={<Discover/>} />
      <Route path='profile' element={<Profile/>} />
      <Route path='profile/:profileId' element={<Profile/>} />
      <Route path='create-post' element={<CreatePost/>} />
    </Route>
    
   
  </Routes>
  </>
  )
}
//9:31 6:37 multer
export default App
