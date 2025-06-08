import api from '../api.js';

export const dogsService = {
    
    getAllDogBreeds: async () => {
        try {
            const dogBreeds = await api.get('/dogs/breeds');
            return dogBreeds.data;
        } catch (error) {
            return {
                error: 'Failed to fetch dogs',
                status: error.response ? error.response.status : 500
            };
        }
    },

    getDogsByBreed: async (breed, size, from, sort) => {
        try {
            const params = {
                breeds: [breed],
                size: size,
                from: from,
                sort: sort
            }
            const dogs = await api.get('/dogs/search', { params });
            return dogs.data;
        } catch (error) {
            return {
                error: 'Failed to fetch dogs by breed',
                status: error.response ? error.response.status : 500
            };
        }
    },

    getDogInfoByIds: async (ids) => {
        try {
            const dogInfos = await api.post('/dogs', ids);
            return dogInfos.data;
        } catch (error) {
            return {
                error: 'Failed to fetch dog infos',
                status: error.response ? error.response.status : 500
            };
        }
    },

    getNextDogInfosByUrl: async (url) => {
        try {
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            return {
                error: 'Failed to fetch next dog infos',
                status: error.response ? error.response.status : 500
            };
        }
    },

    getMatchedDogs: async (ids) => {
        try {
            const response = await api.post('/dogs/match', ids);
            return response.data;
        } catch (error) {
            return {
                error: 'Failed to fetch matched dogs',
                status: error.response ? error.response.status : 500
            };
        }
    }
}