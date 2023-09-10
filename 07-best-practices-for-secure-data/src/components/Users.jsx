import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get("/users", { signal: controller.signal });
                const usernames = response.data.map(user => user.username);
                console.log(response.data);
                isMounted && setUsers(usernames);
            } catch (err) {
                console.error(err);
                navigate("/login", { state: { from: location }, replace: true });
            }
        }

        getUsers();

        // cleanup function
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <article>
            <h2>Users List</h2>
            {users?.length ? (
                <ul>
                    {users.map((username, i) => (
                        <li key={i}>{username}</li>
                    ))}
                </ul>
            ) : (
                <p>no users to display</p>
            )}
        </article>
    );
};

export default Users;