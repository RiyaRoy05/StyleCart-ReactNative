import api from './api';

export const getProducts = async (categoryId: string) => {
  const response = await api.post('/products/list', {
    categoryId,
    page: 1,
    per_page: 20,
  });

  return response.data;
};

export const getSingleProduct = async (productId: string) => {
  const response = await api.post('/products/single', {
    productId,
  });

  return response.data;
};

export const getRelatedProducts = async (
  categoryId: string,
  productId: string,
) => {
  const response = await api.post('/products/related', {
    categoryId,
    productId,
    limit: 5,
  });

  return response.data;
};
