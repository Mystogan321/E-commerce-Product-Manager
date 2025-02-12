// import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, PlusCircle, Settings2, Sun, Moon, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleTheme } from '../store/themeSlice';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white">
                  <span>{user.name}</span>
                  <User className="h-6 w-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block dark:bg-gray-800">
                  <button
                    onClick={() => dispatch(logout())}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-200">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-gray-200">
                  Register
                </Link>
              </>
            )}
            
            <Link
              to="/"
              className="p-2 hover:bg-indigo-700/20 rounded-full transition-colors"
              title="Products"
            >
              <Package className="h-6 w-6" />
            </Link>
            
            <Link
              to="/add"
              className="p-2 hover:bg-indigo-700/20 rounded-full transition-colors"
              title="Add Product"
            >
              <PlusCircle className="h-6 w-6" />
            </Link>

            <Link
              to="/manage"
              className="p-2 hover:bg-indigo-700/20 rounded-full transition-colors"
              title="Manage Products"
            >
              <Settings2 className="h-6 w-6" />
            </Link>
            
            <Link
              to="/cart"
              className="p-2 relative hover:bg-indigo-700/20 rounded-full transition-colors"
              title="Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;