const router = require('express').Router();
const {verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization} = require('../middleware/verifyToken');
const Cart = require('../models/Cart');

//create cart
router.post("/", verifyToken, (req, res) => {
    try{
        const newCart = new Cart(req.body);
        newCart.save()
        .then(cart => {
            res.status(200).json({
                message: "Cart created successfully",
                cart
            });
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//update cart
router.put("/:id", verifyTokenAndAuthorization,(req, res) => {
   
    try{
        Cart.findByIdAndUpdate(
            req.params.id, req.body, {new: true}, (err, cart) => {
            if(err) res.status(500).json(err);
            res.status(200).json(cart);
        })
    }catch(error){
        res.status(500).json(error);
    }
})


//delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Cart deleted successfully!"}); 
    }catch(error){
        res.status(500).json(error);
    }
})

//get user cart
router.get("/find/:userId", verifyTokenAndAuthorization, (req, res) => {
    try{
        Cart.findOne({userId: req.params.userId}, (err, cart) => {
            if(err) res.status(500).json(err);
            res.status(200).json(cart._doc);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get all
router.get("/" , verifyTokenAndAuthorization, (req, res) => {
    try{
        Cart.find({}, (err, cart) => {
            if(err) res.status(500).json(err);
            res.status(200).json(cart);
        })
    }catch(error){
        res.status(500).json(error);
    }
})


module.exports = router;