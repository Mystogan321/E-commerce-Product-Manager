import { useTheme } from '../context/ThemeContext';

const InputField = () => {
  const { isDarkMode } = useTheme();

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