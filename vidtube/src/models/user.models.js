
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
    import bcrypt from "bcrypt"
    import jwt from "jsonwebtoken"
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

  userSchema.pre("save",async function(next){
    if(!this.modified("password")) return next()

    this.password = bcrypt.hash(this.password,10)
    next()
  })

  userSchema.methods.isPasswordCorrect = async function(password){
    return bcrypt.compare(password,this.password)
  }

  userSchema.methods.generateAccessToken = function(){
    // short lived access token
   return  jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.process.env.ACCESS_TOKEN_EXPIRY }
    );
  }

  userSchema.methods.generateRefreshToken = function(){
    // short lived refresh token
   return  jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.process.env.REFRESH_TOKEN_EXPIRY }
    );
  }

  export const User = mongoose.model("User",userSchema)