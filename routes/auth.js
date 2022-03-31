const router = require('express').Router();
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

//register
router.post('/register',  (req, res) => {
    const { username, email, password } = req.body;
    const user = new User(
        { 
            username, 
            email, 
            password: CryptoJs.AES.encrypt(password, process.env.SECRET_KEY).toString(),
        }
    );
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            userData: doc
        });
    });
});

//login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    //check if user exist
    User.findOne({ email }, (err, user) => {

        //if error
        if (!user) return res.json({ success: false, message: 'Auth failed, email not found' });
        
        const decryptPass = CryptoJs.AES.decrypt(
            user.password, process.env.SECRET_KEY)
            .toString(CryptoJs.enc.Utf8
        );

        //check password
        if (decryptPass === password) {
            const {password, ...others} = user._doc;
            
            //create token
            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: user.isAdmin
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                success: true,
                message: 'Auth successful',
                accessToken: 'Bearer ' + accessToken,
                userData: others
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Auth failed, wrong password'
        });
    });
});



module.exports = router;