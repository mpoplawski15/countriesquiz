// AuthService.js
sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageToast"
], function (Object, MessageToast) {
    "use strict";

    return {
        apiUrl: "",
        tokenExpiryTime: null,
        tokenRefreshTimeout: null,
        
        init: function() {
            const hostname = window.location.hostname;
            
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                this.apiUrl = "http://localhost:3300/api";
            } else {
                this.apiUrl = "https://countriesquizserver-production.up.railway.app/api";
            }
            
            // Check token validity on initialization
            if (this.isLoggedIn()) {
                this.validateToken();
            }
        },
        
        register: function(username, email, password) {
            return fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            });
        },
        
        login: function(username, password) {
            return fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                // Store token in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Set token expiry (JWT tokens from your server expire in 7 days)
                const expiryTime = new Date();
                expiryTime.setDate(expiryTime.getDate() + 7); // 7 days from now
                this.tokenExpiryTime = expiryTime;
                localStorage.setItem('tokenExpiry', expiryTime.toISOString());
                
                return data;
            });
        },
        
        logout: function() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiry');
            
            if (this.tokenRefreshTimeout) {
                clearTimeout(this.tokenRefreshTimeout);
                this.tokenRefreshTimeout = null;
            }
            
            // You might want to redirect to login page
            // sap.ui.core.UIComponent.getRouterFor(this).navTo("login");
        },
        
        isLoggedIn: function() {
            const token = localStorage.getItem('authToken');
            const expiry = localStorage.getItem('tokenExpiry');
            
            if (!token || !expiry) {
                return false;
            }
            
            // Check if token is expired
            const expiryDate = new Date(expiry);
            if (expiryDate <= new Date()) {
                this.logout();
                return false;
            }
            
            return true;
        },
        
        validateToken: function() {
            const token = this.getToken();
            if (!token) {
                return Promise.resolve(false);
            }
            
            // Use the profile endpoint to validate token
            return this.getUserProfile()
                .then(() => {
                    return true; // Token is valid
                })
                .catch(err => {
                    console.error("Token validation failed:", err);
                    if (err.message === 'Session expired' || err.status === 401) {
                        this.logout();
                    }
                    return false;
                });
        },
        
        getUserProfile: function() {
            return this.authorizedFetch(`${this.apiUrl}/user/profile`)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw err; });
                    }
                    return response.json();
                });
        },
        
        getToken: function() {
            return localStorage.getItem('authToken');
        },
        
        getCurrentUser: function() {
            const userJson = localStorage.getItem('user');
            return userJson ? JSON.parse(userJson) : null;
        },
        
        // Function to include auth token in requests
        authorizedFetch: function(url, options = {}) {
            const token = this.getToken();
            if (!token) {
                return Promise.reject({ message: 'Not authenticated', status: 401 });
            }
            
            const authOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                }
            };
            
            return fetch(url, authOptions).then(response => {
                if (response.status === 401) {
                    this.logout();
                    throw { message: 'Session expired', status: 401 };
                }
                return response;
            });
        },
        
        // Helper for showing authentication errors
        handleAuthError: function(error) {
            let message = "Authentication error";
            
            if (error && error.error) {
                message = error.error;
            } else if (typeof error === 'string') {
                message = error;
            } else if (error && error.message) {
                message = error.message;
            }
            
            MessageToast.show(message);
            console.error("Auth error:", error);
        }
    };
});