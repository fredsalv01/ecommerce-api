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
router.put("/:id", verifyTokenAndAdmin,(req, res) => {
   
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
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Order deleted successfully!"}); 
    }catch(error){
        res.status(500).json(error);
    }
})

//get user orders
router.get("/find/:userId", verifyTokenAndAuthorization, (req, res) => {
    try{
        Order.find({userId: req.params.userId}, (err, order) => {
            if(err) res.status(500).json(err);
            res.status(200).json(order._doc);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get all
router.get("/" , verifyTokenAndAdmin, (req, res) => {
    try{
        Order.find({}, (err, order) => {
            if(err) res.status(500).json(err);
            res.status(200).json(order);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get monthly income
router.get("/income", verifyTokenAndAdmin, (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    
    try{
        Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousMonth,
                        // $lte: lastMonth
                    }
                }
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount",
                },
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ], (err, income) => {
            if(err) res.status(500).json(err);
            res.status(200).json(income);
        })
    }catch(error){
        res.status(500).json(error);
    }

})



module.exports = router;