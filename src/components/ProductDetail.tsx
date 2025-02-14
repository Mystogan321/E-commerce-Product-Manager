import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import parse from 'html-react-parser';
import { ArrowLeft } from 'lucide-react';
import { addToCart, setLoading } from '../store/cartSlice';
import Notification from './Notification';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const product = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === id)
  );
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <button
        onClick={() => navigate(-1)}
        className={`mb-6 flex items-center space-x-2 ${
          isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Products</span>
      </button>
      
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="space-y-4">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h1>
          <p className={`text-2xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            ${product.price.toFixed(2)}
          </p>
          <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
            <div 
              className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              dangerouslySetInnerHTML={{ 
                __html: product.description.replace(
                  /<ul>|<ol>/g, 
                  '<ul style="list-style:disc;padding-left:1.5rem">'
                ) 
              }}
            />
          </div>
          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Total Sold:
              </span>
              <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {product.soldCount || 0}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setLoading(true));
              setTimeout(() => {
                dispatch(addToCart(product));
                dispatch(setLoading(false));
                setShowNotification(true);
              }, 500);
            }}
            className={`mt-6 px-6 py-3 rounded-lg font-semibold ${
              isDarkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {showNotification && (
        <Notification 
          message="Product added to cart!"
          duration={3000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail; 

<style>
  {`
    .prose h2 {
      font-size: 1.5rem;
      margin: 1rem 0;
    }
    .prose h3 {
      font-size: 1.25rem;
      margin: 0.875rem 0;
    }
    .prose pre {
      background-color: #1f2937;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    .dark .prose pre {
      background-color: #111827;
    }
  `}
</style> 