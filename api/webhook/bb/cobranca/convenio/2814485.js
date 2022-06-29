const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) =>{
    res.status(200).json({
        mensagem: 'OK - GET - 2814485.'
    });
});


router.post('/', (req, res, next) =>{

    res.status(200).json({
        status: '200'
    });
    console.log(req.body);
});

module.exports = router;