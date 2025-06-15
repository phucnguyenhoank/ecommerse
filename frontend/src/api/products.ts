import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  all_rate: number;
  productItems: {
    id: number;
    quantity: number;
    price: string;
    size?: {
      id: number;
      name: string;
    };
    color?: {
      id: number;
      name: string;
    };
    image?: {
      id: number;
      image_url: string;
    };
  }[];
  category: {
    id: number;
    name: string;
  };
}

// Lấy tất cả sản phẩm
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Lấy sản phẩm theo danh mục
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const fetchProductItems = async (): Promise<Product['productItems']> => {
  const response = await axios.get(`${API_URL}/product-items`);
  return response.data;
};

export const fetchProductItemById = async (id: number): Promise<Product['productItems'][0]> => {
  const response = await axios.get(`${API_URL}/product-items/${id}`);
  return response.data;
};

export const fetchProductItemsByProductId = async (productId: number): Promise<Product['productItems']> => {
  const response = await axios.get(`${API_URL}/product-items/product/${productId}`);
  return response.data;
}; 