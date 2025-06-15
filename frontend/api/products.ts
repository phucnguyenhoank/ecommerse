import axios from "axios";

// Interface cho sản phẩm
export interface Product {
  Id: number;
  Name: string;
  Price: number;
  Description: string;
  Categories?: string[];
  Images?: string[];
  Img: string;
  Sizes?: string[];
  AdditionalInfo?: {
    weight?: string;
    color?: string;
    size?: string;
    oldPrice?: number;
  };
}

// Interface cho phản hồi của API sản phẩm liên quan
export interface RelatedProductsResponse {
  products: Product[];
  total: number;
}

const API_BASE_URL = "http://localhost:5000/api/products"; // Thay đổi URL nếu cần

// Lấy danh sách tất cả sản phẩm
export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_BASE_URL}`);
  return response.data;
};

// Lấy thông tin sản phẩm theo ID
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Lấy thông tin sản phẩm theo tên
export const fetchProductByName = async (name: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_BASE_URL}/name/${name}`);
  return response.data;
};

// Lấy danh sách sản phẩm liên quan
export const fetchRelatedProducts = async (
  excludeName: string,
  category?: string,
  page: number = 1,
  limit: number = 4
): Promise<RelatedProductsResponse> => {
  const params: Record<string, string | number> = {
    excludeName,
    page,
    limit,
  };
  if (category) {
    params.category = category;
  }

  const response = await axios.get<RelatedProductsResponse>(`${API_BASE_URL}/related`, { params });
  return response.data;
};

// Tạo mới một sản phẩm
export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await axios.post<Product>(`${API_BASE_URL}`, product);
  return response.data;
};

// Cập nhật thông tin sản phẩm
export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await axios.put<Product>(`${API_BASE_URL}/${id}`, product);
  return response.data;
};

// Xóa sản phẩm
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

// Lấy danh sách sản phẩm theo danh mục và trạng thái sale
export const fetchProductsByCategory = async (category: string, onSale: boolean = true): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/category/${category}`, {
    params: { onSale }
  });
  return response.data;
};