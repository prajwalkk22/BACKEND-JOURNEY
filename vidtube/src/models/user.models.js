
/*id string pk
  watchHistory ObjectId[] videos
  username string
  email string
  fullName  string
  avatar string
  coverImage  string
  password string
  refreshToken string
  createdAt Date
  updateAt Data
  */

  import mongoose,{Schema, SchemaType} from "mongoose";

  const userSchema = new Schema(
    {
        username:String,
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            equired:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            equired:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
        ],
        password:{
            type:String,
            required:[true,"password is required"]
        },
        refreshToken:{
            type:String
        }

    },
    {timestamps:true}
  )

  export const User = mongoose.model("User",userSchema)