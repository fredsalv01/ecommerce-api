const router = require('express').Router();
const {verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization} = require('../middleware/verifyToken');
const Order = require('../models/Order');

//create order
router.post("/", verifyToken, (req, res) => {
    try{
        const newOrder = new Order(req.body);
        newOrder.save()
        .then(order => {
            res.status(200).json({
                message: "Order created successfully",
                order
            });
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//update order
router.put("/:id", verifyTokenAndAuthorization,(req, res) => {
   
    try{
        Order.findByIdAndUpdate(
            req.params.id, req.body, {new: true}, (err, order) => {
            if(err) res.status(500).json(err);
            res.status(200).json(order);
        })
    }catch(error){
        res.status(500).json(error);
    }
})


//delete order
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Order deleted successfully!"}); 
    }catch(error){
        res.status(500).json(error);
    }
})

//get user order
router.get("/find/:userId", verifyTokenAndAuthorization, (req, res) => {
    try{
        Order.findOne({userId: req.params.userId}, (err, order) => {
            if(err) res.status(500).json(err);
            res.status(200).json(order._doc);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get all
router.get("/" , verifyTokenAndAuthorization, (req, res) => {
    try{
        Order.find({}, (err, order) => {
            if(err) res.status(500).json(err);
            res.status(200).json(order);
        })
    }catch(error){
        res.status(500).json(error);
    }
})



module.exports = router;