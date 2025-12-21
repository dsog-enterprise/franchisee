// DSOG Franchise Platform - Frontend Application

class DSOGFrontend {
    constructor() {
        this.currentUser = null;
        this.googleInitialized = false;
        this.init();
    }
    
    init() {
        // Configuration for Google OAuth
        this.config = {
            GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com',
            ALLOWED_EMAILS: [
                'admin@dsog.com',
                'franchise@dsog.com',
                'partner@dsog.com'
                // Add more allowed emails here
            ],
            ALLOWED_DOMAINS: [
                'dsog.com',
                'dsogfranchise.com'
                // Add allowed domains here
            ],
            GOOGLE_BACKEND_VERIFY_URL: 'https://your-backend.com/api/verify-google-token'
        };
        
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
    
    setupGoogleAuth() {
        try {
            window.google.accounts.id.initialize({
                client_id: this.config.GOOGLE_CLIENT_ID,
                callback: (response) => this.handleGoogleResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true,
                context: 'signin',
                ux_mode: 'popup',
                itp_support: true
            });
            
            // Render Google button
            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInBtn'),
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
            
            // Verify the Google token
            const result = await this.verifyGoogleToken(response.credential);
            
            if (result.success) {
                // Save user session
                localStorage.setItem('dsog_user', JSON.stringify(result.user));
                localStorage.setItem('dsog_token', result.token);
                localStorage.setItem('auth_method', 'google');
                
                // Check if this is a new user
                if (result.isNewUser) {
                    this.showMessage('Welcome! Please complete your franchise profile.', 'success');
                    // Redirect to profile setup
                    setTimeout(() => {
                        window.location.href = 'profile-setup.html';
                    }, 2000);
                } else {
                    this.showMessage('Login successful! Redirecting...', 'success');
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                }
            } else {
                this.showMessage(result.message || 'Google authentication failed', 'error');
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.showMessage('An error occurred during Google authentication.', 'error');
        }
    }
    
    async verifyGoogleToken(credential) {
        try {
            // Parse JWT to get basic info
            const payload = this.parseJwt(credential);
            
            // Extract email and domain
            const email = payload.email;
            const domain = payload.hd; // Hosted domain for G Suite/Workspace
            
            // Validate email against whitelist
            const emailAllowed = this.isEmailAllowed(email, domain);
            
            if (!emailAllowed) {
                return {
                    success: false,
                    message: 'Your email is not authorized to access the DSOG Franchise Portal. Please contact support at office.dsog@gmail.com'
                };
            }
            
            // OPTION 1: Send to backend for verification (RECOMMENDED)
            try {
                const backendResponse = await fetch(this.config.GOOGLE_BACKEND_VERIFY_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: credential,
                        clientId: this.config.GOOGLE_CLIENT_ID
                    })
                });
                
                if (backendResponse.ok) {
                    const backendData = await backendResponse.json();
                    return backendData;
                }
            } catch (backendError) {
                console.warn('Backend verification failed, using frontend validation:', backendError);
            }
            
            // OPTION 2: Frontend validation (fallback)
            // Check if user exists in your system
            const userExists = await this.checkUserExists(email);
            
            return {
                success: true,
                user: {
                    email: email,
                    name: payload.name || email.split('@')[0],
                    picture: payload.picture,
                    domain: domain,
                    auth_method: 'google'
                },
                token: credential,
                isNewUser: !userExists
            };
            
        } catch (error) {
            console.error('Token verification error:', error);
            return {
                success: false,
                message: 'Token verification failed'
            };
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
        if (this.config.ALLOWED_EMAILS.some(allowed => 
            allowed.toLowerCase() === lowerEmail)) {
            return true;
        }
        
        // Check domains
        if (domain && this.config.ALLOWED_DOMAINS.some(allowed => 
            domain.toLowerCase() === allowed.toLowerCase())) {
            return true;
        }
        
        // Check email domain from email string
        const emailDomain = lowerEmail.split('@')[1];
        if (emailDomain && this.config.ALLOWED_DOMAINS.some(allowed => 
            emailDomain === allowed.toLowerCase())) {
            return true;
        }
        
        return false;
    }
    
    async checkUserExists(email) {
        try {
            // Call your backend to check if user exists
            const response = await fetch(getApiUrl('CHECK_USER', { email }));
            const data = await response.json();
            return data.exists || false;
        } catch (error) {
            console.error('Error checking user:', error);
            return false;
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
        });
        
        // Listen for Enter key in login form
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && 
                (document.getElementById('email') || 
                 document.getElementById('password'))) {
                const activeElement = document.activeElement;
                if (activeElement.id === 'email' || activeElement.id === 'password') {
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
