import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from "../components/VideoPlayer";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";

function StoryCard({storyData}) {
  const navigate = useNavigate();
  const{userData} = useSelector(state=>state.user)
  const[showViewers,setShowViewers] = useState(false);
  const[progress,setProgress] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
        setProgress(prev=>{
            if(prev>=100){
                clearInterval(interval)
                navigate('/')
                return 100
            }
            return prev+1;
        })
    },150)

    return ()=> clearInterval(interval);
  },[navigate]);

  if (!storyData) return null; 


  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      <div className="flex items-center gap-[10px] absolute top-[30px] px-[10px]">
         <MdOutlineKeyboardBackspace className="text-white w-[25px] h-[25px] cursor-pointer"
                              onClick={()=>navigate(`/`)} />
        <div className="w-[30px] h-[30px] md:h-[40px] border-2 border-black rounded-full overflow-hidden md:w-[40px]">
           
          <img
            src={storyData?.author?.profileImage || dp}
            className="w-full object-cover"
          />
        </div>
        <div className="w-[150px] text-white font-semibold truncate">
          {storyData?.author?.userName || "Unknown User"}
        </div>
      </div>
      {/* Progress Bar */}
       <div className="absolute top-[10px] left-0 w-full h-[5px] bg-gray-900">
        <div className="w-[200px] h-full bg-white transition-all duration-200 ease-linear" style={{ width: `${progress}%` }}></div>
      </div>
      {!showViewers && <>  <div className="w-full h-[90vh] flex items-center justify-center">
        {storyData.mediaType == "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={storyData.media}
              alt=""
              className="w-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {storyData.mediaType == "video" && (
          <div
            className="w-[80%] flex flex-col items-center justify-center
            mt-[5vh]"
          >
            <VideoPlayer media={storyData?.media} />
          </div>
        )}
      </div>
      <div className="absolute top-[10px] left-0 w-full h-[5px] bg-gray-900">
        <div className="w-[200px] h-full bg-white transition-all duration-200 ease-linear" style={{ width: `${progress}%` }}></div>
      </div>
      {storyData?.author.userName==userData?.userName && <div className="w-full h-[70px] bottom-0 p-2 left-0 text-white
      flex items-center gap-[10px]" onClick={()=>setShowViewers(true)}>
        <div className="text-white flex items-center gap-[8px]"><FaEye />{storyData.viewers.length}</div>
        <div className="flex relative">
                      {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                        <div
                          key={index}
                          className={`w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden  
                             ${index !== 0 ? '-ml-6' : ''}`}
                              style={{ zIndex: index }}
                        >
                          <img
                            src={viewer?.profileImage || dp}
                            alt=""
                            className="w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
        </div>}</>}

        {showViewers && <>
        <div className="w-full h-[20vh] flex items-center justify-center mt-[100px] py-[30px] overflow-hidden cursor-pointer" 
        onClick={()=>setShowViewers(false)}>
        {storyData.mediaType == "image" && (
          <div className="h-[90%] flex items-center justify-center">
            <img
              src={storyData.media}
              alt=""
              className="h-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {storyData.mediaType == "video" && (
          <div
            className="h-full flex flex-col items-center justify-center
            mt-[5vh]"
          >
            <VideoPlayer media={storyData.media} />
          </div>
        )}
      </div>
      <div className="w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]">
        <div className="text-white flex items-center gap-[10px]"><FaEye /><span>{storyData?.viewers?.length}</span>
        <span>Viewers</span></div>

        <div className="w-full max-h-full flex flex-col gap-[20px] overflow-auto pt-[20px]">
          {storyData?.viewers.map((viewer,index)=>(
            <div className="w-full flex items-center gap-[20px]" key={index}>
              <div className="w-[30px] h-[30px] md:h-[40px] border-2 border-black rounded-full overflow-hidden md:w-[40px]">
           
          <img
            src={viewer?.profileImage || dp}
            className="w-full object-cover"
          />
        </div>
        <div className="w-[150px] text-white font-semibold truncate">
          {viewer?.userName || "Unknown User"}
        </div>
            </div>
          ))}
        </div>

      </div>
        </>}
      
    </div>
  );
}

export default StoryCard;
