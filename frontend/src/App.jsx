import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import GetCurrentUser from './hooks/GetCurrentUser'
import GetSuggestedUser from './hooks/GetSuggestedUser'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import GetAllPost from './hooks/GetAllPost'
import Loops from './pages/Loops'
import GetAllLoops from './hooks/GetAllLopps'
import Story from './pages/Story'
import GetAllStories from './hooks/GetAllStories'
import Message from './pages/Message'
import MessageArea from './pages/MessageArea'
import { useEffect } from 'react'
import {io} from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import GetFollowingList from './hooks/GetFollowingList'
import GetPrevChatUser from './hooks/GetPrevChatUser'
import Search from './pages/Search'
import GetAllNotifications from './hooks/GetAllNotifications'
import Notifications from './pages/Notifications'
import { setNotificationData } from './redux/userSlice'


export const serverUrl = "http://localhost:8000"

const App = () => {
  GetCurrentUser();
  GetSuggestedUser();
  GetAllPost();
  GetAllLoops();
  GetAllStories();
  GetFollowingList();
  GetPrevChatUser();
  GetAllNotifications();

  const {userData,notificationData} = useSelector(state=>state.user)
  const {socket} = useSelector(state=>state.socket)
  const dispatch = useDispatch();

 useEffect(() => {
  if (userData?._id) { 
    const socketIo = io(serverUrl, {
      query: { userId: userData._id },
    });

    dispatch(setSocket(socketIo));

    socketIo.on('getOnlineUsers', (users) => {
      // console.log("✅ Received online users:", users);
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socketIo.disconnect();
      if(socket){
        socket.close();
      }
    };
  }
}, [userData?._id]);

socket?.on("newNotification",(noti)=>{
  dispatch(setNotificationData([...notificationData,noti]))
})

  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path='/profile/:userName' element={userData?<Profile/>:<Navigate to={"/signin"}/>}/>
      <Route path='/story/:userName' element={userData?<Story/>:<Navigate to={"/signin"}/>}/>
      <Route path='/upload' element={userData?<Upload/>:<Navigate to={"/signin"}/>}/>
      <Route path='/search' element={userData?<Search/>:<Navigate to={"/signin"}/>}/>
      <Route path='/editprofile' element={userData?<EditProfile/>:<Navigate to={"/signin"}/>}/>
      <Route path='/messages' element={userData?<Message/>:<Navigate to={"/signin"}/>}/>
      <Route path='/messageArea' element={userData?<MessageArea/>:<Navigate to={"/signin"}/>}/>
      <Route path='/notifications' element={userData?<Notifications/>:<Navigate to={"/signin"}/>}/>
      <Route path='/loops' element={userData?<Loops/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App