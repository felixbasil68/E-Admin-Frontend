import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiUsers, FiShoppingBag, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import { getAnalyticsAPI, getAllProductsAPI } from '../services/allApi';
import '../styles/main.css';

const Analytics = () => {
    const [staticAnalytics, setStaticAnalytics] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('monthly');
    
    
    const [liveStats, setLiveStats] = useState({
        totalProducts: 0,
        lowStock: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch analytics
            const analyticsResponse = await getAnalyticsAPI();
            if (analyticsResponse.status === 200) {
                setStaticAnalytics(analyticsResponse.data);
            }
            
            // Fetch products
            const productsResponse = await getAllProductsAPI();
            if (productsResponse.status === 200) {
                const productsData = productsResponse.data;
                setProducts(productsData);
                
                // Calculate product
                const totalProducts = productsData.length;
                const lowStock = productsData.filter(product => product.stock < 20).length;
                
                setLiveStats({
                    totalProducts,
                    lowStock
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading analytics...</div>;
    }

    return (
        <div className="analytics-page">
    
            <div className="row mb-4">
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="stat-card p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3" style={{ color: '#90AB8B' }}>
                                <FiTrendingUp size={28} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0">Growth Rate</h6>
                                <h3 style={{ color: '#5A7863' }}>24.5%</h3>
                                <small className="text-muted">Static Data</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="stat-card p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3" style={{ color: '#90AB8B' }}>
                                <FiDollarSign size={28} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0">Avg. Order Value</h6>
                                <h3 style={{ color: '#5A7863' }}>$128.50</h3>
                                <small className="text-muted">Static Data</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="stat-card p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3" style={{ color: '#90AB8B' }}>
                                <FiUsers size={28} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0">Customer Satisfaction</h6>
                                <h3 style={{ color: '#5A7863' }}>92%</h3>
                                <small className="text-muted">Static Data</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                    <div className="stat-card p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3" style={{ color: '#90AB8B' }}>
                                <FiShoppingBag size={28} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-0">Conversion Rate</h6>
                                <h3 style={{ color: '#5A7863' }}>3.8%</h3>
                                <small className="text-muted">Static Data</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Inventory  */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="stat-card p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3" style={{ color: '#90AB8B' }}>
                                <FiPackage size={28} />
                            </div>
                            <div>
                                <div className="d-flex align-items-center">
                                    <h6 className="text-muted mb-0 me-2">Total Products</h6>
                                    <span className="badge bg-info" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                        LIVE
                                    </span>
                                </div>
                                <h3 style={{ color: '#5A7863' }}>{liveStats.totalProducts}</h3>
                                <small className="text-muted">
                                    Actual count from inventory
                                    {products.length > 0 && (
                                        <span className="ms-2">
                                            ({products.filter(p => p.stock >= 100).length} high stock)
                                        </span>
                                    )}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="stat-card p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3" style={{ 
                                color: liveStats.lowStock > 0 ? '#FF6B6B' : '#90AB8B' 
                            }}>
                                <FiAlertTriangle size={28} />
                            </div>
                            <div>
                                <div className="d-flex align-items-center">
                                    <h6 className="text-muted mb-0 me-2">Low Stock Items</h6>
                                    <span className="badge bg-info" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                        LIVE
                                    </span>
                                </div>
                                <h3 style={{ 
                                    color: liveStats.lowStock > 0 ? '#FF6B6B' : '#5A7863' 
                                }}>
                                    {liveStats.lowStock}
                                </h3>
                                <small className="text-muted">
                                    Products with stock &lt; 20
                                    {liveStats.lowStock > 0 && (
                                        <span className="ms-2 text-danger">
                                            (Needs attention!)
                                        </span>
                                    )}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card p-3" style={{ backgroundColor: '#EBF4DD', minHeight: '400px' }}>
                        <h5 style={{ color: '#3B4953' }}>Sales Performance</h5>
                        <small className="text-muted">Static Data</small>
                        {staticAnalytics?.monthlySales && (
                            <div className="mt-3">
                                {staticAnalytics.monthlySales.map((item, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span style={{ color: '#3B4953' }}>{item.month}</span>
                                            <span style={{ color: '#5A7863', fontWeight: 'bold' }}>
                                                ${item.sales.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="progress" style={{ height: '15px' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${(item.sales / 20000) * 100}%`,
                                                    backgroundColor: index % 2 === 0 ? '#90AB8B' : '#5A7863'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card p-3" style={{ backgroundColor: '#EBF4DD', minHeight: '400px' }}>
                        <h5 style={{ color: '#3B4953' }}>Revenue Distribution</h5>
                        <small className="text-muted">Static Data</small>
                        {staticAnalytics?.topCategories && (
                            <div className="mt-4">
                                {staticAnalytics.topCategories.map((item, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span style={{ color: '#3B4953' }}>{item.category}</span>
                                            <span style={{ color: '#5A7863', fontWeight: 'bold' }}>
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 me-2">
                                                <div className="progress" style={{ height: '12px' }}>
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${item.percentage}%`,
                                                            backgroundColor: index % 2 === 0 ? '#90AB8B' : '#5A7863'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div style={{ width: '40px', textAlign: 'right' }}>
                                                <span style={{ color: '#5A7863' }}>
                                                    ${(staticAnalytics.totalRevenue * item.percentage / 100).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card p-3" style={{ backgroundColor: '#EBF4DD' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 style={{ color: '#3B4953' }}>Inventory Health</h5>
                            <span className="badge" style={{ backgroundColor: '#5A7863', color: '#EBF4DD' }}>
                                Live Data
                            </span>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-4 text-center">
                                <div className="p-3 rounded" style={{ backgroundColor: '#90AB8B',height:"125px", color: '#EBF4DD' }}>
                                    <h2>{liveStats.totalProducts}</h2>
                                    <p className="mb-0">Total Products</p>
                                    <small>Live Inventory Count</small>
                                </div>
                            </div>
                            <div className="col-md-4 text-center">
                                <div className="p-3 rounded" style={{ backgroundColor: '#5A7863',height:"125px", color: '#EBF4DD' }}>
                                    <h2>{liveStats.lowStock}</h2>
                                    <p className="mb-0">Low Stock Items</p>
                                    <small>Stock &lt; 20</small>
                                </div>
                            </div>
                            <div className="col-md-4 text-center">
                                <div className="p-3 rounded" style={{ backgroundColor: '#3B4953',height:"125px", color: '#EBF4DD' }}>
                                    <h2>{staticAnalytics?.totalOrders?.toLocaleString() || 0}</h2>
                                    <p className="mb-0">Total Orders</p>
                                  
                                </div>
                            </div>
                        </div>
                        
                        {/* Additional Live  */}
                        {products.length > 0 && (
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h6 style={{ color: '#3B4953' }}>Live Product Distribution</h6>
                                    <div className="row mt-2">
                                        <div className="col-md-3 text-center">
                                            <div className="p-2">
                                                <h5 style={{ color: '#5A7863' }}>{products.filter(p => p.stock >= 100).length}</h5>
                                                <small>High Stock (≥100)</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 text-center">
                                            <div className="p-2">
                                                <h5 style={{ color: '#90AB8B' }}>
                                                    {products.filter(p => p.stock >= 20 && p.stock < 100).length}
                                                </h5>
                                                <small>Medium Stock (20-99)</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 text-center">
                                            <div className="p-2">
                                                <h5 style={{ color: '#FF6B6B' }}>{liveStats.lowStock}</h5>
                                                <small>Low Stock (&lt;20)</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 text-center">
                                            <div className="p-2">
                                                <h5 style={{ color: '#3B4953' }}>
                                                    {Object.keys(products.reduce((acc, p) => {
                                                        acc[p.category] = true;
                                                        return acc;
                                                    }, {})).length}
                                                </h5>
                                                <small>Categories</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
          
        </div>
    );
};

export default Analytics;