import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const signup = async (userData) => {
    return axios.post(`${API_BASE_URL}/signup/`, userData);
};

export const login = async (userData) => {
    return axios.post(`${API_BASE_URL}/login/`, userData);
};

export const fetchHome = async (token) => {
    return axios.get(`${API_BASE_URL}/home/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const requestPasswordReset = async (email) => {
    return axios.post(`${API_BASE_URL}/password-reset/`, { email });
};

export const resetPassword = async (uid, token, password) => {
    return axios.post(`${API_BASE_URL}/password-reset-confirm/${uid}/${token}/`, { password },{ headers: { "Content-Type": "application/json" } });
};

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTasks = async () => {
    const token = localStorage.getItem("token"); 
    return axios.get(`${API_BASE_URL}/tasks/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const createTask = async (task) => {
    return axios.post(`${API_BASE_URL}/tasks/`, task, {
        headers: getAuthHeaders(),
    });
};

// export const updateTask = async (id, task) => {
//     return axios.put(`${API_BASE_URL}/tasks/${id}/`, task, {
//         headers: getAuthHeaders(),
//     });
// };

export const deleteTask = async (id) => {
    return axios.delete(`${API_BASE_URL}/tasks/${id}/`, {
        headers: getAuthHeaders(),
    });
};
export const updateTask = async (id, task) => {
    console.log("Updating task data:", task); 
    return axios.put(`${API_BASE_URL}/tasks/${id}/`, task, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",  
        },
    });
};
