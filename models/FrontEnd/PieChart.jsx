import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart = ({ month }) => {
const [pieData, setPieData] = useState({});
useEffect(() => {
const fetchPieChart = async () => {
try {
const response = await axios.get(`/api/products/pie-chart`, {
params: { month }
});
setPieData(response.data);
} catch (error) {
console.error('Error fetching pie chart data:', error);
}
};
fetchPieChart();
}, [month]);
const data = {
labels: Object.keys(pieData),
datasets: [
{
label: 'Categories',
data: Object.values(pieData),
backgroundColor: [
'#FF6384',
'#36A2EB',
'#FFCE56',
'#E8C0FF',
'#A2C2E4',
'#FF9F40',
],
borderWidth: 1,
},
],
};
return (
<div>
<h2>Pie Chart for {month}</h2>
<Pie data={data} options={{ responsive: true }} />
</div>
);
};
export default PieChart;