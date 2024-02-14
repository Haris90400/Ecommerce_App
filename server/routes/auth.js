const express = require('express');
const User = require('../models/user');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post("/api/signup",async (req,res)=>{
    try{
        const {name, email, password}= req.body;
        //post the data in database
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"User with the email already exists"});
        }

        const hashed_password = await bcrypt.hash(password,8);
    
        let user = new User({
            email,
            password:hashed_password,
            name
        });
    
        user = await user.save();
        //return that data to the user
        res.json(user);
    }catch(e){
        res.status(500).json({error: e.message});
    }
    //get the data from the client
   
});

authRouter.post("/api/signin",async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({msg:"User with this email does not exist!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({msg:"Incorrect Password."});
        }

        const token = jwt.sign({id:user._id},"secret_key");

        // Fix: Spread the user._doc object properly
        res.json({token, ...user._doc});
    } catch(e){
        res.status(500).json({err:e.message});
    }
});

authRouter.post("/tokenIsValid",async (req,res)=>{
    try{
        const token = req.header('x-auth-token');

        if(!token){
            return res.json(false);
        }

        const isVerified=  jwt.verify(token,"secret_key");

        if(!isVerified){
            return res.json(false);
        }

        const user = User.findById(isVerified.id);

        if(!user){
            return res.json(false);
        }

        return res.json(true);
    } catch(e){
        res.status(500).json({err:e.message});
    }
});

authRouter.get("/",auth,async (req,res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc,token:req.token});
});

module.exports = authRouter;