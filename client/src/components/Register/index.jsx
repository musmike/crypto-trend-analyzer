import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";

const Register = () => {
    const [data, setData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setError("Invalid email address format.");
            return;
        }

        try {
            const url = "http://localhost:8089/auth/register";
            await axios.post(url, data);
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data);
            }
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Already Registered?</h1>
                    <Link to="/login">
                        <button type="button" className={styles.login_btn}>
                            Sign In
                        </button>
                    </Link>
                </div>

                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            minLength={4}
                            maxLength={20}
                            required
                            className={styles.input}
                        />
                        <input 
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input 
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            minLength={4}
                            maxLength={20}
                            value={data.password}
                            required
                            className={styles.input}
                        />

                        {error && <div className={styles.error_msg}>{error}</div>}

                        <button type="submit" className={styles.register_btn}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;