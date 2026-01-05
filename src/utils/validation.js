// Form validation utilities

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

export const validateName = (name) => {
    if (!name) {
        return 'Name is required';
    }
    if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (name.length > 50) {
        return 'Name must be less than 50 characters';
    }
    return null;
};

export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`;
    }
    return null;
};

export const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phone) {
        return 'Phone number is required';
    }
    if (!phoneRegex.test(phone)) {
        return 'Please enter a valid phone number';
    }
    if (phone.replace(/\D/g, '').length < 10) {
        return 'Phone number must be at least 10 digits';
    }
    return null;
};

export const validateUrl = (url) => {
    try {
        new URL(url);
        return null;
    } catch {
        return 'Please enter a valid URL';
    }
};

export const validatePrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) {
        return 'Price must be a number';
    }
    if (numPrice < 0) {
        return 'Price cannot be negative';
    }
    if (numPrice > 10000) {
        return 'Price cannot exceed $10,000';
    }
    return null;
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove potential XSS attacks
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

export const validateForm = (values, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = values[field];

        if (rule.required) {
            const error = validateRequired(value, rule.label || field);
            if (error) {
                errors[field] = error;
                return;
            }
        }

        if (rule.type === 'email') {
            const error = validateEmail(value);
            if (error) errors[field] = error;
        } else if (rule.type === 'password') {
            const error = validatePassword(value);
            if (error) errors[field] = error;
        } else if (rule.type === 'phone') {
            const error = validatePhone(value);
            if (error) errors[field] = error;
        } else if (rule.type === 'url') {
            const error = validateUrl(value);
            if (error) errors[field] = error;
        } else if (rule.type === 'price') {
            const error = validatePrice(value);
            if (error) errors[field] = error;
        }

        if (rule.custom && typeof rule.custom === 'function') {
            const error = rule.custom(value, values);
            if (error) errors[field] = error;
        }
    });

    return errors;
};
