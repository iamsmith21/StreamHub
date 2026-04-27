import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


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

export { regiseterUser }