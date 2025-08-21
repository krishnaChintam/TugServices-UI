import api from './axios';

export const userService = {
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
}; 