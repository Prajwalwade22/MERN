import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const BarChart = ({ month }) => {
const [barData, setBarData] = useState({});
useEffect(() => {
const fetchBarChart = async () => {
try {
const response = await axios.get(`/api/products/bar-chart`, {
params: { month }
});
setBarData(response.data);
} catch (error) {
console.error('Error fetching bar chart data:', error);
}
};
fetchBarChart();
}, [month]);
const data = {
labels: Object.keys(barData),
datasets: [
{
label: 'Number of Items',
data: Object.values(barData),
backgroundColor: 'rgba(75, 192, 192, 0.2)',
borderColor: 'rgba(75, 192, 192, 1)',
borderWidth: 1,
},
],
};
return (
<div>
<h2>Bar Chart for {month}</h2>
<Bar data={data} options={{ responsive: true }} />
</div>
);
};
export default BarChart;
