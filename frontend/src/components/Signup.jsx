import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmpassword: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate("/login");
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <form className="formcont" onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmpassword" placeholder="Confirm Password" onChange={handleChange} required />
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;
