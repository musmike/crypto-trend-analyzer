import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
    const [data, setData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8089/auth/login";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.token);
            window.location = "/details";
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Sign In</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />

                        {error && <div className={styles.error_msg}>{error}</div>}

                        <button type="submit" className={styles.login_btn}>
                            Sign In
                        </button>
                    </form>
                </div>

                <div className={styles.right}>
                    <h1>New Here?</h1>
                    <Link to="/register">
                        <button type="button" className={styles.register_btn}>
                            Create Account
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;