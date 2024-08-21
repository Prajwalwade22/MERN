const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const axios = require('axios');
// Initialize Database
router.post('/initialize', async (req, res) => {
try {
const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
const products = response.data;
await Product.deleteMany({});
await Product.insertMany(products);
res.status(200).json({ message: 'Database initialized successfully' });
} catch (error) {
res.status(500).json({ error: error.message });
}
});
// List Transactions with Search and Pagination
router.get('/list', async (req, res) => {
const { page = 1, perPage = 10, search = '' } = req.query;
const skip = (page - 1) * perPage;
const regex = new RegExp(search, 'i');
try {
const products = await Product.find({
$or: [
{ title: regex },
{ description: regex },
{ price: regex }
]
}).skip(skip).limit(parseInt(perPage));
const total = await Product.countDocuments({
$or: [
{ title: regex },
{ description: regex },
{ price: regex }
]
});
res.json({ products, total });
} catch (error) {
res.status(500).json({ error: error.message });
}
});
// Statistics
router.get('/statistics', async (req, res) => {
const { month } = req.query;
if (!month) return res.status(400).json({ error: 'Month is required' });
try {
const totalSold = await Product.aggregate([
{ $match: { dateOfSale: { $regex: `-${month}-` } } },
{ $group: { _id: null, totalAmount: { $sum: '$price' }, totalItems: { $sum: 1 } } }
]);
const notSoldCount = await Product.countDocuments({ dateOfSale: { $exists: false } });
res.json({
totalAmount: totalSold[0]?.totalAmount || 0,
totalItems: totalSold[0]?.totalItems || 0,
notSoldItems: notSoldCount,
});
} catch (error) {
res.status(500).json({ error: error.message });
}
});
// Bar Chart Data
router.get('/bar-chart', async (req, res) => {
const { month } = req.query;
if (!month) return res.status(400).json({ error: 'Month is required' });
try {
const ranges = [
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 0, $lte: 100 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 101, $lte: 200 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 201, $lte: 300 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 301, $lte: 400 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 401, $lte: 500 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 501, $lte: 600 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 601, $lte: 700 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 701, $lte: 800 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 801, $lte: 900 } } },
{ $match: { dateOfSale: { $regex: `-${month}-` }, price: { $gte: 901 } } },
];
const data = await Promise.all(ranges.map(range =>
Product.countDocuments(range.$match)
));
res.json({
"0 - 100": data[0],
"101 - 200": data[1],
"201 - 300": data[2],
"301 - 400": data[3],
"401 - 500": data[4],
"501 - 600": data[5],
"601 - 700": data[6],
"701 - 800": data[7],
"801 - 900": data[8],
"901-above": data[9],
});
} catch (error) {
res.status(500).json({ error: error.message });
}
});
// Pie Chart Data
router.get('/pie-chart', async (req, res) => {
const { month } = req.query;
if (!month) return res.status(400).json({ error: 'Month is required' });
try {
const categories = await Product.aggregate([
{ $match: { dateOfSale: { $regex: `-${month}-` } } },
{ $group: { _id: '$category', count: { $sum: 1 } } }
]);
res.json(categories.reduce((acc, { _id, count }) => {
acc[_id] = count;
return acc;
}, {}));
} catch (error) {
res.status(500).json({ error: error.message });
}
});
// Combined Data
router.get('/combined', async (req, res) => {
const { month } = req.query;
if (!month) return res.status(400).json({ error: 'Month is required' });
try {
const [transactions, statistics, barChart, pieChart] = await Promise.all([
axios.get(`http://localhost:5000/api/products/list?search=&page=1&perPage=10`),
axios.get(`http://localhost:5000/api/products/statistics?month=${month}`),
axios.get(`http://localhost:5000/api/products/bar-chart?month=${month}`),
axios.get(`http://localhost:5000/api/products/pie-chart?month=${month}`)
]);
res.json({
transactions: transactions.data,
statistics: statistics.data,
barChart: barChart.data,
pieChart: pieChart.data
});
} catch (error) {
res.status(500).json({ error: error.message });
}
});
module.exports = router;