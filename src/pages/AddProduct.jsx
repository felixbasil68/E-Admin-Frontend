import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX } from 'react-icons/fi';
import { getAllProductsAPI, addProductAPI, updateProductAPI, deleteProductAPI } from '../services/allApi';
import '../styles/main.css';

const AddProduct = () => {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '',
        image: '',
        rating: ''
    });
    const [categories] = useState(['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty']);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getAllProductsAPI();
            if (response.status === 200) {
                setProducts(response.data);
               
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    console.log(formData)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                rating: parseFloat(formData.rating),
                sales: 0,
                createdAt: new Date().toISOString().split('T')[0]
            };
//edit and add api
            if (editingId) {
                const response = await updateProductAPI(editingId, productData);
                if (response.status === 200) {
                    alert('Product updated successfully!');
                    setEditingId(null);
                    resetForm();
                    fetchProducts();
                }
            } else {
                const response = await addProductAPI(productData);
                if (response.status === 201) {
                    alert('Product added successfully!');
                    console.log()
                    resetForm();
                    fetchProducts();
                }
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert('Error saving product');
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image,
            rating: product.rating
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await deleteProductAPI(id);
                if (response.status === 200) {
                    alert('Product deleted successfully!');
                    fetchProducts();
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert('Error deleting product');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Electronics',
            stock: '',
            image: '',
            rating: ''
        });
        setEditingId(null);
    };

    return (
        <div className="add-product-page">
            <h2 className="mb-4" style={{ color: '#3B4953' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card p-4" style={{ backgroundColor: '#EBF4DD' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label" style={{ color: '#3B4953' }}>Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label" style={{ color: '#3B4953' }}>Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ color: '#3B4953' }}>Price ($)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ color: '#3B4953' }}>Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ color: '#3B4953' }}>Category</label>
                                    <select
                                        className="form-select"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ color: '#3B4953' }}>Rating (1-5)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" style={{ color: '#3B4953' }}>Image URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn flex-grow-1"
                                    style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}>
                                    {editingId ? <FiSave className="me-1" /> : <FiPlus className="me-1" />}
                                    {editingId ? 'Update Product' : 'Add Product'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn"
                                        style={{ backgroundColor: '#FF6B6B', color: '#EBF4DD' }}
                                        onClick={resetForm}>
                                        <FiX /> Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="card-header" style={{ backgroundColor: '#3B4953', color: '#EBF4DD' }}>
                            <h5 className="mb-0">Product List</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead style={{ backgroundColor: '#90AB8B', color: '#EBF4DD' }}>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td style={{ color: '#3B4953' }}>{product.name}</td>
                                                <td>
                                                    <span className="badge"
                                                        style={{ backgroundColor: '#90AB8B', color: '#EBF4DD' }}>
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td style={{ color: '#5A7863', fontWeight: 'bold' }}>
                                                    ${product.price}
                                                </td>
                                                <td>
                                                    <span className={`badge ${product.stock < 20 ? 'bg-danger' : 'bg-success'}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm me-1"
                                                        style={{ backgroundColor: '#EBF4DD', color: '#3B4953' }}
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{ backgroundColor: '#FF6B6B', color: '#EBF4DD' }}
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;