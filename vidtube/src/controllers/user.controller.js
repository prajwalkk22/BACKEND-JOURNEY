import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCLoudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefreshToken = async (userId) =>{
  try {
      const user = await user.findById(userId)
      // small check for user
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
  
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
  }

}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // Validation
    if ([fullname, username, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // File paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // Upload avatar
    const avatar = await uploadOnCLoudinary(avatarLocalPath);
    if (!avatar) throw new ApiError(500, "Failed to upload avatar");

    // Upload coverImage (optional)
    let coverImage = null;
    if (coverLocalPath) {
        coverImage = await uploadOnCLoudinary(coverLocalPath);
        if (!coverImage) throw new ApiError(500, "Failed to upload cover image");
    }

    // Create user
    try {
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        });
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering user");
        }
    
        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        console.log("User creation is failed")

        if(avatar){
            await deleteFromCloudinary(avatar.public_id)
        }

        if(coverImage){
            await deleteFromCloudinary(coverImage.public_id)
        }
        throw new ApiError(500, "Something went wrong while registering user and images were deleted");
    }
});

const loginUser = asyncHandler(async (req,res)=>{
    // get data from body
    const {emil,username,password} = req.body

    // validation
    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if(!user){
        throw new ApiError(400, "user is not found")
    }

    // validate password
   const isPasswordValid=  await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401, "Invalid credentials")
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
   const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,
       {user:loggedInUser,accessToken,refreshToken},
       "user logged in successfully"
    ))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401,"Refresh token is required")
    }

    try {
        const decodeToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodeToken?._id)

        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if(incommingRefreshToken !== User?.refreshToken){
            throw new ApiError(401,"Invalid refresh token")
        }

        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
        }

        const {accessToken,refreshToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("accessToken",refreshToken,options)
        .json(new ApiResponse(200,
            {user:loggedInUser,accessToken,newrefreshToken},
            "access token refreshed successfully"
         ));
    } catch (error) {
        throw new ApiError(500, "something went wrong while refreshing token");
    }

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
   req_user._id,
   {
    $set:{
        refreshToken: undefined,
    }
   },
   {new:true}
    )

    const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse200,{},"User logged out successfully")

})


export { 
    registerUser ,
    loginUser,
    refreshAccessToken,
    logoutUser
};
