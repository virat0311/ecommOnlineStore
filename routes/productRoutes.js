import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { brainTreePaymentsController, braintreeTokensController, createProductController, deleteProductController, getProductController, getSingleProductController, productListController, productPhotoController, productsCategoryController, productsCountController, productsFilterController, realtedProductsController, searchProductsController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router=express.Router();

//routes
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController);
//update product
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);
//get all product
router.get("/get-product",getProductController)
//get single
router.get("/get-product/:slug", getSingleProductController);
//get photo ej
router.get("/product-photo/:pid", productPhotoController);
//delete rproduct wh
router.delete("/delete-product/:pid", deleteProductController);
//filter product y
router.post("/product-filters",productsFilterController);
//product count her
router.get("/product-count", productsCountController);
//product per page here
router.get("/product-list/:page", productListController);
//search product route
router.get("/search/:keyword", searchProductsController);
//similar product route
router.get("/related-product/:pid/:cid", realtedProductsController);
//category wise product list
router.get("/product-category/:slug", productsCategoryController);
//payment gateways
//token here
router.get('/braintree/token',braintreeTokensController);
//payment for customer

router.post("/braintree/payment", requireSignIn, brainTreePaymentsController);
export default router;