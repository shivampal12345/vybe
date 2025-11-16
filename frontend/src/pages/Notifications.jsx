import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import { serverUrl } from '../App';
import { useEffect } from 'react';
import { setNotificationData } from '../redux/userSlice';

const Notifications = () => {
    const navigate = useNavigate();
    const {notificationData} = useSelector(state=>state.user);
    const dispatch = useDispatch();

    const ids = notificationData.map((n)=>n._id);

    const markAsRead = async()=> {
        try {
            const result = await axios.post(`${serverUrl}/api/user/markAsRead`,{notificationId:ids},{withCredentials:true})
            await fetchNotifications();
        } catch (error) {
            console.log(error)
        }
    };

     const fetchNotifications= async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getAllNotification`,{withCredentials:true})
                dispatch(setNotificationData(result.data))
            } catch (error) {
                console.log(error)
            }
        }

    useEffect(()=>{
        markAsRead();
    },[])

  return (
    <div className='w-full h-[100vh] bg-black overflow-auto'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'>
                          <MdOutlineKeyboardBackspace className="text-white w-[25px] h-[25px] cursor-pointer"
                          onClick={()=>navigate(`/`)} />
                          <h1 className='text-white text-[20px] font-semibold'>Notification</h1>
                </div>

                <div className='w-full h-[100%] flex flex-col gap-[20px] px-[10px]'>
                    {notificationData?.map((noti,index)=>(
                        <NotificationCard noti={noti} key={index}/>
                    ))}
                </div>
    </div>
  )
}

export default Notifications;