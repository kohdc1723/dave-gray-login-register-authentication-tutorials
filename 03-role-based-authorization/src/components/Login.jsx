import React, { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const usernameRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "/auth",
                JSON.stringify({ username, password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ username, password, roles, accessToken });

            setUsername("");
            setPassword("");
            console.log(from);
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("no server response");
            } else if (err.response?.status === 400) {
                setErrorMessage("missing username or password");
            } else if (err.response?.status === 401) {
                setErrorMessage("unauthorized");
            } else {
                setErrorMessage("login failed");
            }

            errorRef.current.focus();
        }
    };

    return (
        <section>
            <p
                ref={errorRef}
                className={errorMessage ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errorMessage}
            </p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={usernameRef}
                    autoComplete="off"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <button>Login</button>
            </form>
            <p>
                Need an account?<br />
                <span className="line">
                    <a href="#">Register</a>
                </span>
            </p>
        </section>
    );
};

export default Login;