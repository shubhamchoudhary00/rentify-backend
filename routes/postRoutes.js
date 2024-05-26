const express=require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for file upload
const upload = multer({ storage: storage });

const {uploadPhotoUrl,uploadVideoUrl,postController,videoController,
    getDeletePostController,descriptionController,getPostController,
    updateLikes,
    sendMail}=require('../controllers/postCtrl.js')
const authMiddleware=require('../middlewares/authMiddleware.js');
const router=express.Router()


router.post('/Url', upload.single('fieldname'), uploadPhotoUrl);

router.post('/video',authMiddleware,videoController)

router.post('/videoUrl', upload.single('fieldname'), uploadVideoUrl);

router.post('/post',authMiddleware,postController)
router.post('/getpost',authMiddleware,getPostController)

router.post('/description',authMiddleware,descriptionController)

router.post('/deletepost',getDeletePostController)
router.post('/updateLikes',updateLikes)
router.post('/sendMail',sendMail)

module.exports=router