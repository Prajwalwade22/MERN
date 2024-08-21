const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/productdb');
app.use(express.json());
// Import routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});