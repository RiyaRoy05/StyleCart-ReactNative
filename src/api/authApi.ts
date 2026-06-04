import api from './api';

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const response = await api.post('/users/register', {
    fullName,
    email,
    password,
  });

  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/users/login', {
    email,
    password,
  });

  return response.data;
};
