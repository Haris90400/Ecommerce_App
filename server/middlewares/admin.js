const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async (req,res,next)=>{
    try{
        const token = req.header('x-auth-token');

        if(!token){
            return res.status(401).json({msg:'No auth token, access denied!'});
        }

        const isVerified = jwt.verify(token,"secret_key");

        if(!isVerified){
            return res.status(401).json({err:'Token verification failed, authorization denied'});
        }

        const user = await User.findById(isVerified.id);

        if(user.type == 'user' || user.type=='seller'){
            return res.status(500).json({err:'You are not an admin !'});
        }
        req.user = isVerified.id;
        req.token = token;

        next();
    }catch(e){
        res.status(500).json({error:e.message});
    }
}

module.exports = admin;