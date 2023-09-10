import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../authSlice";

const Welcome = () => {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    const welcome = user ? `Welcome ${user}!` : "Welcome!";
    const tokenAbbr = `${token.slice(0, 9)}...`;

    return (
        <section className="welcome">
            <h1>{welcome}</h1>
            <p>Token: {tokenAbbr}</p>
            <p><Link to="/userslist">Go to the users list</Link></p>
        </section>
    );
};

export default Welcome;