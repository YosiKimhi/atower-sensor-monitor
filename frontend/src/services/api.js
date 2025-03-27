import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// API endpoints
const apiService = {
    // Get weekly temperature report
    getWeeklyReport: async () => {
        try {
            const response = await api.get('/reports/weekly');
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly report:', error);
            throw error;
        }
    },

    // Get malfunctioning sensors
    getMalfunctioningSensors: async () => {
        try {
            const response = await api.get('/reports/malfunctioning');
            return response.data;
        } catch (error) {
            console.error('Error fetching malfunctioning sensors:', error);
            throw error;
        }
    }
};

export default apiService;
