// import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here');
    dispatch(clearCart());
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">Add some products to your cart to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Shopping Cart
      </h2>
      <div className={`rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className={`p-6 flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-6 flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {item.name}
                </h3>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))}
                    className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </button>
                  <span className={`w-8 text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={`p-6 rounded-b-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Total:
            </span>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className={`mt-4 w-full py-3 px-4 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;