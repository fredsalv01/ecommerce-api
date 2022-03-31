const router = require('express').Router();
const cryptoJs = require('crypto-js');
const {verifyTokenAndAuthorization} = require('../middleware/verifyToken');
const User = require('../models/User');


router.put("/:id", verifyTokenAndAuthorization,(req, res) => {
    if(req.body.password){
        req.body.password = cryptoJs.AES.encrypt(
            req.body.password, 
            process.env.SECRET_KEY
        ).toString();
    }
    try{
        User.findByIdAndUpdate(
            req.params.id, {$set: req.body}, {new: true}, 
            (err, user) => {
                if(err) res.status(500).json(err);
                res.status(200).json(user);
            }
        )
    }catch(error){
        res.status(500).json(error);
    }
})

module.exports = router;