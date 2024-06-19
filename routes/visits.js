require('dotenv').config()
const md5 = require("crypto-js/md5");
const express = require("express"),
    router = express.Router();
const fs = require('fs');
const path = require('path');

const data = path.join(__dirname.split('\\routes')[0], '/users.json');
const mongoose = require('mongoose');
const Visit = require('../models/visit');
mongoose.set('strictQuery', false);
const db = `mongodb+srv://admin:${process.env.DB_PASSWORD}@medicaldb.nlxa1z5.mongodb.net/MedicalDB`;
mongoose.connect(db)
.then(()=>{
    console.log('Connect to DB')
}).catch(err => {
    console.log(err)
});

router.route('/').get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if(req.query.key === process.env.API_KEY){

    }else if(req.query.key && req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    }else if(!req.query.key){
        res.status(403).send("Api Key is required")
    }
}).post((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if(req.query.key === process.env.API_KEY){
        
    }else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    }else{
        res.status(403).send("Api Key is required")
    }
    
}).put((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if(req.query.key === process.env.API_KEY && password && _id){
        
    }else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    }else{
        res.status(403).send("Api Key is required")
    }
}).delete(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const {_id} = req.body;
    if(req.query.key === process.env.API_KEY){
        
    } else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    } else{
        res.status(403).send("Api Key is required")
    }
})

  
module.exports = router;