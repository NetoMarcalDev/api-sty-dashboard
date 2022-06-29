const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) =>{
    res.status(200).json({
        mensagem: 'OK - GET - 3061856.'
    });
});


router.post('/', (req, res, next) =>{
    
     console.log(req.body);
    res.status(200).json({
        status: '200'
    });   
});

module.exports = router;