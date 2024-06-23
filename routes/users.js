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

router.route('/').get(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if(req.query.key === process.env.API_KEY && req.query._id){
        const user = await User.findById(req.query._id).exec()
        res.json(await User.findById(req.query._id).exec());
        console.log(user)
    }
    else if(req.query.key === process.env.API_KEY 
        && req.query.login 
        && req.query.password){
        let error;
        User
        .find()
        .then((users) => {
            let obj;
            users.forEach(item => {
                if(item.login === req.query.login){
                    if(md5(req.query.password).toString() == item.password){ 
                        obj = item;
                    } else{
                    error = "Логин или пароль неверны"
                    }
                } else{
                    if(error!=="Логин или пароль неверны") error = "Аккаунт не найден";
                }
            })
            if(obj){
                res.json(obj).status(200)
            } else{
                res.json({
                    message: error,
                    status: 404,
                })
            }
        })
        .catch((error) => {
            res.send(error);
        })
    }else if(req.query.key && req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    }else if(!req.query.key){
        res.status(403).send("Api Key is required")
    }else if(!req.query.login && !req.query.password){
        res.status(400).send("Missing data")
    }else if(req.query.login && !req.query.password){
        res.status(400).send("Missing password")
    }else if(!req.query.login && req.query.password){
        res.status(400).send("Missing login");
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
    
}).put(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const {password, _id} = req.body;
    if(req.query.key === process.env.API_KEY && password && _id){
        try{
            const updated = await User.findByIdAndUpdate(_id, { password : md5(password).toString() }, { new : true});
            res.json({
                status: 200,
                response: "Account updated succesfull",
                data: updated,
            }).status(200);
        } catch(err){
            res.json({
                status: 404,
                error: err,
                message: "Something happened"
            }).status(404);
        }
        
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

            const deletedItem = await User.deleteOne({_id : _id});
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
        .catch(error=> {
            res.json({
                message: error.message,
                status: 500,
            }).status(500);
            console.log("yes")
        })
    } else if(req.query.key !== process.env.API_KEY){
        res.status(403).send("Invalid Api Key");
    } else{
        res.status(403).send("Api Key is required")
    }
})

console.log(md5("123321").toString());

module.exports = router;