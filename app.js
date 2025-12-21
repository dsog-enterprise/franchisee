// DSOG Franchise Platform - Frontend Application

class DSOGFrontend {
    constructor() {
        this.currentUser = null;
        this.googleInitialized = false;
        this.init();
    }
    
    init() {
        // Check for existing session
        this.checkSession();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize Google OAuth
        this.initGoogleAuth();
        
        // Check backend connection
        this.checkBackend();
    }
    
    initGoogleAuth() {
        // Only initialize Google OAuth on login page
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname.endsWith('/')) {
            
            // Configuration for Google OAuth
            this.googleConfig = {
                GOOGLE_CLIENT_ID: '369304497158-8ub6b68v2bjvsfciome6q56flh2rd1m4.apps.googleusercontent.com',
                ALLOWED_EMAILS: [
                    'office.dsog@gmail.com',
                    'franchise@dsog.com',
                    'partner@dsog.com',
                    'office.dsog@gmail.com'
                    // Add more allowed emails here
                ],
                ALLOWED_DOMAINS: [
                    'dsog.com',
                    'gmail.com'  // Add your allowed domains
                ]
            };
            
            // Load Google Identity Services if not already loaded
            if (!window.google) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => this.setupGoogleAuth();
                document.head.appendChild(script);
            } else {
                this.setupGoogleAuth();
            }
        }
    }
    
    setupGoogleAuth() {
        try {
            window.google.accounts.id.initialize({
                client_id: this.googleConfig.GOOGLE_CLIENT_ID,
                callback: (response) => this.handleGoogleResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true,
                context: 'signin',
                ux_mode: 'popup'
            });
            
            // Render Google button if container exists
            const googleButtonContainer = document.getElementById('googleSignInBtn');
            if (googleButtonContainer) {
                window.google.accounts.id.renderButton(
                    googleButtonContainer,
                    {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: '100%'
                    }
                );
            }
            
            this.googleInitialized = true;
            console.log('✅ Google OAuth initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Google OAuth:', error);
        }
    }
    
    async handleGoogleResponse(response) {
        console.log('Google response received');
        
        try {
            // Show loading state
            this.showMessage('Verifying Google account...', 'warning');
            
            // Parse the JWT token
            const payload = this.parseJwt(response.credential);
            const email = payload.email;
            const domain = payload.hd || email.split('@')[1];
            
            // Validate email against whitelist
            if (!this.isEmailAllowed(email, domain)) {
                this.showMessage(
                    'Your email is not authorized to access the DSOG Franchise Portal. ' +
                    'Please contact support at office.dsog@gmail.com or use email/password login if you have credentials.',
                    'error'
                );
                return;
            }
            
            // Send to your backend for authentication
            const result = await this.authenticateWithGoogle(response.credential, email);
            
            if (result.success) {
                // Save user session
                localStorage.setItem('dsog_user', JSON.stringify(result.user));
                localStorage.setItem('dsog_token', result.token || response.credential);
                localStorage.setItem('auth_method', 'google');
                
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage(result.message || 'Authentication failed', 'error');
            }
            
        } catch (error) {
            console.error('Google login error:', error);
            this.showMessage('An error occurred during Google authentication.', 'error');
        }
    }
    
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return {};
        }
    }
    
    isEmailAllowed(email, domain) {
        if (!email) return false;
        
        const lowerEmail = email.toLowerCase();
        
        // Check specific emails
        if (this.googleConfig.ALLOWED_EMAILS.some(allowed => 
            allowed.toLowerCase() === lowerEmail)) {
            return true;
        }
        
        // Check domains
        if (domain && this.googleConfig.ALLOWED_DOMAINS.some(allowed => 
            domain.toLowerCase() === allowed.toLowerCase())) {
            return true;
        }
        
        // Check email domain from email string
        const emailDomain = lowerEmail.split('@')[1];
        if (emailDomain && this.googleConfig.ALLOWED_DOMAINS.some(allowed => 
            emailDomain === allowed.toLowerCase())) {
            return true;
        }
        
        return false;
    }
    
    async authenticateWithGoogle(token, email) {
        try {
            // Call your Google Apps Script backend
            const response = await fetch(getApiUrl('GOOGLE_LOGIN', { 
                token: token,
                email: email 
            }));
            
            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                // If user doesn't exist in backend, check if we should create account
                if (data.message && data.message.includes('not found')) {
                    return await this.registerGoogleUser(email, token);
                }
                return data;
            }
            
        } catch (error) {
            console.error('Backend authentication error:', error);
            
            // Fallback: create minimal user session
            return {
                success: true,
                user: {
                    email: email,
                    name: email.split('@')[0],
                    auth_method: 'google'
                }
            };
        }
    }
    
    async registerGoogleUser(email, token) {
        try {
            // Call backend to register user
            const response = await fetch(getApiUrl('REGISTER_USER', {
                email: email,
                name: email.split('@')[0],
                auth_method: 'google',
                token: token
            }));
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage('New account created. Welcome to DSOG Franchise Portal!', 'success');
                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to create account. Please contact support.'
                };
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed. Please try again later.'
            };
        }
    }
    
    async checkBackend() {
        try {
            const response = await fetch(getApiUrl('status'));
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Backend connected:', data.message);
            } else {
                console.warn('⚠️ Backend issue:', data.message);
            }
        } catch (error) {
            console.error('❌ Cannot connect to backend:', error);
            this.showMessage('Cannot connect to server. Please check your internet connection.', 'error');
        }
    }
    
    async login() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            this.showMessage('Please enter both email and password', 'error');
            return;
        }
        
        const btn = document.getElementById('loginBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        btn.disabled = true;
        
        try {
            const response = await fetch(getApiUrl('LOGIN', { email, password }));
            const data = await response.json();
            
            if (data.success) {
                // Save user session
                localStorage.setItem('dsog_user', JSON.stringify(data.user));
                localStorage.setItem('dsog_token', data.token);
                localStorage.setItem('auth_method', 'email');
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                this.showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showMessage('Network error. Please try again.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
    
    checkSession() {
        const user = localStorage.getItem('dsog_user');
        const token = localStorage.getItem('dsog_token');
        
        if (user && token) {
            this.currentUser = JSON.parse(user);
            
            // If on login page but logged in, redirect to dashboard
            if (window.location.pathname.endsWith('index.html') || 
                window.location.pathname.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // If not on login page but not logged in, redirect to login
            if (!window.location.pathname.endsWith('index.html') && 
                !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    }
    
    logout() {
        // If user logged in with Google, also sign out from Google
        const authMethod = localStorage.getItem('auth_method');
        if (authMethod === 'google' && window.google && this.googleInitialized) {
            window.google.accounts.id.disableAutoSelect();
            window.google.accounts.id.revoke(localStorage.getItem('dsog_token'), done => {
                console.log('Google session revoked');
            });
        }
        
        // Clear local storage
        localStorage.removeItem('dsog_user');
        localStorage.removeItem('dsog_token');
        localStorage.removeItem('auth_method');
        
        // Redirect to login
        window.location.href = 'index.html';
    }
    
    async getProducts(category = null, supplier = null) {
        try {
            const params = {};
            if (category) params.category = category;
            if (supplier) params.supplier = supplier;
            
            const response = await fetch(getApiUrl('GET_PRODUCTS', params));
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return { success: false, message: 'Network error' };
        }
    }
    
    async searchProducts(query) {
        try {
            const response = await fetch(getApiUrl('SEARCH_PRODUCTS', { query }));
            return await response.json();
        } catch (error) {
            console.error('Error searching products:', error);
            return { success: false, message: 'Network error' };
        }
    }
    
    async placeOrder(orderData) {
        try {
            const response = await fetch(getApiUrl('PLACE_ORDER', orderData));
            return await response.json();
        } catch (error) {
            console.error('Error placing order:', error);
            return { success: false, message: 'Network error' };
        }
    }
    
    async getMarketingMaterials(category = null) {
        try {
            const params = {};
            if (category) params.category = category;
            
            const response = await fetch(getApiUrl('GET_MATERIALS', params));
            return await response.json();
        } catch (error) {
            console.error('Error fetching materials:', error);
            return { success: false, message: 'Network error' };
        }
    }
    
    async getOperationalUpdates() {
        try {
            const response = await fetch(getApiUrl('GET_UPDATES'));
            return await response.json();
        } catch (error) {
            console.error('Error fetching updates:', error);
            return { success: false, message: 'Network error' };
        }
    }
    
    async getFranchiseStats(franchiseId) {
        try {
            const response = await fetch(getApiUrl('GET_STATS', { franchise_id: franchiseId }));
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { success: false, message: 'Network error' };
        }
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.getElementById('loginMessage') || 
                          document.getElementById('message') || 
                          document.createElement('div');
        
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 
                              type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    
    initEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    modal.classList.remove('show');
                });
            }
            
            // Enter key in login form
            if (e.key === 'Enter') {
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                if (emailInput && document.activeElement === emailInput) {
                    passwordInput.focus();
                } else if (passwordInput && document.activeElement === passwordInput) {
                    this.login();
                }
            }
        });
    }
}

// Initialize frontend application
const app = new DSOGFrontend();

// Global functions for HTML onclick handlers
function login() {
    app.login();
}

function logout() {
    app.logout();
}

function showRegister() {
    app.showMessage('Contact DSOG at 0733 737 983 to apply for a franchise', 'info');
}

function showForgotPassword() {
    app.showMessage('Contact support at office.dsog@gmail.com for password reset', 'info');
}

// Google OAuth function
function signInWithGoogle() {
    if (window.google && app.googleInitialized) {
        window.google.accounts.id.prompt();
    } else {
        app.showMessage('Google Sign-In is not available. Please try the email login.', 'error');
    }
}
