// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
//路由配置(根据src导出的组件进行配置)
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import PersonalProfile from "../views/PersonalProfile";
import EditManage from "../component/Home/EditManage";
import AdminHome from "../views/AdminHome";
//创建并暴露路由
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
    },
    {
        path: '/edit/:id',
        element: <EditManage />,
    },
    {
        path: '/admin-home',
        element: <AdminHome />,
    },
])

export default router//导出路由