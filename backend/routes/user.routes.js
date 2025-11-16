import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { editProfile, follow, followingList, getAllNotification, getCurrentUser, getProfile, markAsRead, search, suggestedUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get("/current",isAuth,getCurrentUser);
userRouter.get('/suggested',isAuth,suggestedUser);
userRouter.get('/getProfile/:userName',isAuth,getProfile);
userRouter.get('/follow/:targetUserId',isAuth,follow);
userRouter.get('/followingList',isAuth,followingList);
userRouter.get('/search',search);
userRouter.get('/getAllNotification',isAuth,getAllNotification);
userRouter.post('/markAsRead',isAuth,markAsRead);
userRouter.post('/editProfile',isAuth,upload.single("profileImage"),editProfile);

export default userRouter;