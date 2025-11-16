import axios from 'axios'
import React from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationData } from '../redux/userSlice'
import { useEffect } from 'react'

const GetAllNotifications = () => {

    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user) 

       useEffect(()=>{
         const fetchNotifications= async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getAllNotification`,{withCredentials:true})
                dispatch(setNotificationData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchNotifications()
       },[dispatch,userData])
   
}

export default GetAllNotifications;