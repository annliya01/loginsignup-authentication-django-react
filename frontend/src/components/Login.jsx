import React, { useState, useContext } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);

            console.log("Login Response:", response.data);
            const newaccess = response.data.access;
            const username = formData.username;

            loginUser(newaccess,username);
            navigate("/todo");
        } catch (error) {
            console.error("Login Error", error.response? error.response.data:error);
            alert("Invalid credentials");
        }
    };

    return (
        <form className="formcont" onSubmit={handleSubmit}>
            <h3 className="form-title">Login</h3>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
            <p><a href="/forgot-password">Forgot Password?</a></p>
        </form>
    );
};

export default Login;
