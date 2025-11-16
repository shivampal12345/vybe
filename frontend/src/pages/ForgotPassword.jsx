import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { serverUrl } from '../App';


const ForgotPassword = () => {
    const[step,setStep] = useState(1);
    const[inputClicked,setInputClicked] = useState({
        email:false,
        otp:false,
        newPassword:false,
        confirmNewPassword:false
    });
    const[email,setEmail] = useState("");
    const[otp,setOpt]= useState("");
    const[newPassword,setNewPassword]=useState("");
    const[confirmPassword,setConfirmPassword]=useState("");
    const[loading,setLoading]= useState(false);
    const[err,setErr] = useState("");

    const handleStep1 = async ()=> {
        setLoading(true)
        setErr("")
        try {
            const result = await axios.post(`${serverUrl}/api/auth/sendOtp`,{email},{withCredentials:true})
            console.log(result.data);
            setStep(2)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error.response.data.message)
        }
    }

     const handleStep2 = async ()=> {
        setLoading(true)
        setErr("")
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verifyOtp`,{email,otp},{withCredentials:true})
            console.log(result.data);
            setStep(3)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error.response.data.message)
        }
    }

     const handleStep3 = async ()=> {
         if(newPassword !== confirmPassword) {
                return setErr("passwords do not match")
            }
        setErr("")
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/resetPassword`,{email,password:newPassword},
                {withCredentials:true});
            console.log(result.data);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error.response.data.message)
        }
    }

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col
    justify-center items-center'>
        {step ==1 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center
        items-center flex-col border-[#1a1f23]'>
            <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px]
                border-2 border-black' onClick={()=>setInputClicked({...inputClicked,email:true})}>
                    <label htmlFor="email" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white
                    text-[15px] ${inputClicked.email?"top-[-15px]":""}`}> Enter Your Email</label>
                        <input type="email" id='email' className='w-[100%] h-[100%] rounded-2xl px-[20px] 
                        outline-none border-0' required onChange={(e)=>setEmail(e.target.value)} value={email} />
                </div>
                {err && <p className='text-red-500'>{err}</p>}
                 <button className='w-[70%] px-[20px] py-[10px] bg-black text-white
                font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleStep1} disabled={loading}>
                    {loading?<ClipLoader size={30} color='white'/>:"Sent OTP"}
                </button>
        </div>}

        {step ==2 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center
        items-center flex-col border-[#1a1f23]'>
            <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px]
                border-2 border-black' onClick={()=>setInputClicked({...inputClicked,otp:true})}>
                    <label htmlFor="otp" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white
                    text-[15px] ${inputClicked.otp?"top-[-15px]":""}`}> Enter OTP</label>
                        <input type="text" id='otp' className='w-[100%] h-[100%] rounded-2xl px-[20px] 
                        outline-none border-0' required onChange={(e)=>setOpt(e.target.value)} value={otp} />
                </div>
                {err && <p className='text-red-500'>{err}</p>}
                 <button className='w-[70%] px-[20px] py-[10px] bg-black text-white
                font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleStep2} disabled={loading}>
                    {loading?<ClipLoader size={30} color='white'/>:"Submit"}
                </button>
        </div>}

        {step ==3 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center
        items-center flex-col border-[#1a1f23]'>
            <h2 className='text-[30px] font-semibold'>Reset Password</h2>
            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px]
                border-2 border-black' onClick={()=>setInputClicked({...inputClicked,otp:true})}>
                    <label htmlFor="newPassword" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white
                    text-[15px] ${inputClicked.otp?"top-[-15px]":""}`}> Enter New Password</label>
                        <input type="text" id='newPassword' className='w-[100%] h-[100%] rounded-2xl px-[20px] 
                        outline-none border-0' required onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} />
                </div>
                 <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px]
                border-2 border-black' onClick={()=>setInputClicked({...inputClicked,confirmPassword:true})}>
                    <label htmlFor="confirmPassword" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white
                    text-[15px] ${inputClicked.confirmNewPassword?"top-[-15px]":""}`}> Confirm New Password</label>
                        <input type="text" id='confirmPassword' className='w-[100%] h-[100%] rounded-2xl px-[20px] 
                        outline-none border-0' required onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} />
                </div>
                {err && <p className='text-red-500'>{err}</p>}
                 <button className='w-[70%] px-[20px] py-[10px] bg-black text-white
                font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleStep3} disabled={loading}>
                    {loading?<ClipLoader size={30} color='white'/>:"Reset Password"}
                </button>
        </div>}
        
    </div>
  )
}

export default ForgotPassword;