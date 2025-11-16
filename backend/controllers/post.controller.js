import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadPost = async(req,res) => {
    try {
        const {caption,mediaType} = req.body;
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)
        }else {
            return res.status(400).json({message:"Media is Required"})
        };

        const post = await Post.create({
            caption,media,mediaType,author:req.userId
        });
        const user = await User.findById(req.userId)
        user.posts.push(post._id);
        await user.save()
        const populatedPost = await Post.findById(post._id).populate("author","name userName profileImage");
        return res.status(201).json(populatedPost);
    } catch (error) {
        return res.status(500).json({message:`Upload post error ${error}`})
    }
};

export const getAllPosts = async(req,res) =>{
    try {
        const posts = await Post.find({}).populate("author","name userName profileImage")
        .populate("comments.author","name userName profileImage").sort({createdAt:-1});
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({message:`Get All posts error ${error}`})
    }
};

export const like = async(req,res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }

        const alreadyLiked = post.likes.some(id=>id.toString()==req.userId.toString());
        if(alreadyLiked){
            post.likes = post.likes.filter(id=>id.toString()!=req.userId.toString())
        }else {
            post.likes.push(req.userId)
            if(post.author._id!=req.userId){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:post.author._id,
                    type:"like",
                    post:post._id,
                    message:"Liked your Post"
                })
                const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver post")
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        }
        await post.save();
        await post.populate("author","name userName profileImage");
        io.emit("likedPost",{
            postId:post._id,
            likes:post.likes
        })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:`like Post Error ${error}`})
    }
};

export const comment = async(req,res) => {
    try {
        const {message} = req.body
        const postId = req.params.postId
        const post = await Post.findById(postId)
         if(!post){
            return res.status(400).json({message:"Post not found"})
        }
        post.comments.push({
            author:req.userId,
            message
        })
        if(post.author._id!=req.userId){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:post.author._id,
                    type:"comment",
                    post:post._id,
                    message:"commented your Post"
                })
                const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver post")
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }

           await post.save();
        const populatedPost = await Post.findById(post._id)
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");
       io.emit("commentedPost",{
            postId:post._id,
            comments:post.comments
        })
    return res.status(200).json(populatedPost);
    } catch (error) {
        return res.status(500).json({message:`comments Post Error ${error}`})
    }
};

export const saved = async(req, res) => {
    try {
        const postId = req.params.postId;
        
        // Add validation
        if (!postId) {
            return res.status(400).json({message: 'Post ID is required'});
        }
        
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
       
        const alreadySaved = user.saved.some(id => id.toString() === postId.toString());
        
        if(alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() !== postId.toString());
        } else {
            user.saved.push(postId);
        }
        
        await user.save();
         const populatedUser = await User.findById(req.userId).populate("saved");
        // await user.populate("saved");
        return res.status(200).json(populatedUser);
    } catch (error) {
        console.error('Save post error:', error); // Better error logging
        return res.status(500).json({message: `saved Post Error ${error.message}`});
    }
}

export const getMultiplePosts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !ids.length) {
      return res.status(400).json({ message: "No post IDs provided" });
    }

    // Fetch multiple posts by their IDs
    const posts = await Post.find({ _id: { $in: ids } })
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("getMultiplePosts error:", error);
    return res.status(500).json({ message: `getMultiplePosts Error: ${error.message}` });
  }
};
