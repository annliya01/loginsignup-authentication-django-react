import { createContext,useState,useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Navigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children}) =>{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token")||null);
    const [refreshToken,setRefreshToken] = useState(localStorage.getItem("refresh")||null);
    const [username,setUsername] = useState(localStorage.getItem("username") || "Guest");

    const refreshAccessToken =useCallback( async () => {
        try {
            if (!refreshToken) return;
            const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/",{refresh: refreshToken});
            localStorage.setItem("token", res.data.access);
            setToken(res.data.access);
        }catch{
            alert("session expired");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            setToken(null);
            setUser(null);
            Navigate("/login");
        }
    },[refreshToken]);

    useEffect(() => {
        if(token) {
            console.log("Access Token:", token);
            try{
                const decodedUser =jwtDecode(token);
                setUser(decodedUser);
                setUsername(localStorage.getItem("username") || "Guest");

                localStorage.setItem("username", decodedUser.username || "Guest");
                const expireTime = decodedUser.exp * 1000;
                const timeUntilRefresh = expireTime - Date.now() - 60000; // 1 min before expiry

                if (timeUntilRefresh > 0) {
                    const timeout = setTimeout(() => refreshAccessToken(), timeUntilRefresh);
                    return () => clearTimeout(timeout);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                logoutUser();
            }
        }
    }, [token, refreshAccessToken]);


    const loginUser = (newAccess,newRefresh) => {
        const decodedUser = jwtDecode(newAccess);
        console.log("Decoded User:", decodedUser);
        const username = decodedUser.username || "User";  

        localStorage.setItem("token",newAccess);
        localStorage.setItem("username",username);
        setToken(newAccess);
        setUsername(username);
    };
    const logoutUser = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
    
        setToken(null);
        setUser(null);
        setRefreshToken(null);
        setUsername(null);
    };

    return(
        <AuthContext.Provider value={{user,username, loginUser,logoutUser, token}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;