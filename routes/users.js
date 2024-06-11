const express = require("express"),
    router = express.Router();
const fs = require('fs');
const path = require('path');
const data = path.join(__dirname.split('\\routes')[0], '/users.json')
require('dotenv').config()
router.route('/').get((req, res) => {
    console.log(req.query.key);
    fs.readFile(data, 'utf-8', (error, data) => {
        res.json(JSON.parse(data));
    })
}).post((req, res) => {
    if(req.query.key === process.env.API_KEY){
        res.send("posted bro")
    }else if(req.query.key !== process.env.API_KEY){
        res.send("Invalid Api Key");
    }else{
        res.send("Api Key is required")
    }
    
})

module.exports = router;