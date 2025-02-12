import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchProducts, setCurrentPage, setSearchQuery } from '../store/productsSlice';
import { addToCart, setLoading } from '../store/cartSlice';
import { Search } from 'lucide-react';
import { Product } from '../types/product';
import parse from 'html-react-parser';
import type { AppDispatch } from '../store/store';


const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, currentPage, searchQuery } = useSelector(
    (state: RootState) => state.products
  );
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            isDarkMode 
              ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700' 
              : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300'
          }`}
        />
      </div>

      {status === 'loading' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <button
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {status === 'failed' && (
        <div className="text-center py-8 text-red-600">
          Failed to load products. Please try again later.
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <div className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
      isDarkMode 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-white hover:bg-gray-50'
    }`}>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {product.name}
        </h3>
        <p className={`mt-1 line-clamp-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {parse(product.description)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xl font-bold ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => {
              dispatch(setLoading(true));
              setTimeout(() => {
                dispatch(addToCart(product));
                dispatch(setLoading(false));
              }, 500);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;