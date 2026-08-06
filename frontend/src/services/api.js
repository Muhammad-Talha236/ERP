// frontend/src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for headers (includes token + fallback mock token)
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    // Check for token in localStorage (fallback to mock-token if empty)
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || 'mock-token-123';
    
    console.log("Token retrieved for API:", token);
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  console.log("Final Headers being sent:", headers);
  return headers;
};

/**
 * buildQueryString — turns { search: 'ali', department: 'all' } into
 * '?search=ali&department=all', skipping empty/undefined values so
 * we don't send junk like '?department=all' when 'all' just means
 * "no filter" (backend already treats missing param the same way).
 */
const buildQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `?${query}` : '';
};

// GET request — now supports { params } just like axios does,
// e.g. api.get('/employees', { params: { search: 'ali' } })
export const get = async (endpoint, options = {}) => {
  try {
    const queryString = buildQueryString(options.params);
    const response = await fetch(`${API_URL}${endpoint}${queryString}`, {
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

// PATCH request
export const patch = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'PATCH request failed');
    }

    return response.json();
  } catch (error) {
    console.error('PATCH Error:', error);
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

// Named Export Object
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;