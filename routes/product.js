const router = require('express').Router();
const cryptoJs = require('crypto-js');
const {verifyTokenAndAdmin} = require('../middleware/verifyToken');
const Product = require('../models/Product');

//create product
router.post("/", verifyTokenAndAdmin, (req, res) => {
    try{
        const product = new Product(req.body);
        product.save((err, product) => {
            if(err) res.status(500).json(err);
            res.status(200).json(product);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//update product
router.put("/:id", verifyTokenAndAdmin,(req, res) => {
   
    try{
        Product.findByIdAndUpdate(
            req.params.id, req.body, {new: true}, (err, product) => {
            if(err) res.status(500).json(err);
            res.status(200).json(product);
        })
    }catch(error){
        res.status(500).json(error);
    }
})


//delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Product deleted successfully!"}); 
    }catch(error){
        res.status(500).json(error);
    }
})

//get one product
router.get("/find/:id", verifyTokenAndAdmin, (req, res) => {
    try{
        Product.findById(req.params.id, (err, product) => {
            if(err) res.status(500).json(err);
            res.status(200).json(product._doc);
        })
    }catch(error){
        res.status(500).json(error);
    }
})

//get all products
router.get("/", verifyTokenAndAdmin, async(req, res) => {
    const qNew = req.query.new
    const qOld = req.query.old
    const qCategory = req.query.category
    const qColor = req.query.color
    const qMinPrice = req.query.priceMin || 0
    const qMaxPrice = req.query.priceMax
    const qSize = req.query.size
    
    try{
        let query = {};
        if(qCategory){
            query.categories = {$in: [qCategory]};
        }
        if(qColor){
            query.color = qColor;
        }
        if(qMinPrice){
            query.price = {$gte: qMinPrice};
        }
        if(qMaxPrice){
            query.price = {$gte: qMinPrice, $lt: qMaxPrice};
        }
        if(qSize){
            query.size = qSize;
        }


        // get all products with query params
        const products = await Product.find(query);

        // filter products by new and old
        if(qNew){
            products.sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        }
        if(qOld){
            products.sort((a, b) => {
                return a.createdAt - b.createdAt;
            })
        }

        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;