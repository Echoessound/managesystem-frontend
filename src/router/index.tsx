// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import PersonalProfile from "../views/PersonalProfile";
const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/PersonalProfile',
        element: <PersonalProfile />,
    }
])

export default router