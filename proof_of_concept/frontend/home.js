const express = require('express');
const router = express.Router();
const contenttype = 'application/hal+json';

//templates
const parsedHome = require('../modules/parsingTemplates/home/parsedHome');
const getHome = require('../modules/getHome.js');

router.get('/*',(req,res,next) => {
    res.header("Content-Type", contenttype);
    next();
});

router.get('/',(req,res)=>{
    res.header("Content-Type", contenttype);
    getHome()
        .then(home => parsedHome(home))
        .then(parsedObject =>(res.send(parsedObject)))
});

module.exports = router;