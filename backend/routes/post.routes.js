import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { comment, getAllPosts, like, saved, uploadPost,getMultiplePosts } from '../controllers/post.controller.js';


const postRouter = express.Router();

postRouter.post('/upload',isAuth,upload.single("media"),uploadPost);
postRouter.get('/getAll',isAuth,getAllPosts);
postRouter.get('/like/:postId',isAuth,like);
postRouter.get('/saved/:postId',isAuth,saved);
postRouter.post('/comment/:postId',isAuth,comment);
postRouter.post('/getMultiple', isAuth, getMultiplePosts);

export default postRouter;
