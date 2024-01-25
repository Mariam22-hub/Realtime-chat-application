const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const UserModel = require('../Models/userModel');
require("dotenv").config({path: "F:\\miscellenuos projects\\realtime chat\\server\\.env"});

const createToken = (_id) =>{
    const key = process.env.JWT_SECRET_KEY;
    return jwt.sign({id: _id}, key, {expiresIn: "3 days"});
}

exports.resgisterUser = async (req, res)=>{
    const {name, email, password} = req.body;
    
    try{
        let user = await UserModel.findOne({email});

        if (user) return res.status(400).json("user with this email already exists");
        if (!email || !password || !name) return res.status(400).json("All fields are required");
        if (!validator.isEmail(email)) return res.status(400).json("Please write a valid Email address");
        if (!validator.isStrongPassword(password)) 
            return res.status(400).json("Please a write a strong password");

        user = new UserModel({name, email, password});
        let salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt);

        await user.save()
        const token = createToken(user.id);
        return res.status(201).json({
            _id: user.id,
            name, email 
        })
    }
    catch(e){
        // console.log(e);
        res.status(401).json("error in registering user");
    }
};

exports.loginUser = async (req,res) => {
    const {email, password} = req.body;
    
    try {
        // console.log(req.body);
        let user = await UserModel.findOne({email});
        if (!user) return res.status(404).json({message: "Invalid email or password..."});

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return res.status(404).json({message: "User not found"});
        const token = createToken(user.id);

        return res.status(200).json({
            message: "Logged in successfully",
            id: user.id, 
            name: user.name, 
            email: user.email
        })

    } 
    catch (error) {
        console.log(error);
        res.status(401).json("error in logging in user");
    }
    
}

exports.findUser = async (req,res)=>{
    try {
        let user = await UserModel.findById(req.params.id);
        res.status(200).json({id:user.id, name:user.name, email:user.email})
    } 
    catch (error) {
        // console.log(error);
        res.status(500).json({message: "Error in getting the user"});
    }
    
}

exports.getUsers = async (req,res)=>{
    try {
        let user = await UserModel.find()
        res.status(200).json({users: user})
    } 
    catch (error) {
        // console.log(error);
        res.status(500).json({message: "Error in getting the user"});
    }
}
