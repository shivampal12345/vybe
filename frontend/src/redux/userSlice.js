import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUser:null,
        profileData:null,
        following:[],
        searchData:null,
        notificationData:null
    },
    reducers:{
        setUserData:(state,action) => {
            state.userData = action.payload
        },
        setSuggestedUser:(state,action) => {
            state.suggestedUser = action.payload
        },
        setProfileData:(state,action) => {
            state.profileData = action.payload
        },
         setSearchData:(state,action) => {
            state.searchData = action.payload
        },
         setNotificationData:(state,action) => {
            state.notificationData = action.payload
        },
        setFollowing:(state,action) => {
            state.following = action.payload
        },
        toggleFollow:(state,action) => {
            const targetUserId = action.payload
            if(state.following.includes(targetUserId)) {
                state.following = state.following.filter(id=>id!=targetUserId)
            }else {
                state.following.push(targetUserId)
            }
        },
    }
});

export const {setUserData,setSuggestedUser,setProfileData,toggleFollow,setFollowing,setSearchData,setNotificationData} = userSlice.actions;
export default userSlice.reducer;