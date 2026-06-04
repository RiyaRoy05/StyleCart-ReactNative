import api from './api';

export const getCategories = async () => {
  const response = await api.post('/categories/list', {});

  return response.data;
};
