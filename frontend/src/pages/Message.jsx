import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../components/OnlineUsers";
import dp from "../assets/dp.webp";
import { setSelectedUser } from "../redux/messageSlice";

function Message() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUser, selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  // console.log("online user from redux",onlineUsers)

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[20px]">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[10px]">
        <MdOutlineKeyboardBackspace
          className="text-white w-[25px] h-[25px] cursor-pointer lg:hidden"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>
      </div>


     <div className="w-full h-full overflow-auto flex flex-col gap-[20px]">
  {prevChatUser
    ?.filter((user) => user._id !== userData._id)   // remove yourself
    .map((user, index) => (
      <div
        className="text-white cursor-pointer w-full flex items-center gap-[10px]"
        key={index}
        onClick={() => {
          dispatch(setSelectedUser(user));
          navigate("/messageArea");
        }}
      >
        {onlineUsers?.includes(user._id) ? (
          <OnlineUsers user={user} />
        ) : (
          <div className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={user.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col">
          <div className="text-white text-[18px] font-semibold">
            {user.userName}
          </div>

          {onlineUsers?.includes(user._id) && (
            <div className="text-blue-500 text-[15px]">Active Now</div>
          )}
        </div>
      </div>
    ))}
</div>

    </div>
  );
}

export default Message;
