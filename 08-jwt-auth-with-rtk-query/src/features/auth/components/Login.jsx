import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../authApiSlice";

const Login = () => {
    const usernameRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, password]);

    // handlers
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await login({ username, password }).unwrap();
            dispatch(setCredentials({ ...userData, username }));

            setUsername("");
            setPassword("");
            navigate("/welcome");
        } catch (err) {
            if (!err?.originalStatus) {
                setErrMsg("no server response");
            } else if (err.originalStatus === 400) {
                setErrMsg("missing username or password");
            } else if (err.originalStatus === 401) {
                setErrMsg("unauthorized");
            } else {
                setErrMsg("login failed");
            }

            errorRef.current.focus();
        }
    };
    const handleUsernameInput = e => setUsername(e.target.value);
    const handlePasswordInput = e => setPassword(e.target.value);

    return (isLoading ? (
        <h1>Loading...</h1>
    ) : (
        <section className="login">
            <p
                ref={errorRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errMsg}
            </p>

            <h1>Employee Login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={usernameRef}
                    value={username}
                    onChange={handleUsernameInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePasswordInput}
                    value={password}
                    required
                />
                
                <button>Sign In</button>
            </form>
        </section>
    ));
};

export default Login;