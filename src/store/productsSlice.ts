import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  searchQuery: string;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  searchQuery: '',
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await new Promise<Product[]>((resolve) => {
    const products = localStorage.getItem('products');
    setTimeout(() => {
      resolve(products ? JSON.parse(products) : []);
    }, 500);
  });
  return response;
});

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    const products = localStorage.getItem('products');
    const existingProducts = products ? JSON.parse(products) : [];
    localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
    
    return newProduct;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const products = localStorage.getItem('products');
    const existingProducts = products ? JSON.parse(products) : [];
    const updatedProducts = existingProducts.map((p: Product) =>
      p.id === product.id ? product : p
    );
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const products = localStorage.getItem('products');
    const existingProducts = products ? JSON.parse(products) : [];
    const updatedProducts = existingProducts.filter((p: Product) => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    updateProductSaleCount: (state, action: PayloadAction<{id: string; quantity: number}>) => {
      const product = state.items.find(item => item.id === action.payload.id);
      if (product) {
        product.soldCount = (product.soldCount || 0) + action.payload.quantity;
        localStorage.setItem('products', JSON.stringify(state.items));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { setCurrentPage, setSearchQuery, updateProductSaleCount } = productsSlice.actions;
export default productsSlice.reducer;