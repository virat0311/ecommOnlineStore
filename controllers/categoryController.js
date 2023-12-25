import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController=async(req,res)=>{
    try{
        const {name}=req.body
        if(!name){
            return res.status(401).send({message:"name is not recieved"})
        }
        const existingCategory=await categoryModel.findOne({name})
        if(existingCategory){
            return res. status(200). send ({
                success:true,
                message:'Category Already Exisits',
            })
        }
        const category=await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:"new category created",
            category
        })


    }catch(error){
     console.log(error);
     res.status(500).send({
        success:false,
        error,
        message:"error came in category"
     })
    }

}
//update catorgry controller
export const updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params;
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"category updated successfully",
            category
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error in update categorycontroller",

        })
    }

}
//get all category controller
export const categoryController=async(req,res)=>{
    try{
        const category=await categoryModel.find()
        res.status(200).send({
            success:true,
            message:"all category list",
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in get category chk codes"
        })
    }
}
//single category controllers
export const singleCategoryController=async(req,res)=>{
    try{
        const {slug}=req.params
        const category=await categoryModel.findOne({slug})
        res.status(200).send({
            success:true,
            message:"single category",
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in singlecategory conroller"
        })
    }

}
//delete category controller
export const deleteCategoryController=async(req,res)=>{
    try{
        const {id}=req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:'category deleted successfully',
        })
    }catch(error){
        console.log(error)
        res.status(500).send({

        })

    }
}