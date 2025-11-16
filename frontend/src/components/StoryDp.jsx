import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

const StoryDp = ({ profileImage, userName, story }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (!story || !story.viewers || !userData?._id) {
      setViewed(false);
      return;
    }

    const isViewed = story.viewers.some((viewer) => {
      const viewerId = viewer?._id ?? viewer; // support both populated + ObjectId array
      return viewerId?.toString() === userData._id.toString();
    });

    setViewed(isViewed);
  }, [story, userData]);

  const handleViewers = async () => {
    if (!story?._id) return;

    try {
      await axios.post(
        `${serverUrl}/api/story/view/${story._id}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else {
      handleViewers();
      navigate(`/story/${userName === "Your Story" ? userData.userName : userName}`);
    }
  };

  return (
    <div className="flex flex-col w-[80px]">
      <div
        className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative cursor-pointer
          ${
            !story
              ? ""
              : !viewed
              ? "bg-gradient-to-b from-blue-500 to-blue-950"
              : "bg-gradient-to-r from-gray-500 to-black-800"
          }`}
        onClick={handleClick}
      >
        <div className="w-[70px] h-[70px] border-2 border-black rounded-full overflow-hidden relative">
          <img src={profileImage || dp} alt="" className="w-full h-full object-cover" />

          {!story && userName === "Your Story" && (
            <FiPlusCircle
              className="text-black absolute bottom-[8px] right-[10px] bg-white rounded-full w-[22px] h-[22px]"
            />
          )}
        </div>
      </div>

      <div className="text-[14px] text-center truncate w-full text-white">{userName}</div>
    </div>
  );
};

export default StoryDp;
