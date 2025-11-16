import { createSlice } from "@reduxjs/toolkit"

const messageSlice = createSlice({
    name:"message",
    initialState:{
        selectedUser:null,
        messages:[],
        prevChatUser:null
    },
    reducers:{
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload
        },
        setMessages:(state,action) => {
            state.messages = action.payload
        },
        setPrevChatUser:(state,action)=> {
            state.prevChatUser = action.payload
        }
    }
});

export const {setSelectedUser,setMessages,setPrevChatUser} = messageSlice.actions;
export default messageSlice.reducer;