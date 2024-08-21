import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart.jsx';
import PieChart from './components/PieChart';
function App() {
const [month, setMonth] = useState('March');
return (
<div className="App">
<h1>Product Transactions Dashboard</h1>
<div>
<label htmlFor="month">Select Month:</label>
<select
id="month"
value={month}
onChange={(e) => setMonth(e.target.value)}
>
<option value="January">January</option>
<option value="February">February</option>
<option value="March">March</option>
<option value="April">April</option>
<option value="May">May</option>
<option value="June">June</option>
<option value="July">July</option>
<option value="August">August</option>
<option value="September">September</option>
<option value="October">October</option>
<option value="November">November</option>
<option value="December">December</option>
</select>
</div>
<TransactionsTable month={month} />
<Statistics month={month} />
<BarChart month={month} />
<PieChart month={month} />
</div>
);
}
export default App;