const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
      const exisitingUser = await userModel.findOne({ email: req.body.email });
      if (exisitingUser) {
        return res
          .status(200)
          .send({ message: "User Already Exist", success: false });
      }
      
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newUser = new userModel(req.body);
      await newUser.save();
      return res.status(200).json({ message: "Mail Sent Successfully", success: true });
    
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: `Register Controller ${error.message}`,
      });
    }
  };
  
  // login callback
  const loginController = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "user not found", success: false });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invlid EMail or Password", success: false });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      return res.status(200).json({ message: "Login Success", success: true, token,user });
      
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
  };


  const authController = async (req, res) => {
    
    try {
      console.log(req.body)
      const user = await userModel.findOne({ _id: req.body.userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: error.message, // Include the error message for debugging (not recommended in production)
      });
    }
  };

  module.exports={loginController,registerController,authController}