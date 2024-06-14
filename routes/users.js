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
        res.statusCode = 403;
    }else if(!req.query.key){
        res.send("Api Key is required")
        res.statusCode = 403;
    }
}).post((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    const {name, surname, login, password, type} = req.body;
    if(req.query.key === process.env.API_KEY && name && surname && login && password && type){
        let isAllow = true;
        User
        .find()
        .then((users) => {
            users.forEach(user => {
                if(user.login == login){
                    res.status(400).json({status: 400, message: "Login already exists"})
                    isAllow = false;
                }
            })
            if(isAllow){
                const user = new User({ name, surname, login, password, type});
                user.password = md5(user.password).toString();
                user.save().then(result => res.send(result));
            }
        })
        .catch((error) => {
            res.send(error);
        })
        
    }else if(req.query.key !== process.env.API_KEY){
        res.send("Invalid Api Key");
        res.statusCode = 403;
    }else{
        res.send("Api Key is required")
        res.statusCode = 403;
    }
    
})

  
module.exports = router;