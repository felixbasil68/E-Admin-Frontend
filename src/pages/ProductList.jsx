import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiStar, FiX, FiSave } from 'react-icons/fi';
import { getAllProductsAPI, deleteProductAPI, updateProductAPI } from '../services/allApi';
import '../styles/main.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(['All']);
    
    // view/edit 
    const [viewingProduct, setViewProduct] = useState(null);
    const [editingProduct, setEditProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        rating: '',
        image: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, products]);
//display product
    const fetchProducts = async () => {
        try {
            const response = await getAllProductsAPI();
            if (response.status === 200) {
                setProducts(response.data);
                setFilteredProducts(response.data);

                //  categories sorting for product
                const uniqueCategories = ['All', ...new Set(response.data.map(p => p.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };
//sorting products
    const filterProducts = () => {
        let filtered = products;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    // View Product 
    const handleView = (product) => {
        setViewProduct(product);
        setEditProduct(null); 
    };

    // Edit Product 
    const handleEdit = (product) => {
        setEditProduct(product.id);
        setViewProduct(null); 
        setEditForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            category: product.category || '',
            stock: product.stock || 0,
            rating: product.rating || 0,
            image: product.image || ''
        });
    };

    // Edit Form Input Changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    // Save Edited Product
    const handleSaveEdit = async () => {
        try {
            const updatedProduct = {
                ...editForm,
                price: parseFloat(editForm.price) || 0,
                stock: parseInt(editForm.stock) || 0,
                rating: parseFloat(editForm.rating) || 0
            };

            const response = await updateProductAPI(editingProduct, updatedProduct);
            if (response.status === 200) {
                alert('Product updated successfully!');
                setEditProduct(null);
                fetchProducts(); 
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert('Error updating product');
        }
    };
//delete product
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

    const getStockColor = (stock) => {
        if (stock > 100) return '#90AB8B';
        if (stock > 20) return '#5A7863';
        return '#FF6B6B';
    };

    // Stars for Rating
    const renderStars = (rating) => {
        const safeRating = rating || 0;
        return [1, 2, 3, 4, 5].map((star) => (
            <FiStar
                key={star}
                className={star <= Math.floor(safeRating) ? "filled-star" : "empty-star"}
                size={12}
            />
        ));
    };

    if (loading) {
        return <div className="text-center py-5">Loading products...</div>;
    }

    return (
        <div className="product-list-page">
            {/* View Product Modal */}
            {viewingProduct && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" style={{ backgroundColor: '#EBF4DD' }}>
                            <div className="modal-header" style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}>
                                <h5 className="modal-title">Product Details</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setViewProduct(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <img 
                                            src={viewingProduct.image || ''}
                                            alt={viewingProduct.name || 'Product'}
                                            className="img-fluid rounded mb-3"
                                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h4 style={{ color: '#3B4953' }}>{viewingProduct.name || 'N/A'}</h4>
                                        <p className="text-muted">{viewingProduct.description || 'No description'}</p>
                                        
                                        <div className="mb-3">
                                            <strong style={{ color: '#5A7863' }}>Category:</strong>
                                            <span className="badge ms-2" style={{ backgroundColor: '#90AB8B', color: '#EBF4DD' }}>
                                                {viewingProduct.category || 'N/A'}
                                            </span>
                                        </div>
                                        
                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Price:</strong>
                                                <h5 className="mt-1" style={{ color: '#3B4953' }}>
                                                    ${viewingProduct.price?.toLocaleString() || '0'}
                                                </h5>
                                            </div>
                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Stock:</strong>
                                                <h5 className="mt-1" style={{ color: getStockColor(viewingProduct.stock || 0) }}>
                                                    {viewingProduct.stock || 0} units
                                                </h5>
                                            </div>
                                        </div>
                                        
                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Rating:</strong>
                                                <div className="d-flex align-items-center mt-1">
                                                    <span className="me-2" style={{ color: '#3B4953' }}>
                                                        {viewingProduct.rating || 0}
                                                    </span>
                                                    <div className="rating-small">
                                                        {renderStars(viewingProduct.rating)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Sales:</strong>
                                                <h5 className="mt-1" style={{ color: '#3B4953' }}>
                                                    {viewingProduct.sales?.toLocaleString() || 0}
                                                </h5>
                                            </div>
                                        </div>
                                        
                                        {viewingProduct.createdAt && (
                                            <div className="mb-3">
                                                <strong style={{ color: '#5A7863' }}>Created:</strong>
                                                <p className="mt-1">{viewingProduct.createdAt}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn" 
                                    style={{ backgroundColor: '#3B4953', color: '#EBF4DD' }}
                                    onClick={() => setViewProduct(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" style={{ backgroundColor: '#EBF4DD' }}>
                            <div className="modal-header" style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}>
                                <h5 className="modal-title">Edit Product</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setEditProduct(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" style={{ color: '#3B4953' }}>
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditChange}
                                                required
                                                style={{ borderColor: '#90AB8B' }}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" style={{ color: '#3B4953' }}>
                                                Category
                                            </label>
                                            <select
                                                className="form-select"
                                                name="category"
                                                value={editForm.category}
                                                onChange={handleEditChange}
                                                style={{ borderColor: '#90AB8B' }}
                                            >
                                                {categories.filter(cat => cat !== 'All').map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" style={{ color: '#3B4953' }}>
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows="3"
                                            value={editForm.description}
                                            onChange={handleEditChange}
                                            required
                                            style={{ borderColor: '#90AB8B' }}
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" style={{ color: '#3B4953' }}>
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="price"
                                                step="0.01"
                                                value={editForm.price}
                                                onChange={handleEditChange}
                                                required
                                                style={{ borderColor: '#90AB8B' }}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" style={{ color: '#3B4953' }}>
                                                Stock Quantity
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="stock"
                                                value={editForm.stock}
                                                onChange={handleEditChange}
                                                required
                                                style={{ borderColor: '#90AB8B' }}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" style={{ color: '#3B4953' }}>
                                                Rating (1-5)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="rating"
                                                min="1"
                                                max="5"
                                                step="0.1"
                                                value={editForm.rating}
                                                onChange={handleEditChange}
                                                required
                                                style={{ borderColor: '#90AB8B' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" style={{ color: '#3B4953' }}>
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="image"
                                            value={editForm.image}
                                            onChange={handleEditChange}
                                            placeholder="https://example.com/image.jpg"
                                            style={{ borderColor: '#90AB8B' }}
                                        />
                                        {editForm.image && (
                                            <div className="mt-2">
                                                <img 
                                                    src={editForm.image} 
                                                    alt="Preview" 
                                                    className="img-thumbnail"
                                                    style={{ maxHeight: '100px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn" 
                                    style={{ backgroundColor: '#FF6B6B', color: '#EBF4DD' }}
                                    onClick={() => setEditProduct(null)}
                                >
                                    <FiX /> Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn" 
                                    style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}
                                    onClick={handleSaveEdit}
                                >
                                    <FiSave /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Product List Content */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#3B4953' }}>Product Inventory</h2>
                <span className="badge" style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}>
                    Total: {filteredProducts.length} products
                </span>
            </div>

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#EBF4DD', color: '#3B4953' }}>
                            <FiSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ borderColor: '#90AB8B' }}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#EBF4DD', color: '#3B4953' }}>
                            <FiFilter />
                        </span>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ borderColor: '#90AB8B' }}
                        >
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead style={{ backgroundColor: '#3B4953', color: '#EBF4DD' }}>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Rating</th>
                            <th>Sales</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} style={{ backgroundColor: '#EBF4DD' }}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={product.image || ''}
                                            alt={product.name || 'Product'}
                                            className="me-3 rounded"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <strong style={{ color: '#3B4953' }}>{product.name || 'N/A'}</strong>
                                            <p className="mb-0 small text-muted">{(product.description || '').substring(0, 50)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: '#90AB8B', color: '#EBF4DD' }}>
                                        {product.category || 'N/A'}
                                    </span>
                                </td>
                                <td style={{ color: '#5A7863', fontWeight: 'bold' }}>
                                    ${product.price?.toLocaleString() || '0'}
                                </td>
                                <td>
                                    <span className="badge" style={{
                                        backgroundColor: getStockColor(product.stock || 0),
                                        color: '#EBF4DD'
                                    }}>
                                        {product.stock || 0} units
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="me-1" style={{ color: '#5A7863' }}>
                                            {product.rating || 0}
                                        </span>
                                        <div className="rating-small">
                                            {renderStars(product.rating)}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}>
                                        {product.sales?.toLocaleString() || 0}
                                    </span>
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-sm me-1"
                                            style={{ backgroundColor: '#EBF4DD', color: '#3B4953' }}
                                            onClick={() => handleView(product)}
                                            title="View Details"
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            className="btn btn-sm me-1"
                                            style={{ backgroundColor: '#90AB8B', color: '#EBF4DD' }}
                                            onClick={() => handleEdit(product)}
                                            title="Edit Product"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button 
                                            className="btn btn-sm"
                                            style={{ backgroundColor: '#FF6B6B', color: '#EBF4DD' }}
                                            onClick={() => handleDelete(product.id)}
                                            title="Delete Product"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-5" style={{ color: '#5A7863' }}>
                    <h4>No products found</h4>
                    <p>Try changing your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
