const express = require('express')
const router = express.Router()
//const Area = require('../models/area')


router.get('/', (req, res) => {
    

    res.render('index')
})

module.exports = router