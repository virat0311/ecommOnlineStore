import  express  from "express";
import {registerController,loginController,testController, forgetPassController, updatProfileController, getOrderController, getAlOrdersController, ordersStatusController, getAllUsers} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router=express.Router();

//register the routes
//mthod:post
router.post('/Register',registerController);
//login|| post
router.post('/login',loginController);
//forgot password
router.post("/forget-Pass",forgetPassController)
//test routes|| get method
router.get('/test',requireSignIn,isAdmin,testController);
//protectd user route
router.get('/userauth',requireSignIn,(req,res)=>{res.status(200).send({ok:true});
});
//protected admin route
router.get('/adminauth',requireSignIn,isAdmin,(req,res)=>{res.status(200).send({ok:true});//isAdmin    before i pasted
});
//update profile if user wants

router.put("/profile", requireSignIn, updatProfileController);
//order route to get data from order to user
router.get("/orders", requireSignIn, getOrderController);
//order route to get data from order to user
router.get("/all-orders", requireSignIn, getAlOrdersController);
// order status update
router.put(
    "/order-status/:orderId",requireSignIn, isAdmin,ordersStatusController);
// get all users data
router.get("/all-users",requireSignIn,isAdmin,getAllUsers);

export default router;
