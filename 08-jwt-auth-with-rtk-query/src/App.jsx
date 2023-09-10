import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, Public } from "./components";
import { Login, RequireAuth, Welcome } from "./features/auth/components";
import { UsersList } from "./features/users/components";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                {/* protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="userslist" element={<UsersList />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;