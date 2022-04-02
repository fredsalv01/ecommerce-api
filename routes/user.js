const router = require('express').Router();
const cryptoJs = require('crypto-js');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../middleware/verifyToken');
const User = require('../models/User');

//update user
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

//delete user
router.delete("/:id", verifyTokenAndAuthorization, (req, res) => {
    try{
        User.findByIdAndDelete(req.params.id, (err, user) => {
            if(err) res.status(500).json(err);
            res.status(200).json(user);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get one user
router.get("/find/:id", verifyTokenAndAdmin, (req, res) => {
    try{
        User.findById(req.params.id, (err, user) => {
            if(err) res.status(500).json(err);
            const {password, ...others} = user._doc;
            res.status(200).json(others);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get all users
router.get("/", verifyTokenAndAdmin, async(req, res) => {
    const query = req.query.new
    try{
        const users = query
            ? await User.find().sort({id: -1}).limit(5)
            : await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})

//get user stats
router.get("/stats", verifyTokenAndAdmin, async(req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const users = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastYear
                    }
                }
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])
        
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
        
})


module.exports = router;