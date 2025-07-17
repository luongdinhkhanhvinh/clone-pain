const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Color {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  isPopular: boolean;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  sku: string | null;
  isPublished: boolean;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

// Product API
export const productApi = {
  // Get all products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    categoryId?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.featured) queryParams.append('featured', 'true');
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.search) queryParams.append('search', params.search);
    }

    return fetchApi<{ products: Product[]; total: number }>(
      `/products?${queryParams.toString()}`
    );
  },

  // Get single product by ID or slug
  getProduct: async (identifier: string) => {
    return fetchApi<{ product: Product }>(`/products/${identifier}`);
  },
};

// Page API
export const pageApi = {
  // Get page by slug
  getPageBySlug: async (slug: string) => {
    return fetchApi<{
      id: string;
      title: string;
      content: string;
      seoTitle: string | null;
      seoDescription: string | null;
      slug: string;
      isPublished: boolean;
      publishedAt: string | null;
    }>(`/pages/slug/${slug}`);
  },
};

// Color API
export const colorApi = {
  // Get all colors
  getColors: async () => {
    return fetchApi<{ colors: Array<{
      id: string;
      name: string;
      code: string;
      imageUrl: string;
      isPopular: boolean;
    }>}>('/colors');
  },

  // Get color by ID
  getColor: async (id: string) => {
    return fetchApi<{
      id: string;
      name: string;
      code: string;
      imageUrl: string;
      description: string | null;
      hexCode: string;
      rgbCode: string;
      similarColors: Array<{
        id: string;
        name: string;
        code: string;
        imageUrl: string;
      }>;
    }>(`/colors/${id}`);
  },
};

export default {
  product: productApi,
  page: pageApi,
  color: colorApi,
};
