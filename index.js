const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
app.use(express.json());

//mongoose connection

mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error:', err.message);
});

app.use('/api/user', require('./routes/user.js'));
app.use('/api/products', require('./routes/product.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/cart', require('./routes/cart.js'));

//open port
app.listen(process.env.PORT || 5000, () => {
    console.log('server running on port', process.env.PORT || 5000);
})