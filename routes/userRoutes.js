const express=require('express');


const authMiddleware=require('../middlewares/authMiddleware');
const {loginController,registerController,authController}=require('../controllers/userCtrl.js')

const router=express.Router();


router.post('/login',loginController);

router.post('/register', registerController);
router.post('/getUserData',authMiddleware,authController)


module.exports=router;