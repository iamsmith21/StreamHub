import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const regiseterUser = asyncHandler(async (req, res) => {
    // get the user data from the frontend
    //validation 
    //check if user already exists (typically using email/ username)
    // check for images /avatar --> upload them to cloudinary
    //create user object - to send to DB -> create entry in DB
    //remove the password, refreshToken fields from response. to send it to frontend
    //if no res. -> return res else error

    console.log(req.body)
    const { username, fullname, email, password } = req.body

    // if (fullname === "") {
    //     throw new ApiError(400, "Full Name is Required!")
    // }

    if
        (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are Required.")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exisits.")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar not found!")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        password,
        email
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User Created Successfully"))
})

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user =await User.findById(userId)
        const accessToken =user.generateAccessToken()
        const refreshToken =user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({
            validateBeforeSave: false
        })

        return { accessToken, refreshToken }
    }
    catch (err) {
        throw new ApiError(500, "Something went wrong generating the Tokens.")
    }
}

const loginUser = asyncHandler( async(req,res) => {
    //req.body -> data
    //username or email and password.
    //find the user
    //pass check
    //geneerate access and refersh token and
    //send cookies

    const {username, email, password} = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or Email is Required.")
    }

    const user = await User.findOne({
        $or : [{username}, {email}]

    })

    if (!user) {
        throw new ApiError(404, "User does not exist.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //for cookies

    const options = {
        httpOnly: true, //frontend cannot modify cookies only server can
        secure:true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully.")
    )
})

const logoutUser = asyncHandler( async(req,res) => {
    //remove all the tokens for the user to log out
    //BUT how to get the user
    //we added the middleware in the user.routes to get the user info
    await User.findByIdAndUpdate(req.user._id), {
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out."))

})

const refreshAccessToken = asyncHandler( async(req,res) => {
    //get the refresh token from cookies
    //verify the refresh token
    //generate new access token and refresh token
    //update the refresh token in DB
    //send the new access token and refresh token in cookies

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized! Refresh Token is required.")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id)
        
        if (!user) {
            throw new ApiError(404, "User not found.")
        }
    
        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized! Invalid Refresh Token.")
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(200, {
                accessToken, newRefreshToken
            }, "Access Token refreshed successfully.")
        )
    } catch (error) {
        throw new ApiError(401, "Unauthorized! Invalid Refresh Token.")
    }

}
)
    

export { regiseterUser, loginUser, logoutUser, refreshAccessToken }