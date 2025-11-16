import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUser} from '../redux/userSlice'

const GetSuggestedUser = () => {

    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user);

    useEffect(()=> {
        const fetchUser = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/suggested`,{withCredentials:true})
                dispatch(setSuggestedUser(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[userData])
}

export default GetSuggestedUser;