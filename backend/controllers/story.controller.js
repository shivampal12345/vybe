import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js"

export const uploadStory = async (req,res) => {
    try {
        const user = await User.findById(req.userId);
        if(user.story){
            await Story.findByIdAndDelete(user.story)
            user.story = null;
        }

        const {mediaType} = req.body
        
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)
        }else{
            return res.status(400).json({message:"Media is required"})
        }
        const story = await Story.create({
            author:req.userId,mediaType,media
        })
        user.story=story._id;
        await user.save();
        const populatedStory = await Story.findById(story._id).populate("author","name userName profileImage")
        .populate("viewers","name userName profileImage")

        return res.status(200).json(populatedStory);
    } catch (error) {
        res.status(500).json({message:`story upload error${error}`})
    }
}

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.userId; // ✅ Always use req.userId

    const story = await Story.findById(storyId);
    if (!story) return res.status(400).json({ message: "Story not found" });

    // ✅ Prevent author from being added as viewer
    if (story.author.toString() !== userId.toString()) {
      if (!story.viewers.some(id => id.toString() === userId.toString())) {
        story.viewers.push(userId);
        await story.save();
      }
    }

    const populatedStory = await Story.findById(storyId)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json(populatedStory);

  } catch (error) {
    return res.status(500).json({ message: `story view error: ${error.message}` });
  }
};



export const getStoryByUserName = async(req,res) => {
    try {
        const userName = req.params.userName
        const user = await User.findOne({userName})
        if(!user) {
            return res.status(400).json({message:"User not found"})
        }

        const story = await Story.find({
            author:user._id
        }).populate("viewers author")

        
     // If story exists in User model instead (user.story)
  if(!story && user.story) {
    story = await Story.findById(user.story)
      .populate("author viewers"); 
  }
         return res.status(200).json(story);
    } catch (error) {
         res.status(500).json({message:`getStory by UserName error${error}`})
    }
};

export const getAllStories = async(req,res) => {
    try {
        const currentUser = await User.findById(req.userId);
        const followingIds = currentUser.following;
        
        const stories = await Story.find({
            author:{$in:followingIds} 
        }).populate("viewers author").sort({createdAt:-1})

        return res.status(200).json(stories)

    } catch (error) {
          res.status(500).json({message:`get All Stories error${error}`})
    }
}

// export const fixStoryViewers = async (req, res) => {
//   try {
//     const stories = await Story.find({});

//     for (const s of stories) {
//       const authorId = s.author.toString();

//       // Remove the author if present in viewers
//       s.viewers = s.viewers.filter(v => v.toString() !== authorId);
//       await s.save();
//     }

//     return res.status(200).json({ message: " All stories cleaned successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: `Fix error: ${error.message}` });
//   }
// };(optional) 
