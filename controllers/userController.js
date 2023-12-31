const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');




const getAllUsers = async(req, res)=>{
    //REQ.USER COMES FROM THE AUTHENTICATION MIDDLEWARE 
    console.log(req.user)
    //FIND THE USERS BASED ON ROLE
    const users = await User.find({role:'user'}).select('-password');

    res.status(StatusCodes.OK).json({users});

}


const getSingleUser= async(req, res)=>{
     //WE FIND USE BY ID BASED ON REQ PARAMS 
    const user = await User.findOne({_id:req.params.id}).select('-password');
    
    //MAKES SURE THERE IS AN USER
    if(!user){
        throw new CustomError.NotFoundError('User not found');
    }

    //REQ.USER RETRIEVE THE USER THAT IS LOGGED IN AND USE_ID RETURN THE ID OF THE USER WE ARE LOOKING FOR 
    //THIS FUNCTION COMES FROM UTILS
    checkPermissions(req.user, user._id);
    
    res.status(StatusCodes.OK).json({user});
}

//WE ARE GETTING THE USER FROM THE AUTHENTICATION MIDDLEWARE
const showCurrentUser = async(req, res)=>{
    res.status(StatusCodes.OK).json({user:req.user});
}


const updateUserPassWord = async(req, res)=>{

    //WE GET OLD PASSWORD AND NEW PASSWORD FROM REQ INPUT(USER INPUT);
    const {oldPassWord, newPassword} = req.body;

    //MAKE SURE THE PASSWORD AND OLD PASSWORD ARE PROVIDED BY THE USER
    if(!oldPassWord || !newPassword){
        throw new CustomError.BadRequestError('Please provide both values old and new password');
    }
    
    //GETS USER BY ID
    const user = await User.findOne({ _id: req.user.userId });
    console.log(user);

    //MAKES SURE THE NEW PASSWORD IS NOT EQUAL TO THE OLD PASSWORD
    const isPasswordCorrect = await user.comparePassword(oldPassWord);
    if(!isPasswordCorrect){
      throw new CustomError.UnauthenticatedError('Invalid Credential. New password can not be equal to new password')
    }

    //SET THE CURRENT PASSWORD EQUAL TO THE NEW ONE
    user.password = newPassword;

    //SAVE CHANGES MADE TO THE USER 
    await user.save();

    //POSTMAN RESPONSE 
    res.status(StatusCodes.OK).json({msg:'Password was updated'});
 
}


//UPDATE USER WITH FIND ONE AND UPDATE
// const updateUser = async(req, res)=>{

//     const {name,email} = req.body;

//     if(!name || !email){
//         throw new CustomError.BadRequestError('name or user are not present');
//     }

//     const user = await User.findOneAndUpdate({ _id: req.user.userId},{email,name},{new:true, runValidators:true});
    
//     const tokenUser = createTokenUser(user);

//     attachCookiesToResponse({res,user:tokenUser});
// }

//
const updateUser = async(req, res)=>{

    //GETS EMAIL AND NAME FROM REQ.BODY
    const {name,email} = req.body;

    if(!name || !email){
        throw new CustomError.BadRequestError('name or user are not present');
    }

    //WE ARE GETTING THE ID FROM THE TOKEN NOT FROM A PARAM 
    const user = await User.findOne({ _id: req.user.userId});

    user.name = name;
    user.email = email;

    //SAVE THE CHANGES 
    await user.save();
    
    //EVERY TIME we use save we hash the password again
    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({res,user:tokenUser});
    
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassWord
}


