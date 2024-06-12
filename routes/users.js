require('dotenv').config()
const express = require("express"),
    router = express.Router();
const fs = require('fs');
const path = require('path');
const data = path.join(__dirname.split('\\routes')[0], '/users.json');
const mongoose = require('mongoose');
const Post = require('../models/post')
mongoose.set('strictQuery', false);
const db = `mongodb+srv://admin:${process.env.DB_PASSWORD}@medicaldb.nlxa1z5.mongodb.net/MedicalDB`;

console.log(db);
router.route('/').get((req, res) => {
    console.log(req.query.key);
    if(req.query.key === process.env.API_KEY){
        const data = []
        Post.find().then(users =>{
            users.forEach(item => {
                console.log(item);
            })
            res.json(users);
        }).catch((error) =>{
          res.send(error)
        })
        
    }else if(req.query.key && req.query.key !== process.env.API_KEY){
        res.send("Invalid Api Key");
    }else{
        res.send("Api Key is required")
    }
}).post((req, res) => {
    if(req.query.key === process.env.API_KEY){
        res.send("posted bro")
    }else if(req.query.key !== process.env.API_KEY){
        res.send("Invalid Api Key");
    }else{
        res.send("Api Key is required")
    }
    
})
mongoose.connect(db).then(()=>{
    console.log('Connect to DB')
}).catch(err => {
    console.log(err)
})
  
module.exports = router;