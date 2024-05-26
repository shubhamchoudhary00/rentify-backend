const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
    userId:{
        type:String,
    },
    
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
    },
    
    photoUrl:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    color:{
        type:String,
    },
    likes:[{
        user:{
            type:mongoose.Schema.ObjectId
        },
    }],
    video:{
        type:String,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    },
    totalLikes:{
        type:Number,
        default:0
    }
},{timestamps:true})

const postModel=mongoose.model('posts',PostSchema);

module.exports=postModel;