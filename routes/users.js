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

router.route('/').get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
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
        res.status(403).send("Invalid Api Key");
    }else if(!req.query.key){
        res.status(403).send("Api Key is required")
    }
}).post((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
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
        res.status(403).send("Invalid Api Key");
    }else{
        res.status(403).send("Api Key is required")
    }
    
}).put((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const {password, _id} = req.body;
    if(req.query.key === process.env.API_KEY && password && _id){
        
        User
        .findByIdAndUpdate(_id, { password : password }, (err, docs)=>{
            if(err){
                res.send(err).status(404);
            } else{
                res.send(docs).status(200);
            }
        })
        
    }else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    }else{
        res.status(403).send("Api Key is required")
    }
}).delete(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const {_id} = req.body;
    if(req.query.key === process.env.API_KEY){
        try{

            const deletedItem = await User.findByIdAndDelete(mongoose.Types.ObjectId(_id));
            res.json({
                status: 200,
                response: "Account removed succesfull",
                data: deletedItem,
            }).status(200);
        } catch(err){
            res.json({
                status: 404,
                error: err,
                message: "Something happened"
            }).status(404);
        }
    } else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    } else{
        res.status(403).send("Api Key is required")
    }
})
router.route('/doctors/:type').get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const result = [];
    if(req.query.key === process.env.API_KEY){
        User
        .find()
        .then((users) => {
            users.forEach(user => {
                if(JSON.parse(user.type).specialization === req.params.type){
                    result.push(user);
                }
            })
            res.send(result).status(200)
        })
        .catch((error) => {
            res.send(error);
        })
    } else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    } else{
        res.status(403).send("Api Key is required")
    }
})
  
module.exports = router;