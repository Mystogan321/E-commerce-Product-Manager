import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import parse from 'html-react-parser';

const ProductDetail = () => {
  const { id } = useParams();
  const product = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === id)
  );
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
          <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {parse(product.description)}
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 