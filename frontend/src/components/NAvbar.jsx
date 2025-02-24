import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../style.css";

const Navbar =() => {
    const { token,logoutUser} = useContext(AuthContext);
    const navigate = useNavigate();

const handleLogout = () => {
    logoutUser();  
    navigate("/login");  
    };
    return (
        <nav className="navbar">
            <h2 className="navname">To Do List</h2>
            <div className="nav-button">
                {!token ?(
                    <>
                    <button onClick={() => navigate("/")} className="btn2">Home</button>
                    <button onClick={() => navigate("/login")} className="btn2">Login</button>
                    <button onClick={() => navigate("/signup")} className="btn2">Signup</button>
                    </>
                ) : (
                    <button onClick={handleLogout} className="btn3">Logout</button>
                
            )}
            </div>
        </nav>
    )
}

export default Navbar;