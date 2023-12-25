import { compare } from "bcrypt";
import  {comaprepassword, hashPassword}  from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import orderModels from "../models/orderModels.js";

export const registerController=async(req,res)=>{
try{
    const {name,email,password,phone,address,question}=req.body
    //validations
    if(!name){
        return res.send({message:'name is required'});
    }
    if(!email){
        return res.send({message:'email is required'});
    }
    if(!password){
        return res.send({message:'password is required'});
    }
    if(!phone){
        return res.send({message:'phone is required'});
    }
    if(!address){
        return res.send({message:'adress is required'});
    }
    if(!question){
        return res.send({message:'question is required'});
    }
    //check user
    const existingUser=await userModel.findOne({email})
    //existing user
    if(existingUser){
        return res.status(200).send({
            success:true,
            message:'already registered, please login',
        })
    }
    //register user
    const hashedPassword=await hashPassword(password);
    //save
    const user= new userModel({name,email,phone,address,password:hashedPassword,question});
    await user.save();
    res.status(201).send({
        success:true,
        message:'User register successfully',
        user,
    });
 
}catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in registration',
        error
    });
}
};
export const loginController=async(req,res)=>{
 try{
     const{email,password}=req.body;
     //validations
     if(!email || !password){
        return res.status(404).send({
            success:false,
            message:"Invalid login or Password"
        })
     }
     //chcek user 
     const user=await userModel.findOne({email});
     if(!user){
        return res.status(404).send({
            success:false,
            message:"email not found",
            error
        })
     }
     const match=await comaprepassword(password,user.password)
     if(!match){
        return res.status(200).send({
            success:false,
            message:"Invalid password"
        })
     }
     //token
     const token=await jwt.sign({_id:user.id},process.env.JWT_SECRET,{
        expiresIn:"7d",
     })
     res.status(200).send({
        success:true,
        message:"login successfully",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role, 

        },token,
     })
 }catch(error){
   console.log(error)
   res.status(500).send({
    success:false,
    message:'error in login',
    error
   })
 }
};
//forgot password
export const forgetPassController=async(req,res)=>{
    try{
     const {email,question,newPassword}=req.body;
     if(!email){
        res.status(400).send({message:"email not provided"});
     }
     if(!question){
        res.status(400).send({message:"question  required"});
     }
     if(!newPassword){
        res.status(400).send({message:"newPassword required"});
     }
     //check
     const user=await userModel.findOne({email,question});
     //validation
     if(!user){ return res.status(404).send({success:false,message:"wrong email or answer given"})}
     const hased=await hashPassword(newPassword);
     await userModel.findByIdAndUpdate(user._id,{password:hased});
     res.status(200).send({
        success:true,
        message:"passwrod reset",

     })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"something went wrong",
            error
        })

    }

};
//test controllers
export const testController=(req,res)=>{
    console.log("protected routes");
    res.send("protected route worked");
}
//update profile controller route of users
export const updatProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };
  //orders get
export const getOrderController = async (req, res) => {
    try {
      const orders = await orderModels
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  export const getAlOrdersController = async (req, res) => {
    try {
      const orders = await orderModels
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  //order status for admin
  export const ordersStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModels.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };
  //get all users
  export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }

  }
