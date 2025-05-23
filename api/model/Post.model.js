import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,  
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1351443977/vector/megaphone-with-new-blog-post-speech-bubble-banner-loudspeaker-label-for-business-marketing.jpg?s=612x612&w=0&k=20&c=sUqjhCZGosQB80uQI17FTCrSHx5FBmXAOhvmjNoPh5U=",

    },
    category:{
        type:String,
        default:"uncategorized",
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    likes:{
        type:Array,
        default:[],
    },
    comments:{
        type:Array,
        default:[],
    },
},{timestamps:true});

const Post = mongoose.model("Post", postSchema);
export default Post;