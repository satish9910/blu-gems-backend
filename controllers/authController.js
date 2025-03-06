const userModel = require('../models/userModel');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userRegister = async (req,res) =>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).send('Please provide all the details');
    }

    if(password.length < 6){
        return res.status(400).send('Password must be atleast 6 characters long');
    }

    if(await userModel.exists({email})){
        return res.status(400).send('User already exists');
    }

    const hashPassword = await bycrypt.hash(password,10);
    const user = await userModel.create({name,email,password:hashPassword});
    res.send(user);   

}

const userLogin = async (req,res) =>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).send('Please provide email and password');
    }

    const user =await userModel.findOne({email}).select('+password');
    
    if(!user || !(await bycrypt.compare(password,user.password))){
        return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });

    

    res.status(200).json({
        status:'success',
        token
    });
}




module.exports = {userRegister,userLogin};