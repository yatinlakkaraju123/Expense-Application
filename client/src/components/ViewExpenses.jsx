import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto'; // Ensure this import is included

function ViewExpenses() {
  const [categories, setCategories] = useState([]);
  const { userId, isLoaded } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const chartRef = useRef(null); // Create a ref for the chart

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('https://expense-application-c99f020l6-yatin-lakkarajus-projects.vercel.app/api/categories');
      const userCategories = response.data.filter(category => category.userID === userId);
      setCategories(userCategories);
  };
    const fetchExpenses = async () => {
      const response = await axios.get('https://expense-application-c99f020l6-yatin-lakkarajus-projects.vercel.app/api/expenses');
      const userExpenses = response.data.filter(expense => expense.userID === userId);
      setExpenses(userExpenses);
      setFilteredExpenses(userExpenses); // Set filtered expenses to all initially
    };

    if (isLoaded && userId) {
      fetchExpenses();
      fetchCategories();
    }
  }, [userId, isLoaded]);

  const submit = (e) => {
    e.preventDefault();
    // Filtering expenses based on selected dates
    if (fromDate && toDate) {
      const filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return expenseDate >= from && expenseDate <= to;
      });
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses); // Reset to all expenses if no dates are selected
    }
  };

  const exportReport = () => {
    const doc = new jsPDF();
  
    // Add title
    doc.setFontSize(18);
    doc.text('Expense Report', 14, 20);
  
    // Prepare data for the table
    const tableData = filteredExpenses.map(expense => [expense.name, expense.amount, expense.category]);
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = (totalAmount / filteredExpenses.length) || 0;
  
    // Add table
    autoTable(doc, {
      head: [['Expense Name', 'Expense Amount', 'Expense Category']],
      body: tableData,
      startY: 30,
    });
  
    // Add sum and average
    doc.text(`Total Amount: ${totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Average Amount: ${averageAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
  
    // Prepare data for the chart
    const categories = {};
    filteredExpenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
  
    const data = {
      labels: Object.keys(categories),
      datasets: [{
        label: 'Expenses by Category',
        data: Object.values(categories),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
  
    // Create a temporary canvas for the chart
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Destroy any existing chart before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  
    // Create a new chart instance
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  
    // Convert the chart to an image and add it to the PDF
    setTimeout(() => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 14, doc.lastAutoTable.finalY + 30, 90, 50); // Adjust image size and position
  
      // Save the PDF
      doc.save('Expense_Report.pdf');
  
      // Clean up the temporary canvas
      chartRef.current.destroy();
    }, 500); // Small delay to ensure chart rendering is complete
  };
  

  return (
    <div>
      <div className='bg-white rounded-2xl shadow-lg max-w-3xl sm:max-w-sm mx-auto p-12'>
        <form onSubmit={submit}>
          <div className="mb-5">
            <label htmlFor="fromDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From Date</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="toDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">To Date</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
      </div>
      <div className='bg-white rounded-2xl shadow-lg max-w-3xl sm:max-w-sm mx-auto p-12 m-4'>
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Expense Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Expense Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Expense Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length !== 0 ? (
                filteredExpenses.map(expense => (
                  <tr key={expense._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button onClick={exportReport} className="mt-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Export Report</button>
        
      </div>
    </div>
  );
}

export default ViewExpenses;


