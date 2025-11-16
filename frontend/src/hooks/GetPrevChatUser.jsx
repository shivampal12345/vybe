import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
// import { setUserData } from '../redux/userSlice'
// import { setCurrentUserStory } from '../redux/storySlice'
import { setPrevChatUser } from '../redux/messageSlice'

const GetPrevChatUser = () => {

    const dispatch = useDispatch();
    const {messages} = useSelector(state=>state.message);

    useEffect(()=> {
        const fetchUser = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/message/prevChats`,{withCredentials:true})
                dispatch(setPrevChatUser(result.data))
                console.log(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[messages])
}

export default GetPrevChatUser;