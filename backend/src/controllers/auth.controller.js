import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import BlacklistToken from "../models/blacklist.model.js";
/**
 * @name registerUSerController
 * @description register a new user expect username , email and password in the request
 * @access PUBLIC
 */
async function registerUserController(req , res){
    const {username , email , password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please Provide Full Credentials"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{username} , {email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"Account already exists with this particular Username OR Email"
        })
    }


    const hash = await bcrypt.hash(password , 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {id:user._id , username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user , expects email and password in the request body 
 * @access public
 */
async function loginUserController(req , res){

    const {email , password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password , user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invaild Email Or Password"
        })
    }

    const token = jwt.sign(
        {id:user._id , username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token" , token)
    res.status(200).json({
        message:"User Logged In Successfully!",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req , res){
    const token = req.cookies.token
    
    if(token){
        await BlacklistToken.create({
            token
        })

        res.clearCookie("token")
        res.status(200).json({
            message:"User logged out successfully"
        })
    }

    
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */
async function getMeController(req , res){

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


export default {registerUserController , loginUserController , logoutUserController , getMeController}