import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    
    // Steps to perform to register user:-
    // get user deatils from frontend
    // validation - not empty
    // check if user already exist: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token feild from response
    // check for user creation
    // return res (response)


    const {fullName, email, username, password } = req.body
    console.log("email:", email);

    // if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    // } (or)

    //some method: Determines whether the specified callback function returns true for any element of an array. 
    if([fullName, email, username, password].some((feild) => 
        field?.trim() === ""))
    {
        throw new ApiError(400, "All feilds are required")
    }


    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // localfilepath return by multer as avatarLocalPath
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // mongodb automatically add _id to each entry in database.
    const createdUser = await User.findById(user._id).select("-password -refreshToken") //.select use to select specific element otherwise bydefault all are selected.

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export { 
    registerUser,
}