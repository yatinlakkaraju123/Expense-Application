import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

function AddExpenses() {
    const [categories, setCategories] = useState([]);
    const [expenseName, setExpenseName] = useState('');
    const [cost, setCost] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const { userId, isLoaded } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:5000/api/categories');
            const userCategories = response.data.filter(category => category.userID === userId);
            setCategories(userCategories);
        };
        if (isLoaded && userId) {
            fetchCategories();
        }
    }, [isLoaded, userId]);

    const submit = async (e) => {
        e.preventDefault();
        
        // Check if the form fields are filled
        if (!expenseName || !cost || !selectedCategory) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const newExpense = {
                name: expenseName,
                amount: Number(cost),
                category: String(selectedCategory),
                userID: userId
            };

            // Send the new expense to your backend
            const response = await axios.post('http://localhost:5000/api/expenses', newExpense);
            alert("Expense added successfully!");
            
            // Reset form fields after submission
            setExpenseName('');
            setCost('');
            setSelectedCategory('');
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Failed to add expense. Please try again.");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='mx-auto my-auto'>
                <div className='flex align-items justify-center '>
                    <div className='bg-white rounded-2xl shadow-lg max-w-3xl mx-auto p-12'>
                        <form onSubmit={submit}>
                            <div className="mb-5">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter the Expense Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={expenseName}
                                    onChange={(e) => setExpenseName(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Expense Name"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="cost" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter the cost</label>
                                <input
                                    type="number"
                                    id="cost"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an expense Category</label>
                                <select
                                    id="categories"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                >
                                    <option value="">Choose a Category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpenses;

