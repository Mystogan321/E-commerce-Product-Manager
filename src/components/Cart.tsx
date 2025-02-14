// import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart, loadCart } from '../store/cartSlice';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateProductSaleCount } from '../store/productsSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    address: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!checkoutData.name || !checkoutData.email || !checkoutData.address) {
      alert('Please fill all required fields');
      return;
    }

    // Update product sale counts
    cartItems.forEach(item => {
      dispatch(updateProductSaleCount({ id: item.id, quantity: item.quantity }));
    });

    // Clear cart and show thank you
    dispatch(clearCart());
    setShowThankYou(true);
  };

  const ConfirmationDialog = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div 
        className={`p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={`mb-4 text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Remove this item from cart?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className={`px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedItemId) {
                dispatch(removeFromCart(selectedItemId));
              }
              setShowDeleteConfirm(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0 && !showThankYou) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your cart is empty</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Add some products to your cart to get started.</p>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Thank you for your order!</h2>
        <p className="text-gray-600 dark:text-gray-400">We've sent a confirmation email to {checkoutData.email}</p>
      </div>
    );
  }

  if (showCheckoutForm) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Checkout Details
        </h2>
        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              required
              className={`mt-1 block w-full rounded-md border-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={checkoutData.name}
              onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              required
              className={`mt-1 block w-full rounded-md border-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={checkoutData.email}
              onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Shipping Address
            </label>
            <textarea
              required
              className={`mt-1 block w-full rounded-md border-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={checkoutData.address}
              onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Complete Purchase
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
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
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setShowDeleteConfirm(true);
                  }}
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
      {showDeleteConfirm && <ConfirmationDialog />}
    </div>
  );
};

export default Cart;