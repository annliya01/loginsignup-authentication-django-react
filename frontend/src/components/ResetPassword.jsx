import React,{useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import {resetPassword} from "../api"

const ResetPassword=()=>{
    const{uid,token}=useParams();
    const[password,setPassword]=useState("");
    const[message,setMessage]=useState("");
    const navigate =useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
    
        try {
            console.log("Sending request to:", `http://127.0.0.1:8000/password-reset-confirm/${uid}/${token}/`);
    
            const response = await resetPassword(uid, token, password)
    
            if (response.data.error) {
                setMessage(response.data.error);
            } else {
                setMessage(response.data.message || "Password reset successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error) {
            console.error("Error resetting password:", error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.error || "Error resetting password. Please try again.");
        }
    };
    
    return(
        <div className="form-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Enter new password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <button type="submit">Reset Password</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default ResetPassword;