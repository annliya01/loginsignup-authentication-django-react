import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/NAvbar";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar /> 
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
