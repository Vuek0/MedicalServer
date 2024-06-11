const express = require("express"),
    router = express.Router();
const fs = require('fs');
const path = require('path');
router.route('/').get((req, res) => {
    fs.readFile()
    res.send('get users');
})

module.exports = router;