import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const InputField = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <input
      className={`w-full p-2 rounded border ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-300 text-black'
      }`}
    />
  );
};

export default InputField; 