require('dotenv').config()
const md5 = require("crypto-js/md5");
const express = require("express"),
    router = express.Router();
const fs = require('fs');
const path = require('path');

const data = path.join(__dirname.split('\\routes')[0], '/users.json');
const mongoose = require('mongoose');
const User = require('../models/user')
mongoose.set('strictQuery', false);
const db = `mongodb+srv://admin:${process.env.DB_PASSWORD}@medicaldb.nlxa1z5.mongodb.net/MedicalDB`;
mongoose.connect(db)
.then(()=>{
    console.log('Connect to DB')
}).catch(err => {
    console.log(err)
});
console.log(md5("123321").toString());

router.route('/').get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    if(req.query.key === process.env.API_KEY){
        User
        .find()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            res.send(error);
        })
    }else if(req.query.key && req.query.key !== process.env.API_KEY){
        res.send("Invalid Api Key");
    }else if(!req.query.key){
        res.send("Api Key is required")
    }
}).post((req, res) => {
    const {name, surname, login, password, type} = req.body;
    if(req.query.key === process.env.API_KEY && name && surname && login && password && type){
        const user = new User({ name, surname, login, password, type});
        user.password = md5(user.password).toString();
        user.save().then(result => res.send(result));
    }else if(req.query.key !== process.env.API_KEY){
        res.send("Invalid Api Key");
    }else{
        res.send("Api Key is required")
    }
    
})

  
module.exports = router;