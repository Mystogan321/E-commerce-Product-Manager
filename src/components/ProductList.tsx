import { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchProducts, setCurrentPage, setSearchQuery } from '../store/productsSlice';
import { addToCart, setLoading } from '../store/cartSlice';
import { Search, SearchX, PlusCircle, ArrowDown, ArrowUp, ListTree, Trophy } from 'lucide-react';
import { Product } from '../types/product';
import parse from 'html-react-parser';
import type { AppDispatch } from '../store/store';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../hooks/useClickOutside';
import Notification from '../components/Notification';


const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, currentPage, searchQuery } = useSelector(
    (state: RootState) => state.products
  );
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [sortBy, setSortBy] = useState<string>('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState<string | null>(null);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useClickOutside(sortDropdownRef, () => setShowSortDropdown(false));
  useClickOutside(categoryDropdownRef, () => setShowCategoryDropdown(false));

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(p => p.category))).sort();
  }, [items]);

  const filteredProducts = items.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch(sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case 'sold':
          return (b.soldCount || 0) - (a.soldCount || 0);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
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

        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ListTree className="h-5 w-5" />
            <span>{selectedCategory || 'All Categories'}</span>
          </button>

          {showCategoryDropdown && (
            <div className={`absolute top-12 right-0 w-48 max-h-64 overflow-y-auto rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md text-left ${
                    isDarkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-3 py-2 rounded-md text-left ${
                      isDarkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={sortDropdownRef}>
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ListTree className="h-5 w-5" />
            <span>Sort</span>
          </button>

          {showSortDropdown && (
            <div className={`absolute top-12 right-0 w-48 rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-2 space-y-2">
                <button
                  onClick={() => { setSortBy('price_asc'); setShowSortDropdown(false); }}
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700"
                >
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Price: Low to High
                </button>
                <button
                  onClick={() => { setSortBy('price_desc'); setShowSortDropdown(false); }}
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700"
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Price: High to Low
                </button>
                <button
                  onClick={() => { setSortBy('category'); setShowSortDropdown(false); }}
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700"
                >
                  <ListTree className="h-4 w-4 mr-2" />
                  Category
                </button>
                <button
                  onClick={() => { setSortBy('sold'); setShowSortDropdown(false); }}
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Most Popular
                </button>
              </div>
            </div>
          )}
        </div>
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
                  <ProductCard 
                    product={product} 
                    setNotification={setNotificationProduct}
                  />
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

      {notificationProduct && (
        <Notification 
          message={`${notificationProduct} added to cart!`}
          duration={3000}
          onClose={() => setNotificationProduct(null)}
        />
      )}
    </div>
  );
};

const ProductCard = ({ 
  product,
  setNotification 
}: { 
  product: Product;
  setNotification: (productName: string) => void;
}) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <div className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
      isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
    }`}>
      <Link to={`/products/${product.id}`} className="block">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {product.name}
          </h3>
          <div className={`mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {parse(product.description)}
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          ${product.price}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(setLoading(true));
              setTimeout(() => {
                dispatch(addToCart(product));
                dispatch(setLoading(false));
                setNotification(product.name);
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