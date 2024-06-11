const express = require("express"),
    router = express.Router();
const fs = require('fs');
const path = require('path');
const data = path.join(__dirname.split('\\routes')[0], '/users.json')
router.route('/').get((req, res) => {
    console.log(data);
    fs.readFile(data, 'utf-8', (error, data) => {
        res.json(JSON.parse(data));
    })
})

module.exports = router;