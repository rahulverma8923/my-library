import api from './api';

export const dashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getCurrentlyReading() {
    const response = await api.get('/dashboard/reading');
    return response.data;
  },

  async getRecentBooks() {
    const response = await api.get('/dashboard/recent');
    return response.data;
  },

  async getReadingActivity() {
    const response = await api.get('/dashboard/activity');
    return response.data;
  }
};
