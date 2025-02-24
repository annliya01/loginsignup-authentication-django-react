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
export const getTasks = (page) => axios.get(`${API_BASE_URL}?page=${page}`);
export const createTask = (task) => axios.post(API_BASE_URL, task);
export const updateTask = (id, task) => axios.put(`${API_BASE_URL}${id}/`, task);
export const deleteTask = (id) => axios.delete(`${API_BASE_URL}${id}/`);