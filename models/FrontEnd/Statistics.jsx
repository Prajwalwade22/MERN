import React, { useState, useEffect } from 'react';
// import {useParams} from 'react-router-dom';
import axios from 'axios';
const Statistics = ({ month }) => {
const [stats, setStats] = useState({ totalAmount: 0, totalItems: 0, notSoldItems: 0 });
// let params = useParams();
useEffect(() => {
const fetchStatistics = async () => {
try {
const response = await axios.get(`/api/products/statistics`, {
params: { month }
});
setStats(response.data);
} catch (error) {
console.error('Error fetching statistics:', error);
}
};
fetchStatistics();
}, [month]);
return (
<div>
<h2>Statistics for {month}</h2>
<p>Total Sale Amount: ${stats.totalAmount}</p>
<p>Total Sold Items: {stats.totalItems}</p>
<p>Total Not Sold Items: {stats.notSoldItems}</p>
</div>
);
};
export default Statistics;