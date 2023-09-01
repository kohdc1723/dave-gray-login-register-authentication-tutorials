import React, { useState, useEffect, useRef } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
    const usernameRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USERNAME_REGEX.test(username);
        console.log(result);
        console.log(username);
        setValidUsername(result);
    }, [username]);

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPassword(result);

        const match = password === confirmPassword;
        setValidConfirmPassword(match);
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrorMessage("");
    }, [username, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isUsernameValid = USERNAME_REGEX.test(username);
        const isPasswordValid = PASSWORD_REGEX.test(password);
        if (!isUsernameValid || !isPasswordValid) {
            setErrorMessage("invalid username or password input");
            return;
        }

        try {
            const response = await axios.post(
                "/register",
                JSON.stringify({ username, password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
            // clear the input fields
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("no server response");
            } else if (err.response?.status === 409) {
                setErrorMessage("username already exists");
            } else {
                setErrorMessage("registration failed");
            }

            errorRef.current.focus();
        }
    };

    const registerForm = (
        <section>
            <p
                ref={errorRef}
                className={errorMessage ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errorMessage}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                {/* username */}
                <label htmlFor="username">
                    Username:
                    <span className={validUsername ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validUsername || !username ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    type="text"
                    id="username"
                    ref={usernameRef}
                    autoComplete="off"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    required
                    aria-invalid={validUsername ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUsernameFocus(true)}
                    onBlur={() => setUsernameFocus(false)}
                />
                <p
                    id="uidnote"
                    className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.<br />
                    Must begin with a letter.<br />
                    Letters, numbers, underscores, hyphens allowed.
                </p>

                {/* password */}
                <label htmlFor="password">
                    Password:
                    <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                />
                <p
                    id="pwdnote"
                    className={passwordFocus && !validPassword ? "instructions" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>

                {/* confirm password */}
                <label htmlFor="confirm-password">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validConfirmPassword && confirmPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validConfirmPassword || !confirmPassword ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="confirm-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                    aria-invalid={confirmPassword ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setConfirmPasswordFocus(true)}
                    onBlur={() => setConfirmPasswordFocus(false)}
                />
                <p
                    id="confirmnote"
                    className={confirmPasswordFocus && !validConfirmPassword ? "instructions" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>

                <button disabled={!validUsername || !validPassword || !validConfirmPassword}>Sign Up</button>
            </form>
            <p>
                Already registered?<br />
                <span className="line">
                    {/*put router link here*/}
                    <a href="#">Sign In</a>
                </span>
            </p>
        </section>
    );

    const successSection = (
        <section>
            <h1>Success!</h1>
            <p>
                <a href="#">Sign In</a>
            </p>
        </section>
    );

    return (success
        ? successSection
        : registerForm
    );
};

export default Register;