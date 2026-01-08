import React, { useState, useEffect } from 'react';
import { FiStar, FiShoppingCart, FiEye, FiX } from 'react-icons/fi';
import { getAllProductsAPI } from '../services/allApi';
import '../styles/main.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    // get product
    const fetchProducts = async () => {
        try {
            setLoading(true); 
            const response = await getAllProductsAPI();
            if (response.status === 200) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false); 
        }
    };
//star rating
    const renderStars = (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FiStar
                    key={i}
                    className={i <= Math.floor(rating) ? "filled-star" : "empty-star"}
                />
            );
        }
        return stars;
    };

    const handleViewProduct = (product) => {
        setViewingProduct(product);
    };

    const handleCloseView = () => {
        setViewingProduct(null);
    };

    return (
        <div className="products-page">
            <h2 className="mb-4" style={{ color: '#3B4953' }}>Product Catalog</h2>

            {loading && <p>Loading products...</p>}

            {/* View Product Modal */}
            {viewingProduct && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" style={{ backgroundColor: '#EBF4DD' }}>
                            <div
                                className="modal-header"
                                style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}
                            >
                                <h5 className="modal-title">Product Details</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseView}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <img
                                            src={viewingProduct.image}
                                            alt={viewingProduct.name}
                                            className="img-fluid rounded mb-3"
                                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <h4 style={{ color: '#3B4953' }}>
                                            {viewingProduct.name}
                                        </h4>

                                        <p className="text-muted">
                                            {viewingProduct.description}
                                        </p>

                                        <div className="mb-3">
                                            <strong style={{ color: '#5A7863' }}>Category:</strong>
                                            <span
                                                className="badge ms-2"
                                                style={{ backgroundColor: '#90AB8B', color: '#EBF4DD' }}
                                            >
                                                {viewingProduct.category}
                                            </span>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Price:</strong>
                                                <h5 className="mt-1" style={{ color: '#3B4953' }}>
                                                    ${viewingProduct.price}
                                                </h5>
                                            </div>

                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Stock:</strong>
                                                <h5
                                                    className="mt-1"
                                                    style={{
                                                        color:
                                                            viewingProduct.stock < 20
                                                                ? '#FF6B6B'
                                                                : '#3B4953'
                                                    }}
                                                >
                                                    {viewingProduct.stock} units
                                                </h5>
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Rating:</strong>
                                                <div className="d-flex align-items-center mt-1">
                                                    <span className="me-2" style={{ color: '#3B4953' }}>
                                                        {viewingProduct.rating ?? 0}
                                                    </span>
                                                    <div className="rating">
                                                        {renderStars(viewingProduct.rating)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <strong style={{ color: '#5A7863' }}>Sales:</strong>
                                                <h5 className="mt-1" style={{ color: '#3B4953' }}>
                                                    {viewingProduct.sales?.toLocaleString() || "0"} 
                                                </h5>
                                            </div>
                                        </div>

                                        {viewingProduct.createdAt && (
                                            <div className="mb-3">
                                                <strong style={{ color: '#5A7863' }}>Added:</strong>
                                                <p className="mt-1">{viewingProduct.createdAt}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn me-2"
                                    style={{ backgroundColor: '#3B4953', color: '#EBF4DD' }}
                                >
                                    <FiShoppingCart /> Add to Cart
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ backgroundColor: '#FF6B6B', color: '#EBF4DD' }}
                                    onClick={handleCloseView}
                                >
                                    <FiX /> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* product mapping */}
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                        <div className="card h-100 product-card">
                            <div className="card-img-wrapper">
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div
                                    className="card-badge"
                                    style={{ backgroundColor: '#90AB8B' }}
                                >
                                    {product.category}
                                </div>
                            </div>

                            <div className="card-body">
                                <h5 className="card-title" style={{ color: '#3B4953' }}>
                                    {product.name}
                                </h5>

                                <p className="card-text text-muted">
                                    {product.description?.substring(0, 80)}...
                                </p>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="rating">
                                        {renderStars(product.rating)}
                                        <span className="ms-1">{product.rating ?? 0}</span>
                                    </div>

                                    <span
                                        className="stock-badge"
                                        style={{
                                            backgroundColor:
                                                product.stock > 100
                                                    ? '#90AB8B'
                                                    : product.stock > 20
                                                    ? '#5A7863'
                                                    : '#FF6B6B',
                                            color: '#EBF4DD'
                                        }}
                                    >
                                        Stock: {product.stock}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 style={{ color: '#5A7863' }}>
                                        ${product.price}
                                    </h4>

                                    <div>
                                        <button
                                            className="btn btn-sm me-1"
                                            style={{ backgroundColor: '#EBF4DD', color: '#3B4953' }}
                                            onClick={() => handleViewProduct(product)}
                                        >
                                            <FiEye /> View
                                        </button>
                                        <button
                                            className="btn btn-sm"
                                            style={{ backgroundColor: '#3B4953', color: '#EBF4DD' }}
                                        >
                                            <FiShoppingCart /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer" style={{ backgroundColor: '#EBF4DD' }}>
                                <small className="text-muted">
                                    Sales: {product.sales?.toLocaleString() || "0"} units 
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
