// DSOG Franchise Platform Configuration
const CONFIG = {
    // Google Apps Script Web App URL (Update this after deployment)
    BACKEND_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Application Settings
    APP_NAME: 'DSOG Franchise Platform',
    VERSION: '3.0.0',
    COMPANY_NAME: 'DSOG (Divine Sense of Grace)',
    SUPPORT_EMAIL: 'office.dsog@gmail.com',
    SUPPORT_PHONE: '0733 737 983',
    
    // Google OAuth Configuration
    GOOGLE_OAUTH: {
        // REPLACE with your actual Google Client ID from Google Cloud Console
        CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        
        // Allowed email addresses for Google Sign-In
        ALLOWED_EMAILS: [
            'admin@dsog.com',
            'office.dsog@gmail.com',
            // Add specific franchise partner emails here
            // 'franchise1@example.com',
            // 'franchise2@example.com',
        ],
        
        // Allowed domains for Google Sign-In
        ALLOWED_DOMAINS: [
            'dsog.com',
            'gmail.com',
            // Add allowed domains here
            // 'yourdomain.com',
        ],
        
        // Google OAuth Scopes
        SCOPES: [
            'email',
            'profile'
        ]
    },
    
    // API Endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: '?action=login',
        GOOGLE_LOGIN: '?action=google_login',
        REGISTER_USER: '?action=register_user',
        VERIFY_TOKEN: '?action=verify_token',
        LOGOUT: '?action=logout',
        RESET_PASSWORD: '?action=reset_password',
        
        // Products
        GET_PRODUCTS: '?action=get_products',
        GET_PRODUCT_CATEGORIES: '?action=get_product_categories',
        GET_PRODUCT_SUPPLIERS: '?action=get_product_suppliers',
        SEARCH_PRODUCTS: '?action=search_products',
        GET_PRODUCT_DETAILS: '?action=get_product_details',
        
        // Orders
        GET_ORDERS: '?action=get_orders',
        PLACE_ORDER: '?action=place_order',
        GET_ORDER_HISTORY: '?action=get_order_history',
        CANCEL_ORDER: '?action=cancel_order',
        GET_ORDER_STATUS: '?action=get_order_status',
        
        // Marketing Materials
        GET_MATERIALS: '?action=get_marketing_materials',
        GET_MATERIAL_CATEGORIES: '?action=get_material_categories',
        DOWNLOAD_MATERIAL: '?action=download_material',
        
        // Operational Updates
        GET_UPDATES: '?action=get_operational_updates',
        GET_ANNOUNCEMENTS: '?action=get_announcements',
        GET_NOTIFICATIONS: '?action=get_notifications',
        
        // Franchise Management
        GET_STATS: '?action=get_franchise_stats',
        GET_PROFILE: '?action=get_franchise_profile',
        UPDATE_PROFILE: '?action=update_franchise_profile',
        GET_PERFORMANCE: '?action=get_franchise_performance',
        GET_COMMISSIONS: '?action=get_commissions',
        
        // System
        CHECK_STATUS: '?action=status',
        GET_CONFIG: '?action=get_config',
        LOG_ACTIVITY: '?action=log_activity'
    },
    
    // Application Defaults
    DEFAULTS: {
        DEFAULT_SUPPLIER: 'HOG Creations',
        DEFAULT_CURRENCY: 'KES',
        DEFAULT_LANGUAGE: 'en',
        DEFAULT_TIMEZONE: 'Africa/Nairobi',
        ITEMS_PER_PAGE: 12,
        AUTO_LOGOUT_MINUTES: 30,
        SESSION_TIMEOUT_MINUTES: 60
    },
    
    // UI Configuration
    UI: {
        THEME: 'light', // 'light' or 'dark'
        PRIMARY_COLOR: '#2c3e50',
        SECONDARY_COLOR: '#3498db',
        SUCCESS_COLOR: '#27ae60',
        WARNING_COLOR: '#f39c12',
        ERROR_COLOR: '#e74c3c',
        INFO_COLOR: '#3498db',
        BORDER_RADIUS: '8px',
        BOX_SHADOW: '0 4px 6px rgba(0, 0, 0, 0.1)',
        TRANSITION_SPEED: '0.3s'
    },
    
    // Feature Flags
    FEATURES: {
        ENABLE_GOOGLE_LOGIN: true,
        ENABLE_EMAIL_LOGIN: true,
        ENABLE_REGISTRATION: false, // Manual registration by admin only
        ENABLE_PASSWORD_RESET: true,
        ENABLE_ORDER_TRACKING: true,
        ENABLE_REAL_TIME_UPDATES: false,
        ENABLE_MULTI_LANGUAGE: false,
        ENABLE_DARK_MODE: true,
        ENABLE_OFFLINE_MODE: false
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        USER: 'dsog_user',
        TOKEN: 'dsog_token',
        AUTH_METHOD: 'auth_method',
        SETTINGS: 'dsog_settings',
        CART: 'dsog_cart',
        FAVORITES: 'dsog_favorites',
        LAST_VISIT: 'dsog_last_visit'
    },
    
    // Validation Rules
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PASSWORD_MIN_LENGTH: 8,
        PHONE_REGEX: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        NAME_REGEX: /^[a-zA-Z\s]{2,50}$/
    },
    
    // Error Messages
    MESSAGES: {
        LOGIN_FAILED: 'Invalid email or password. Please try again.',
        GOOGLE_LOGIN_FAILED: 'Google authentication failed. Please try again.',
        UNAUTHORIZED_EMAIL: 'Your email is not authorized to access the DSOG Franchise Portal. Please contact support.',
        NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        SESSION_EXPIRED: 'Your session has expired. Please login again.',
        INVALID_TOKEN: 'Invalid authentication token. Please login again.',
        EMAIL_REQUIRED: 'Email address is required.',
        PASSWORD_REQUIRED: 'Password is required.',
        EMAIL_INVALID: 'Please enter a valid email address.',
        PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
        ORDER_SUCCESS: 'Order placed successfully!',
        ORDER_FAILED: 'Failed to place order. Please try again.',
        UPDATE_SUCCESS: 'Update successful!',
        UPDATE_FAILED: 'Update failed. Please try again.'
    },
    
    // URLs
    URLS: {
        DASHBOARD: 'dashboard.html',
        LOGIN: 'index.html',
        PRODUCTS: 'products.html',
        ORDERS: 'orders.html',
        MARKETING: 'marketing.html',
        UPDATES: 'updates.html',
        PROFILE: 'profile.html',
        SETTINGS: 'settings.html',
        HELP: 'help.html',
        TERMS: 'terms.html',
        PRIVACY: 'privacy.html',
        CONTACT: 'contact.html'
    },
    
    // Initialize function
    init: function() {
        console.log(`🚀 ${this.APP_NAME} v${this.VERSION} initialized`);
        console.log(`🏢 ${this.COMPANY_NAME}`);
        console.log(`🔗 Backend URL: ${this.BACKEND_URL}`);
        console.log(`📧 Support: ${this.SUPPORT_EMAIL}`);
        console.log(`📞 Phone: ${this.SUPPORT_PHONE}`);
        
        // Set theme from localStorage or default
        const savedTheme = localStorage.getItem('dsog_theme') || this.UI.THEME;
        this.setTheme(savedTheme);
        
        // Check for Google OAuth configuration
        if (this.FEATURES.ENABLE_GOOGLE_LOGIN && 
            this.GOOGLE_OAUTH.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
            console.warn('⚠️ Google OAuth Client ID not configured! Google Sign-In will not work.');
            console.info('ℹ️ Get your Client ID from: https://console.cloud.google.com/');
        }
        
        return this;
    },
    
    // Helper function to set theme
    setTheme: function(theme) {
        this.UI.THEME = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dsog_theme', theme);
        
        // Update theme color meta tag
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : this.UI.PRIMARY_COLOR;
        }
        
        console.log(`🎨 Theme set to: ${theme}`);
    },
    
    // Toggle theme
    toggleTheme: function() {
        const newTheme = this.UI.THEME === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    // Check if email is allowed for Google Sign-In
    isEmailAllowed: function(email) {
        if (!email || !this.VALIDATION.EMAIL_REGEX.test(email)) {
            return false;
        }
        
        const lowerEmail = email.toLowerCase();
        const domain = lowerEmail.split('@')[1];
        
        // Check specific emails
        if (this.GOOGLE_OAUTH.ALLOWED_EMAILS.some(allowed => 
            allowed.toLowerCase() === lowerEmail)) {
            return true;
        }
        
        // Check domains
        if (domain && this.GOOGLE_OAUTH.ALLOWED_DOMAINS.some(allowed => 
            domain === allowed.toLowerCase())) {
            return true;
        }
        
        return false;
    },
    
    // Get user's default dashboard URL based on role
    getDashboardUrl: function(userRole = 'franchise') {
        const roleUrls = {
            'admin': 'admin-dashboard.html',
            'supervisor': 'supervisor-dashboard.html',
            'franchise': 'dashboard.html',
            'supplier': 'supplier-dashboard.html'
        };
        
        return roleUrls[userRole] || this.URLS.DASHBOARD;
    },
    
    // Format currency
    formatCurrency: function(amount, currency = this.DEFAULTS.DEFAULT_CURRENCY) {
        const formatter = new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        return formatter.format(amount);
    },
    
    // Format date
    formatDate: function(date, format = 'medium') {
        const dateObj = date instanceof Date ? date : new Date(date);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return dateObj.toLocaleDateString('en-KE', options);
    },
    
    // Get API URL with parameters
    getApiUrl: function(action, params = {}) {
        // Check if endpoint exists
        if (!this.ENDPOINTS[action]) {
            console.error(`Endpoint "${action}" not found in CONFIG.ENDPOINTS`);
            return `${this.BACKEND_URL}?action=${action}`;
        }
        
        let url = `${this.BACKEND_URL}${this.ENDPOINTS[action]}`;
        
        // Add parameters
        const paramString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        if (paramString) {
            url += (url.includes('?') ? '&' : '?') + paramString;
        }
        
        return url;
    },
    
    // Get authentication headers
    getAuthHeaders: function() {
        const token = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
        
        if (!token) {
            return {
                'Content-Type': 'application/json'
            };
        }
        
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },
    
    // Validate form data
    validateForm: function(formData, rules) {
        const errors = {};
        
        for (const [field, value] of Object.entries(formData)) {
            if (rules[field] && rules[field].required && !value) {
                errors[field] = `${field} is required`;
            }
            
            if (field === 'email' && value && !this.VALIDATION.EMAIL_REGEX.test(value)) {
                errors[field] = 'Please enter a valid email address';
            }
            
            if (field === 'password' && value && value.length < this.VALIDATION.PASSWORD_MIN_LENGTH) {
                errors[field] = `Password must be at least ${this.VALIDATION.PASSWORD_MIN_LENGTH} characters`;
            }
            
            if (field === 'phone' && value && !this.VALIDATION.PHONE_REGEX.test(value)) {
                errors[field] = 'Please enter a valid phone number';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
};

// Initialize configuration
const Config = CONFIG.init();

// Global helper function for backward compatibility
function getApiUrl(action, params = {}) {
    return Config.getApiUrl(action, params);
}

// Export for module usage (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
