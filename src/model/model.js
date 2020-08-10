const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt =require('bcryptjs');
const jwt=require('jsonwebtoken');

const userschema=mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    collegename:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        validate: value=> {
            if(validator.isEmail(value)){
                throw new Error({error: 'Invalide email'});
            }
        }
    },
    password:{
        type : String,
        required : true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userschema.pre('save', async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8);
    }
    console.log('Query executed successfully');
    next();
})

userschema.methods.generateAuthToken= async function(){
    const user=this
    const token=jwt.sign({_id: user._id},process.env.JWT_KEY)
    user: tokens=user.tokens.concat({token})
    user.save()
    return token
}

userschema.statics.findByCredentials= async (email,password) => {
    const user = await user.findOne({email})
    if(!user){
        throw new Error({error:'Invalid credentials'});
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        throw new Error({error:'Invalid credentials'}); 
    }
    return user;
}

userschema.statics.findByCredentialsquery= async (email) => {
    const user = await user.findOne({email})
    if(!user){
        throw new Error({error:'Invalid credentials'});
    }
    return user;
}

const User=mongoose.model('User',userschema);
module.exports=User;