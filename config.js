
// DSOG Franchise Platform - Frontend Application

class DSOGFrontend {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Check for existing session
        this.checkSession();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Check backend connection
        this.checkBackend();
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
        localStorage.removeItem('dsog_user');
        localStorage.removeItem('dsog_token');
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
