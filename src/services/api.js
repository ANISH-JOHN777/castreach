// API Service - Template for future backend integration
// This file provides a structure for making API calls when backend is ready

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...defaultOptions,
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    login: async (email, password, role) => {
        if (MOCK_API) {
            // Mock implementation (current behavior)
            return {
                user: {
                    id: Date.now(),
                    email,
                    role,
                    name: email.split('@')[0],
                },
                token: 'mock_token_' + Date.now(),
            };
        }
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        });
    },

    signup: async (email, password, role, name) => {
        if (MOCK_API) {
            return {
                user: {
                    id: Date.now(),
                    email,
                    role,
                    name,
                },
                token: 'mock_token_' + Date.now(),
            };
        }
        return apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, role, name }),
        });
    },

    logout: async () => {
        if (MOCK_API) return { success: true };
        return apiCall('/auth/logout', { method: 'POST' });
    },

    refreshToken: async () => {
        if (MOCK_API) return { token: 'mock_token_' + Date.now() };
        return apiCall('/auth/refresh', { method: 'POST' });
    },
};

// User API
export const userAPI = {
    getProfile: async (userId) => {
        if (MOCK_API) return null;
        return apiCall(`/users/${userId}`);
    },

    updateProfile: async (userId, data) => {
        if (MOCK_API) return { ...data, id: userId };
        return apiCall(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    uploadAvatar: async (userId, file) => {
        if (MOCK_API) return { avatarUrl: URL.createObjectURL(file) };

        const formData = new FormData();
        formData.append('avatar', file);

        return apiCall(`/users/${userId}/avatar`, {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
        });
    },
};

// Discover API
export const discoverAPI = {
    searchGuests: async (filters) => {
        if (MOCK_API) return { guests: [], total: 0 };
        return apiCall('/discover/guests', {
            method: 'POST',
            body: JSON.stringify(filters),
        });
    },

    searchHosts: async (filters) => {
        if (MOCK_API) return { hosts: [], total: 0 };
        return apiCall('/discover/hosts', {
            method: 'POST',
            body: JSON.stringify(filters),
        });
    },
};

// Booking API
export const bookingAPI = {
    create: async (bookingData) => {
        if (MOCK_API) return { id: Date.now(), ...bookingData };
        return apiCall('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },

    getAll: async (userId) => {
        if (MOCK_API) return [];
        return apiCall(`/bookings?userId=${userId}`);
    },

    getById: async (bookingId) => {
        if (MOCK_API) return null;
        return apiCall(`/bookings/${bookingId}`);
    },

    update: async (bookingId, data) => {
        if (MOCK_API) return { id: bookingId, ...data };
        return apiCall(`/bookings/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    cancel: async (bookingId) => {
        if (MOCK_API) return { success: true };
        return apiCall(`/bookings/${bookingId}`, {
            method: 'DELETE',
        });
    },
};

// Message API
export const messageAPI = {
    getConversations: async (userId) => {
        if (MOCK_API) return [];
        return apiCall(`/messages/conversations?userId=${userId}`);
    },

    getMessages: async (conversationId) => {
        if (MOCK_API) return [];
        return apiCall(`/messages/${conversationId}`);
    },

    send: async (conversationId, message) => {
        if (MOCK_API) return { id: Date.now(), ...message };
        return apiCall(`/messages/${conversationId}`, {
            method: 'POST',
            body: JSON.stringify(message),
        });
    },
};

// Payment API
export const paymentAPI = {
    createPaymentIntent: async (amount, bookingId) => {
        if (MOCK_API) return { clientSecret: 'mock_secret' };
        return apiCall('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify({ amount, bookingId }),
        });
    },

    confirmPayment: async (paymentIntentId) => {
        if (MOCK_API) return { success: true };
        return apiCall('/payments/confirm', {
            method: 'POST',
            body: JSON.stringify({ paymentIntentId }),
        });
    },
};

// Review API
export const reviewAPI = {
    create: async (reviewData) => {
        if (MOCK_API) return { id: Date.now(), ...reviewData };
        return apiCall('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    },

    getByUser: async (userId) => {
        if (MOCK_API) return [];
        return apiCall(`/reviews?userId=${userId}`);
    },
};

export default {
    auth: authAPI,
    user: userAPI,
    discover: discoverAPI,
    booking: bookingAPI,
    message: messageAPI,
    payment: paymentAPI,
    review: reviewAPI,
};
