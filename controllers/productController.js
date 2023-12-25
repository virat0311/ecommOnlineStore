import productModel from "../models/productModel.js"
import formidable from "express-formidable"
import fs from "fs"
import slugify from "slugify"
import categoryModel from "../models/categoryModel.js"
import Braintree from "braintree"
import dotenv from "dotenv"
import orderModels from "../models/orderModels.js"

dotenv.config();
//payment gateway
var gateway = new Braintree.BraintreeGateway({
  environment: Braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController=async(req,res)=>{
    try{
        const {name,slug,description,price,category,quantity,shipping}=req.fields
        const {photo}=req.files
        //validation
        switch(true){
                case !name:
                    return res.status(500).send({error:"name is required"})
                case !description:
                     return res.status(500).send({error:"description is required"})
                case !price:
                    return res.status(500).send({error:"price is required"})
                case !category:
                    return res.status(500).send({error:"category is required"})
                case !quantity:
                    return res.status(500).send({error:"quantity is required"})
                case !shipping:
                    return res.status(500).send({error:"shipping is required"})
                case photo && photo.size>=1000000:
                    return res.status(500).send({error:"photo is required and less than 1 mb"})
        }
        const products=await productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        products,
        });
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in creating prodcut"
        })
    }

}
//get al products controller
export const getProductController=async(req,res)=>{
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12) .sort({ createdAt: -1 });
        res.status(200).send({
          success: true,
          counTotal: products.length,
          message: "ALLProducts ",
          products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr in getting products",
          error: error.message,
        });
      }

}
export const getSingleProductController=async(req,res)=>{
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
          success: true,
          message: "Single Product Fetched",
          product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getitng single product",
          error,
        });
      }


}
export const productPhotoController=async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
          res.set("Content-type", product.photo.contentType);
          return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr while getting photo",
          error,
        });
      }

}//delte product
export const deleteProductController=async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
          success: true,
          message: "Product Deleted successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while deleting product",
          error,
        });
      }

}
//update product
export const updateProductController=async(req,res)=>{
    try {
        const { name, description, price, category, quantity, shipping } =
          req.fields;
        const  {photo}  = req.files;
        //validation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case photo && photo.size >= 1000000:
            return res
              .status(500)
              .send({ error: "photo is Required and should be less then 1mb" });
        }
    
        const products = await productModel.findByIdAndUpdate(
          req.params.pid,
          { ...req.fields, slug: slugify(name) },
          { new: true }
        );
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path);
          products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
          success: true,
          message: "Product Updated Successfully",
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in Updte product",
        });
      }

}
//filter products
export const productsFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "something went wrong in Filtering Products",
      error,
    });
  }
};
//count of all product
export const productsCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "some Error in product count",
      error,
      success: false,
    });
  }
};
//get by list based on page product
export const productListController = async (req, res) => {
  try {
    const perPage = 5;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
//search the product on homepage
export const searchProductsController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
//get similar products here
export const realtedProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};
//get product by categorylist
export const productsCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
//braintree payment token gateway
export const braintreeTokensController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//payment controller braintree
export const brainTreePaymentsController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModels({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};