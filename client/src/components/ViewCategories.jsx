import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

function ViewCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const { userId, isLoaded } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get('https://expense-application-c99f020l6-yatin-lakkarajus-projects.vercel.app/api/categories');
            const userCategories = response.data.filter(category => category.userID === userId);
            setCategories(userCategories);
        };
        if (isLoaded && userId) {
            fetchCategories();
        }
    }, [isLoaded, userId]);

    const handleAddCategoryClick = () => {
        setIsAdding(true);
    };

    const handleInputChange = (event) => {
        setNewCategory(event.target.value);
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            try {
                const response = await axios.post('https://expense-application-c99f020l6-yatin-lakkarajus-projects.vercel.app/api/categories', { name: newCategory, userID: userId });
                setCategories([...categories, response.data]);
                setNewCategory('');
                setIsAdding(false);
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await axios.delete(`https://expense-application-c99f020l6-yatin-lakkarajus-projects.vercel.app/api/categories/${categoryId}`);
            setCategories(categories.filter(category => category._id !== categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleEditClick = (category) => {
        setEditCategoryId(category._id);
        setEditCategoryName(category.name);
    };

    const handleEditChange = (event) => {
        setEditCategoryName(event.target.value);
    };

    const handleEditSubmit = async (categoryId) => {
        try {
            const response = await axios.put(`https://expense-application-c99f020l6-yatin-lakkarajus-projects.vercel.app/api/categories/${categoryId}`, { name: editCategoryName });
            setCategories(categories.map(category => 
                category._id === categoryId ? { ...category, name: response.data.name } : category
            ));
            setEditCategoryId(null);
            setEditCategoryName('');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleEditKeyPress = (event, categoryId) => {
        if (event.key === 'Enter') {
            handleEditSubmit(categoryId);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='mx-auto my-auto bg-white rounded-2xl shadow-lg p-12'>
                <table className=''>
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length !== 0 && categories.map((category) => (
                            <tr key={category._id}>
                                <td>
                                    {editCategoryId === category._id ? (
                                        <input
                                            type="text"
                                            value={editCategoryName}
                                            onChange={handleEditChange}
                                            onKeyPress={(e) => handleEditKeyPress(e, category._id)}
                                            autoFocus
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td>
                                    <button className='m-2' onClick={() => handleEditClick(category)}><MdEdit /></button>
                                    <button className='m-2' onClick={() => handleDelete(category._id)}><MdOutlineDelete /></button>
                                </td>
                            </tr>
                        ))}

                        {isAdding && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter new category"
                                        autoFocus
                                    />
                                </td>
                                <td>
                                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button onClick={handleAddCategoryClick} className='justify-center'><IoMdAdd /></button>
            </div>
        </div>
    );
}

export default ViewCategories;



