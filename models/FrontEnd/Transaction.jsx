import React, { useState, useEffect } from 'react';
import axios from 'axios';
const TransactionsTable = ({ month }) => {
const [transactions, setTransactions] = useState([]);
const [search, setSearch] = useState('');
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const perPage = 10;
useEffect(() => {
const fetchTransactions = async () => {
try {
const response = await axios.get(`/api/products/list`, {
params: { page, perPage, search }
});
setTransactions(response.data.products);
setTotal(response.data.total);
} catch (error) {
console.error('Error fetching transactions:', error);
}
};
fetchTransactions();
}, [month, search, page]);
return (
<div>
<input
type="text"
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search by title, description, or price"
/>
<table>
<thead>
<tr>
<th>Title</th>
<th>Description</th>
<th>Price</th>
<th>Date of Sale</th>
<th>Category</th>
</tr>
</thead>
<tbody>
{transactions && transactions.map((transaction) => (
<tr key={transaction._id}>
<td>{transaction.title}</td>
<td>{transaction.description}</td>
<td>${transaction.price}</td>
<td>{new Date(transaction.dateOfSale).toDateString()}</td>
<td>{transaction.category}</td>
</tr>
))}
</tbody>
</table>
<div>
<button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
<button onClick={() => setPage((prev) => (prev * perPage < total ? prev + 1 : prev))}>Next</button>
</div>
</div>
);
};
export default TransactionsTable;