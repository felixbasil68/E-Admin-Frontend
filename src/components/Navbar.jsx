import { Link } from 'react-router-dom';
import { FiHome, FiPackage, FiPlusCircle, FiList, FiBarChart2, FiShoppingBag } from 'react-icons/fi';
import '../styles/main.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#3B4953' }}>
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <FiShoppingBag className="me-2" size={24} />
                    <span>E-Admin</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/">
                                <FiHome className="me-1" />
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/products">
                                <FiPackage className="me-1" />
                                Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/add-product">
                                <FiPlusCircle className="me-1" />
                                Add Product
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/product-list">
                                <FiList className="me-1" />
                                Product List
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/analytics">
                                <FiBarChart2 className="me-1" />
                                Analytics
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;