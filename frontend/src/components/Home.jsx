import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";


const Home = () => {
    const { user } = useContext(AuthContext);  
    const username = user?.username || localStorage.getItem("username") || "Guest"; 

    return (
        <div>
            <div className="home-container">
                <h1>Welcome, {username}!</h1>
            </div>
        </div>
    );
};

export default Home;
