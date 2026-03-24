import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import "dotenv/config";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.json({
      success: true,
      message:
        "Signup Successful",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({success:false,message:"Missing Details"});
    }
    try{
        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.json({success:false,message:"User Doesn't Exists"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Incorrect Password"});
        }
        const token=generateToken(user);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({success:true});
    }catch(error){
        return res.json({success:false,messgae:error.message});
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ loggedIn: false });
    }

    return res.json({
      loggedIn: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
      },
    });

  } catch (error) {
    console.log(error);
    return res.json({ loggedIn: false });
  }
};