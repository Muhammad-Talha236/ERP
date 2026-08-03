// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for headers (includes token)
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('accessToken');
    
    // 🔥 YEH 2 LINES ADD KAREIN (Console mein check karne ke liye)
    console.log("Token retrieved from localStorage:", token); 
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  // 🔥 YEH BHI ADD KAREIN (Pura header console mein dekhein)
  console.log("Final Headers being sent:", headers);
  
  return headers;
};

// GET request
export const get = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'GET request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('GET Error:', error);
    throw error;
  }
};

// POST request
export const post = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'POST request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

// PUT request
export const put = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'PUT request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('PUT Error:', error);
    throw error;
  }
};

// DELETE request
export const del = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'DELETE request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('DELETE Error:', error);
    throw error;
  }
};

// API object export (named export - useCreateTenant ke liye)
export const api = {
  get,
  post,
  put,
  delete: del,
};