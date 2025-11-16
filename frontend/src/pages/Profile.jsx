import axios from "axios";
import React, { useState, useEffect } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";

const Profile = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const [postType, setPostType] = useState("posts");
  const [savedPosts, setSavedPosts] = useState([]);

  // ✅ Fetch profile data
  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch saved posts when "Saved" tab is clicked
  const handleSavedPosts = async () => {
    try {
      if (!userData?.saved?.length) {
        setSavedPosts([]);
        return;
      }

      const ids = userData.saved.map((p) => p._id || p); // handles both object and id form

      const res = await axios.post(
        `${serverUrl}/api/post/getMultiple`,
        { ids },
        { withCredentials: true }
      );

      setSavedPosts(res.data);
    } catch (error) {
      console.error("Error loading saved posts:", error);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Run on mount and when username changes
  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);

  // Run when tab changes
  useEffect(() => {
    if (postType === "saved") {
      handleSavedPosts();
    }
  }, [postType, userData]);

  return (
    <div className="w-full min-h-screen bg-black">
      {/* ===== Header ===== */}
      <div className="text-white w-full h-[80px] flex justify-between items-center px-[30px]">
        <div onClick={() => navigate("/")}>
          <MdOutlineKeyboardBackspace className="text-white w-[25px] h-[25px] cursor-pointer" />
        </div>
        <div className="font-semibold text-[20px]">{profileData?.userName}</div>
        <div
          className="font-semibold cursor-pointer text-[20px] text-blue-500"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>

      {/* ===== Profile Info ===== */}
      <div className="w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
        <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            src={profileData?.profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-[22px] text-white">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">{profileData?.bio}</div>
        </div>
      </div>

      {/* ===== Stats (Posts / Followers / Following) ===== */}
      <div className="w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white">
        {/* Posts */}
        <div>
          <div className="text-white text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">Posts</div>
        </div>

        {/* Followers */}
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
              {profileData?.followers?.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden 
                     ${index !== 0 ? '-ml-6' : ''}`}
                      style={{ zIndex: index }}
                >
                  <img
                    src={user?.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers?.length || 0}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
            Followers
          </div>
        </div>

        {/* Following */}
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
              {profileData?.following?.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden  
                     ${index !== 0 ? '-ml-6' : ''}`}
                      style={{ zIndex: index }}
                >
                  <img
                    src={user?.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.following?.length || 0}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
            Following
          </div>
        </div>
      </div>

      {/* ===== Buttons ===== */}
      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]">
        {profileData?._id === userData?._id && (
          <button
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white
             cursor-pointer rounded-2xl"
            onClick={() => navigate("/editprofile")}
          >
            Edit profile
          </button>
        )}

        {profileData?._id !== userData?._id && (
          <>
            <FollowButton
              tailwind={
                "px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl"
              }
              targetUserId={profileData?._id}
              onFollowChange={handleProfile}
            />
            <button
              className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white
             cursor-pointer rounded-2xl" onClick={()=>{
              dispatch(setSelectedUser(profileData))
              navigate('/messageArea')
             }}
            >
              Message
            </button>
          </>
        )}
      </div>

      {/* ===== Posts Section ===== */}
      <div className="w-full min-h-[100vh] flex justify-center">
        <div
          className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px]
            bg-white relative gap-[20px] pt-[30px] pb-[100px]"
        >
          {/* Tabs */}
          {profileData?._id == userData?._id &&  <div
            className="w-[90%] max-w-[500px] h-[80px] bg-white rounded-full flex
           justify-center items-center gap-[10px]"
          >
            <div
              className={`${
                postType === "posts"
                  ? "bg-black shadow-2xl text-white shadow-black"
                  : ""
              } 
            w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold
            hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl`}
              onClick={() => setPostType("posts")}
            >
              Posts
            </div>

            <div
              className={`${
                postType === "saved"
                  ? "bg-black shadow-2xl text-white shadow-black"
                  : ""
              } 
            w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold
            hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl`}
              onClick={() => setPostType("saved")}
            >
              Saved
            </div>
          </div>}
         

          <Nav />
              {profileData?._id== userData?._id && <>

                {/* User Posts */}
          {postType === "posts" &&
            postData
              .filter((post) => post.author?._id === profileData?._id)
              .map((post, index) => <Post post={post} key={index} />)}

          {/* Saved Posts */}
          {postType === "saved" &&
            savedPosts.map((post, index) => <Post post={post} key={index} />)}
              </>}
           
           {profileData?._id != userData?._id && 
                postData.map((post,index)=>(
                  post.author?._id == profileData?._id && <Post post={post} key={index}/>
                ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
