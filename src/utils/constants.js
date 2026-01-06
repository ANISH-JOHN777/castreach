// Application Constants

// App Info
export const APP_NAME = 'CastReach';
export const APP_VERSION = '0.3.0';
export const APP_DESCRIPTION = 'Connect. Record. Grow.';

// User Roles
export const USER_ROLES = {
    GUEST: 'guest',
    HOST: 'host',
};

// Booking Status
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Message Status
export const MESSAGE_STATUS = {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};

// Availability Status
export const AVAILABILITY_STATUS = {
    AVAILABLE: 'Available',
    LIMITED: 'Limited',
    UNAVAILABLE: 'Unavailable',
};

// Podcast Categories
export const PODCAST_CATEGORIES = [
    'Business',
    'Technology',
    'Health & Fitness',
    'Education',
    'Comedy',
    'News & Politics',
    'True Crime',
    'Sports',
    'Arts',
    'Science',
    'Society & Culture',
    'Music',
    'History',
    'Entertainment',
    'Self-Improvement',
];

// Price Ranges
export const PRICE_RANGES = {
    MIN: 0,
    MAX: 1000,
    DEFAULT_MIN: 0,
    DEFAULT_MAX: 1000,
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_ITEMS_PER_PAGE: 12,
    MAX_ITEMS_PER_PAGE: 50,
};

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav'],
};

// Validation
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    BIO_MAX_LENGTH: 500,
    MESSAGE_MAX_LENGTH: 1000,
};

// Toast Notification Durations
export const TOAST_DURATION = {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
};

// Debounce Delays
export const DEBOUNCE_DELAY = {
    SEARCH: 500,
    INPUT: 300,
    RESIZE: 150,
};

// Breakpoints (must match CSS)
export const BREAKPOINTS = {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
};

// Routes
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    DISCOVER: '/discover',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PROFILE: '/profile',
    BOOKINGS: '/bookings',
    MESSAGES: '/messages',
    GUEST_DASHBOARD: '/guest/dashboard',
    HOST_DASHBOARD: '/host/dashboard',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_USER: 'castreach_user',
    AUTH_TOKEN: 'auth_token',
    THEME: 'theme',
    LANGUAGE: 'language',
    RECENT_SEARCHES: 'recent_searches',
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        PROFILE: '/users/:id',
        UPDATE: '/users/:id',
        AVATAR: '/users/:id/avatar',
    },
    DISCOVER: {
        GUESTS: '/discover/guests',
        HOSTS: '/discover/hosts',
    },
    BOOKINGS: {
        LIST: '/bookings',
        CREATE: '/bookings',
        GET: '/bookings/:id',
        UPDATE: '/bookings/:id',
        CANCEL: '/bookings/:id',
    },
    MESSAGES: {
        CONVERSATIONS: '/messages/conversations',
        MESSAGES: '/messages/:conversationId',
        SEND: '/messages/:conversationId',
    },
    PAYMENTS: {
        CREATE_INTENT: '/payments/create-intent',
        CONFIRM: '/payments/confirm',
    },
    REVIEWS: {
        CREATE: '/reviews',
        LIST: '/reviews',
    },
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Welcome back!',
    SIGNUP: 'Account created successfully!',
    LOGOUT: 'Logged out successfully.',
    PROFILE_UPDATED: 'Profile updated successfully!',
    BOOKING_CREATED: 'Booking created successfully!',
    MESSAGE_SENT: 'Message sent!',
    REVIEW_SUBMITTED: 'Review submitted successfully!',
};

export default {
    APP_NAME,
    APP_VERSION,
    APP_DESCRIPTION,
    USER_ROLES,
    BOOKING_STATUS,
    MESSAGE_STATUS,
    PAYMENT_STATUS,
    AVAILABILITY_STATUS,
    PODCAST_CATEGORIES,
    PRICE_RANGES,
    PAGINATION,
    FILE_UPLOAD,
    VALIDATION,
    TOAST_DURATION,
    DEBOUNCE_DELAY,
    BREAKPOINTS,
    ROUTES,
    STORAGE_KEYS,
    API_ENDPOINTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
};
