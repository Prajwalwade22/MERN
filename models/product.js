const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
title: String,
description: String,
price: Number,
dateOfSale: Date,
category: String,
});
module.exports = mongoose.model('Product', ProductSchema);