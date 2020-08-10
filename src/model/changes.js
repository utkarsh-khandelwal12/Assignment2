const mongoose = require('mongoose');

const userschema=mongoose.Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    age:{
        type: Number
    },
    collegename:{
        type: String
    },
    email:{
        type: String,
        required: true
    }
})

const User=mongoose.model('User',userschema);
module.exports=User;