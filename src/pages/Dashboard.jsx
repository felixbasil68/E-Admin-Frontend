import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiShoppingCart, FiAlertTriangle } from 'react-icons/fi';
import { getAllProductsAPI, getAnalyticsAPI } from '../services/allApi'; // Added getAnalyticsAPI back
import '../styles/main.css';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staticAnalytics, setStaticAnalytics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        monthlySales: [],
        topCategories: []
    });
    

    const [dynamicStats, setDynamicStats] = useState({
        totalProducts: 0,
        lowStock: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // actual products for  calculations
            const productsResponse = await getAllProductsAPI();
            if (productsResponse.status === 200) {
                const productsData = productsResponse.data;
                setProducts(productsData);
                calculateDynamicStats(productsData);
            }
            
            //  static analytics for total orders and revenue
            const analyticsResponse = await getAnalyticsAPI();
            if (analyticsResponse.status === 200) {
                setStaticAnalytics({
                    totalRevenue: analyticsResponse.data.totalRevenue || 0,
                    totalOrders: analyticsResponse.data.totalOrders || 0,
                    monthlySales: analyticsResponse.data.monthlySales || [],
                    topCategories: analyticsResponse.data.topCategories || []
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDynamicStats = (products) => {
        if (!products || products.length === 0) {
            setDynamicStats({
                totalProducts: 0,
                lowStock: 0
            });
            return;
        }

        // Calcula values from actual products
        const totalProducts = products.length;
        const lowStock = products.filter(product => product.stock < 20).length;
         const highStock = products.filter(product => product.stock > 100).length;

        setDynamicStats({
            totalProducts,
            lowStock,
            highStock
        });
    };

    const stats = [
        {
            title: "Total Products",
            value: dynamicStats.totalProducts, 
            icon: <FiPackage size={24} />,
            color: "#90AB8B",
            bgColor: "#EBF4DD",
            description: `Actual items in inventory`,
            type: "dynamic"
        },
        {
            title: "Total Revenue",
            value: `$${staticAnalytics.totalRevenue?.toLocaleString() || '0'}`, 
            color: "#5A7863",
            bgColor: "#EBF4DD",
            description: `Revenue overview`,
            type: "static"
        },
        {
            title: "Total Orders",
            value: staticAnalytics.totalOrders?.toLocaleString() || '0', 
            icon: <FiShoppingCart size={24} />,
            color: "#3B4953",
            bgColor: "#EBF4DD",
            description: `Total orders placed`,
            type: "static"
        },
        {
            title: "Low Stock Items",
            value: dynamicStats.lowStock,
            icon: <FiAlertTriangle size={24} />,
            color: "#FF6B6B",
            bgColor: "#FFE8E8",
            description: `Need restocking (stock < 20)`,
            type: "dynamic"
        }
    ];

    if (loading) {
        return <div className="text-center py-5">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <h2 className="mb-4" style={{ color: '#3B4953' }}>Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="row mb-4">
                {stats.map((stat, index) => (
                    <div className="col-md-3 col-sm-6 mb-3" key={index}>
                        <div className="stat-card p-3 rounded" style={{ backgroundColor: stat.bgColor }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-muted mb-0">{stat.title}</h6>
                                        <span className={`badge ms-2 ${stat.type === 'dynamic' ? 'bg-info' : 'bg-secondary'}`} 
                                              style={{ fontSize: '10px', padding: '2px 6px' }}>
                                            {stat.type === 'dynamic' ? 'Live' : 'Fixed'}
                                        </span>
                                    </div>
                                    <h3 style={{ color: stat.color }}>{stat.value}</h3>
                                    <small className="text-muted">{stat.description}</small>
                                </div>
                                <div style={{ color: stat.color }}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Distr*/}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="p-3 rounded" style={{ backgroundColor: '#EBF4DD' }}>
                        <h5 style={{ color: '#3B4953' }}>Product Distribution</h5>
                        <div className="row mt-3">
                            <div className="col-md-4 text-center p-3">
                                <h2 style={{ color: '#5A7863' }}>{dynamicStats.totalProducts}</h2>
                                <p className="mb-0">Total Products</p>
                                <small className="text-muted">Actual count in inventory</small>
                            </div>
                            <div className="col-md-4 text-center p-3">
                                <h2 style={{ color: '#90AB8B' }}>
                                    {products.filter(p => p.stock >= 100).length}
                                </h2>
                                <p className="mb-0">High Stock Items</p>
                                <small className="text-muted">Stock ≥ 100</small>
                            </div>
                            <div className="col-md-4 text-center p-3">
                                <h2 style={{ color: dynamicStats.lowStock > 0 ? '#FF6B6B' : '#90AB8B' }}>
                                    {dynamicStats.lowStock}
                                </h2>
                                <p className="mb-0">Low Stock Alert</p>
                                <small className="text-muted">Stock &lt; 20</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart - Static Data */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="p-3 rounded" style={{ backgroundColor: '#EBF4DD', minHeight: '300px' }}>
                        <h5 style={{ color: '#3B4953' }}>Monthly Sales Trend (Static Data)</h5>
                        {staticAnalytics.monthlySales && staticAnalytics.monthlySales.length > 0 ? (
                            <div className="mt-3">
                                {staticAnalytics.monthlySales.map((item, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>{item.month}</span>
                                            <span>${item.sales?.toLocaleString() || '0'}</span>
                                        </div>
                                        <div className="progress" style={{ height: '10px' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${(item.sales / 20000) * 100}%`,
                                                    backgroundColor: '#5A7863'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4" style={{ color: '#5A7863' }}>
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="p-3 rounded" style={{ backgroundColor: '#EBF4DD', minHeight: '300px' }}>
                        <h5 style={{ color: '#3B4953' }}>Top Categories (Static Data)</h5>
                        {staticAnalytics.topCategories && staticAnalytics.topCategories.length > 0 ? (
                            <div className="mt-3">
                                {staticAnalytics.topCategories.map((item, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>{item.category}</span>
                                            <span>{item.percentage}%</span>
                                        </div>
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
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4" style={{ color: '#5A7863' }}>
                                <p>No category data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

           
        </div>
    );
};

export default Dashboard;