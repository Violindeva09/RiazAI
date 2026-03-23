const API_BASE_URL = 'http://localhost:8080'; // Change for production

// Helper to handle API responses
async function handleResponse(response) {
    if (response.status === 401) {
        window.location.href = 'login.html?error=session_expired';
        throw new Error('Unauthorized');
    }
    
    // Some endpoints returning empty responses (like logout)
    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch(e) {
        data = text;
    }

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
}

// Ensure credentials (cookies) are sent with requests
const fetchOptions = {
    credentials: 'include',
    headers: {
        'Accept': 'application/json'
    }
};

const api = {
    login: async (username, password) => {
        // Spring Security expects application/x-www-form-urlencoded by default for form login
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            ...fetchOptions,
            headers: { ...fetchOptions.headers, 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        return handleResponse(response);
    },
    
    signup: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
            method: 'POST',
            ...fetchOptions,
            headers: { ...fetchOptions.headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return handleResponse(response);
    },
    
    logout: async () => {
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            ...fetchOptions
        });
        return handleResponse(response);
    },
    
    getUser: async () => {
        const response = await fetch(`${API_BASE_URL}/api/user`, {
            method: 'GET',
            ...fetchOptions
        });
        return handleResponse(response);
    },
    
    analyse: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/api/analyse`, {
            method: 'POST',
            ...fetchOptions,
            // Don't set Content-Type, browser will set it to multipart/form-data with boundary
            body: formData
        });
        return handleResponse(response);
    }
};
