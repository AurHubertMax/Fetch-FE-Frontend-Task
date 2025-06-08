import api from "../api";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      return {
        error: 'Login failed',
        status: error.response ? error.response.status : 500
      }
    }
  },
  
  verifyAuth: async () => {
    try {
        await api.get('/dogs/breeds');
        return { authenticated: true };
    } catch (error) {
        alert('Authentication verification failed:', error.response?.status);
        return {
            error: 'Authentication verification failed',
            status: error.response ? error.response.status : 500
        }
    }
  },

  logout: async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;   
    } catch (error) {
        return {
            error: 'Logout failed',
            status: error.response ? error.response.status : 500
        }
    }
  }
};
