const userModel=require('../models/userModel.js')
const postModel=require('../models/postModel.js')
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, getStorage } = require('firebase/storage');
const firebase=require('../firebase')
const nodemailer=require('nodemailer')
const { ref, uploadBytesResumable } = require('firebase/storage');
var serviceAccount = require("../rentify-73df8-firebase-adminsdk-nyo4e-b34a60177d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://rentify-73df8.appspot.com',
});


const storage = getStorage(firebase);
const uploadPhotoUrl = async (req, res) => {
  console.log(req.file)
  try {
    const photoBuffer = req.file.buffer; // Access the uploaded image data as a buffer


    if (!photoBuffer) {
      return res.status(400).json({
        success: false,
        message: 'No photo data provided in the request.',
      });
    }

    const storageRef = ref(storage, `images/`+req.file.originalname);
      const uploadTask = uploadBytesResumable(storageRef, photoBuffer);

      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        console.log(error)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if(downloadURL){
            return res.status(200).json({success:true,message:'File Uploaded',data:downloadURL})
          }
          console.log('File available at', downloadURL);
        });
      }
    );

   
  } catch (error) {
    console.error('Error during file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during file upload',
      error: error.message,
    });
  }
};
const uploadVideoUrl = async (req, res) => {
  console.log(req.file)
  try {
    const photoBuffer = req.file.buffer; // Access the uploaded image data as a buffer


    if (!photoBuffer) {
      return res.status(400).json({
        success: false,
        message: 'No photo data provided in the request.',
      });
    }

    const storageRef = ref(storage, `videos/`+req.file.originalname);
      const uploadTask = uploadBytesResumable(storageRef, photoBuffer);

      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        console.log(error)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if(downloadURL){
            return res.status(200).json({success:true,message:'File Uploaded',data:downloadURL})
          }
          console.log('File available at', downloadURL);
        });
      }
    );

   
  } catch (error) {
    // console.error('Error during file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during file upload',
      error: error.message,
    });
  }
};

// Example controller using Firebase Admin SDK for Firestore
const photoController = async (req, res) => {
  console.log(req.body)
  try {
    const { userId, photo } = req.body;
    const user = await userModel.findById(userId );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Error occurred',
      });
    }
    user.photoUrl = photo;
    // Save the user document with the updated photoUrl
    const college=await collegeModel.findOne({userId:user._id});
    if (college) {
      college.photoUrl = photo;
    
      await college.save();
    
      const posts = await postModel.find({ userId: user._id });
    
      if (posts) {
        for (const post of posts) {
          post.photoUrl = photo;
          await post.save();
        }
      }
    }
    
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Photo URL updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};


const postController=async(req,res)=>{
  

    try{
      const post=await postModel({...req.body});
      const image=req.body.image;
      if(!image){
        return res.status(400).json({success:false,message:'Not an image'})
      }
      const userId=req.body.userId;
      const user=await userModel.findOne({_id:userId});
      if(!user){
        return res.status(400).json({success:false,message:'User not found'});
      }
      post.firstName=user.firstName;
      post.lastName=user.lastName;
      post.email=user.email;
      post.photoUrl=user.photoUrl;
      post.image=image;
  
      await post.save();
      return res.status(200).json({success:true,message:'Post Uploaded successfully'})
  
    }catch(error){
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' }); 
    }
  }
  
  const videoController=async(req,res)=>{
    
    try{
      const post=await postModel({...req.body});
      const userId=req.body.userId;
      const user=await userModel.findOne({_id:userId});
      if(!user){
        return res.status(400).json({success:false,message:'User not found'});
      }
      post.name=user.name;
      post.email=user.email;
      post.photoUrl=user.photoUrl;
  
      await post.save();
      return res.status(200).json({success:true,message:'Post Uploaded successfully'})
  
    }catch(error){
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' }); 
    }
  }
  
  const descriptionController=async(req,res)=>{
  
    try{
      const post=await postModel({...req.body});
      const userId=req.body.userId;
      const user=await userModel.findOne({_id:userId});
      if(!user){
        return res.status(400).json({success:false,message:'User not found'});
      }
      post.name=user.name;
      post.email=user.email;
      post.photoUrl=user.photoUrl;
  
      await post.save();
      return res.status(200).json({success:true,message:'Post Uploaded successfully'})
  
    }catch(error){
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' }); 
    }
  }

  const getPostController = async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await userModel.findOne({ _id: userId });
  
      // console.log('User Data:', user);
      if(!user){
        return res.status(400).json({success:false,message:'User not found'})
      }
  
      // Find posts where userId matches user.follow.collegeId or user._id
      const posts = await postModel.find({}).sort({ createdAt: -1 });
  
      // console.log('Posts:', posts);
  
      if (!posts) {
        return res.status(400).json({ success: false, message: 'No posts' });
      }
      return res.status(200).json({ success: true, message: 'Posts received', data: posts });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };



  
const getDeletePostController = async (req, res) => {
    try {
      const posts = req.body.postId;
      const collegeId=req.body.collegeId;
      const user=await userModel.findOne({_id:collegeId});
      console.log(user);
      
      
  
      const post = await postModel.findOne({ _id: posts });
  
      if (!post) {
        return res.status(400).json({ success: false, message: 'No posts' });
      }

      
    
   
      // Await the deletion of the post
      await post.deleteOne();
  
      return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };

  const updateLikes = async (req, res) => {
    const { postId, userId } = req.body;
    try {
        const post = await postModel.findOne({ _id: postId });
        if (!post) {
            return res.status(404).send({ success: false, message: 'Post not found' });
        }

        let userLikedIndex = -1;
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].user.toString() === userId) {
                userLikedIndex = i;
                break;
            }
        }
        
        if (userLikedIndex !== -1) {
            // User already liked the post, remove from likes array
            post.likes.splice(userLikedIndex, 1);
            post.totalLikes -= 1;
        } else {
            // User not found in likes array, add to likes array
            post.likes.push({ user: userId });
            post.totalLikes += 1;

        }
        
        await post.save(); // Save the updated post
        
        res.status(200).json({ success: true, message: 'Likes updated successfully', post });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

const sendMail = async (req, res) => {
  const { userId, postId } = req.body;
  try {
      const user = await userModel.findOne({ _id: userId });
      if (!user) {
          return res.status(404).send({ success: false, message: 'User not found' });
      }

      const post = await postModel.findOne({ _id: postId });
      if (!post) {
          return res.status(404).send({ success: false, message: 'Post not found' });
      }

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'shubhamsur09@gmail.com',
              pass: 'cnpgkkumhduwgqub'
          }
      });

      const mailOptions = {
          from: 'shubhamsur09@gmail.com',
          to: post?.email,
          subject: 'Reset Password Link',
          html: `
              <p>${user.firstName} ${user.lastName} has shown interest in your property.</p>
              <p>Contact Details:</p>
              <ul>
                  <li>Name: ${user.firstName} ${user.lastName}</li>
                  <li>Phone: ${user.phone}</li>
                  <li>Email: ${user.email}</li>
              </ul>
              <img src="${post.photoUrl}" alt="Property Photo" />
          `
      };

      transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
              console.error('Email sending error:', error);
              return res.status(400).send({ message: 'Error sending email', success: false });
          } else {
              console.log('Email sent: ' + info.response);
              return res.status(200).send({ message: 'Email sent successfully', success: true });
          }
      });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}



module.exports={photoController,uploadPhotoUrl,uploadVideoUrl,postController,updateLikes
    ,descriptionController,videoController,getPostController,getDeletePostController,sendMail}