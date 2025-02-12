import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchProducts, setCurrentPage, setSearchQuery } from '../store/productsSlice';
import { addToCart, setLoading } from '../store/cartSlice';
import { Search, SearchX, PlusCircle } from 'lucide-react';
import { Product } from '../types/product';
import parse from 'html-react-parser';
import type { AppDispatch } from '../store/store';
import { Link } from 'react-router-dom';


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
            {filteredProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id}>
                  <ProductCard product={product} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or add a new product.
                  </p>
                  <Link
                    to="/add"
                    className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Product
                  </Link>
                </div>
              </div>
            )}
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
        <div className={`mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {parse(product.description)}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sold: {product.soldCount || 0}
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