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

            <h1><Link to="/" className={styles.navbarBrand}>Kryptowaluty</Link></h1>

            <ul className={styles.navLinks}>

                <li>
                    <Link to="/" className={styles.navLink}>Strona główna</Link>
                </li>

                <li>
                    <Link to="/details" className={styles.navLink}>Analiza kursów kryptowalut</Link>
                </li>

                {!user ? (
                    <>
                        <li>
                            <Link to="/login" className={styles.navLink}>Zaloguj się</Link>
                        </li>
                        <li>
                            <Link to="/register" className={styles.navLink}>Zarejestruj się</Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link onClick={handleLogout} to="/" className={styles.navLink}>
                            Wyloguj się
                        </Link>
                    </li>
                )}
            </ul>

        </nav>
    );
};

export default Navbar;
