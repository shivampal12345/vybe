import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from '../assets/dp.webp'

const Search = () => {
    const navigate= useNavigate();
    const [input, setInput] = useState("");  
    const dispatch = useDispatch();
    const {searchData} = useSelector(state=>state.user);

    const handleSearch = async () => {   
        if (!input.trim()) return;          

        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyword=${input}`);
            dispatch(setSearchData(result.data));
            console.log(result)
        } catch (error) {
            console.log(error);
        }
    };

    // Search every time input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 400); // 

        return () => clearTimeout(timer);
    }, [input]);

    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]'>

            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
                <MdOutlineKeyboardBackspace
                    className="text-white w-[25px] h-[25px] cursor-pointer"
                    onClick={() => navigate(`/`)}
                />
            </div>

            <div className='w-full h-[80px] flex items-center justify-center mt-[50px]'>
                <form onSubmit={(e)=>e.preventDefault()}
                    className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'>
                    <FiSearch className='w-[20px] h-[20px] text-white' />

                    <input
                        type="text"
                        placeholder='Search....'
                        className='w-full h-full outline-0 rounded-full px-[20px]
                        text-white text-[18px]'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                </form>
            </div>
            {input &&  searchData?.map((user)=>(
                <div key={user._id} className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center
                gap-[20px] px-[5px] hover:bg-gray-200' onClick={()=>navigate(`/profile/${user.userName}`)}>
                    <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer
                    overflow-hidden'>
                        <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>
                    <div className='text-black text-[18px] font-semibold'>
                        <div>{user.userName}</div>
                        <div className='text-[14px] text-gray-400'>{user.name}</div>
                    </div>
                </div>
            ))}
            
            {!input && <div className='text-[30px] text-gray-700 font-bold'>Search Here....</div>}
            
        </div>
    )
}

export default Search;
