import { Link } from 'react-router-dom';
import styles from "./styles.module.css";

const Navbar = () => {
    const user = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <nav className={styles.navbar}>
            <h1><Link to="/" className={styles.navbarBrand}>Crypto Trend Analyzer</Link></h1>

            <ul className={styles.navLinks}>
                <li>
                    <Link to="/" className={styles.navLink}>Home</Link>
                </li>
                <li>
                    <Link to="/details" className={styles.navLink}>Trend Analysis</Link>
                </li>
                {!user ? (
                    <>
                        <li>
                            <Link to="/login" className={styles.navLink}>Sign In</Link>
                        </li>
                        <li>
                            <Link to="/register" className={styles.navLink}>Sign Up</Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link onClick={handleLogout} to="/" className={styles.navLink}>
                            Sign Out
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;