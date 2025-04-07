import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
/*
    id string pk
  videoFile string
  thumbnail string
  owner ObjectId users
  title string
  description string
  duration number
  views number
  isPublished boolean
  createdAt Date
  updateAt Date
*/
const videoSchema = new Schema({
    videoFile:{
        type:String,//cloudinary url
        required:true
    },
    thumbnail:{
        type:String,//cloudinary url
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)



export const Video = mongoose.model('Video',videoSchema) 