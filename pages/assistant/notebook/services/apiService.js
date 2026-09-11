import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AsyncStorage = {
  getItem: async (key) => (typeof window !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: async (key, val) => (typeof window !== 'undefined' ? localStorage.setItem(key, val) : null),
  removeItem: async (key) => (typeof window !== 'undefined' ? localStorage.removeItem(key) : null),
};

const API_BASE_URL = 'https://api.ajur.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Always send token in params
api.interceptors.request.use(
  async (config) => {
    try {
      let token = await AsyncStorage.getItem('id_token');
      if (!token && typeof window !== 'undefined') {
        token = Cookies.get('id_token') || null;
      }
      if (token) {
        config.params = { ...(config.params || {}), token };
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.status, error?.response?.data);

    if (error?.response?.status === 401) {
      AsyncStorage.removeItem('id_token');
      if (typeof window !== 'undefined') Cookies.remove('id_token');
      if (typeof window !== 'undefined') window.alert('Please log in again');
    } else if (error?.response?.status >= 500) {
      if (typeof window !== 'undefined') window.alert('A server error occurred');
    } else if (error?.code === 'NETWORK_ERROR') {
      if (typeof window !== 'undefined') window.alert('No internet connection');
    }

    return Promise.reject(error);
  }
);

// Create the plain object with API methods
const ApiMethods = {
  createContact: (contactData) => api.post('/contacts', contactData),
  getContacts: () => api.get('/contacts'),
  getContactById: (id) => api.get(`/contacts/${id}`),
  updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  deleteContact: async (id) => {
    try {
      const formData = new FormData();
      let token = await AsyncStorage.getItem('id_token');
      if (!token && typeof window !== 'undefined') {
        token = Cookies.get('id_token') || null;
      }
      if (token) formData.append('token', token);

      return api.post(`/contact-delete/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  searchContacts: (query) => api.get(`/contacts/search/${encodeURIComponent(query)}`),
  getContactsByCategory: (category) => api.get(`/contacts/category/${encodeURIComponent(category)}`),
  testConnection: () => api.get('/test'),
};

// Default export: a React page component that also exposes API methods as properties
function ApiServicePage() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;
    ApiServicePage.testConnection()
      .then(() => {
        if (mounted) setStatus('ok');
      })
      .catch(() => {
        if (mounted) setStatus('error');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    React.createElement('div', { style: { padding: 20, fontFamily: 'sans-serif' } },
      React.createElement('h1', null, 'ApiService (page)'),
      React.createElement('p', null, status === 'checking' ? 'Checking API...' : status === 'ok' ? 'API reachable' : 'API unreachable'),
      React.createElement('small', null, 'This page component also exposes API helper methods as static properties for compatibility with existing imports.')
    )
  );
}

// Attach methods to the component function so importing the default still works
Object.keys(ApiMethods).forEach((k) => {
  ApiServicePage[k] = ApiMethods[k];
});

export default ApiServicePage;
