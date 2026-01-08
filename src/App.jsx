import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductList';
import Analytics from './pages/Analytics';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles/main.css';

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="content-wrapper">
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/product-list" element={<ProductList />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
