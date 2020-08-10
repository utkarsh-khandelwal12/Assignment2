const express = require('express');
const User=require('../model/model');
const Change=require('../model/changes');

const router= express.Router();

router.post('/users/create', async (req,res) =>{
    try{
        const user= new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token})
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req,res) =>{
    try{
        const {email,password}= req.body;
        const user= await User.findByCredentials(email,password)
        if(!user){
            return res.status(401).send({error:'Login Failed'})
        }
        const token = await user.generateAuthToken();
        res.send({user, token})
        } catch(error) {
            res.status(400).send(error);
    }
})

router.post('/users/update', async(req,res)=>{
    const user1 = new Change(req.body);
    const user= await User.findByCredentialsquery(user1.email)
    if(!user){
        return res.status(401).send({error:'Cant update what dont exist'})
    }
    user.firstname=user1.firstname;    
    user.lastname=user1.lastname;
    user.age=user1.age;
    user.collegename=user1.collegename;
    await user.save();
    return res.status(200).send(user);
})

router.post('/users/delete', async(req,res)=>{
    const user1 =new Change(req.body);
    const user= await User.findByCredentialsquery(user1.email)
    if(!user){
        return res.status(401).send({error:'Cant delete what dont exist'})
    }
    user.deleteOne({ email: user1.email }, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });
      await user.save();
      return res.status(200).send(user);
})

router.post('/users/get', async(req,res)=>{
    const user1 = new User(req.body);
    const user= await User.findByCredentialsquery(user1.email)
    if(!user){
        return res.status(401).send({error:'Cant update what dont exist'})
    }
    return res.status(200).send(user);
})

module.exports = router