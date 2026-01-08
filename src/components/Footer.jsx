import '../styles/main.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3" style={{ backgroundColor: '#3B4953', color: '#EBF4DD' }}>
            <div className="container text-center">
                <p className="mb-0">
                    © {new Date().getFullYear()} E-Commerce Admin Dashboard.
                </p>
               
            </div>
        </footer>
    );
};

export default Footer;