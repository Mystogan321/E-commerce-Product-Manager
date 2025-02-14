import React, { useState } from 'react';
import { useAppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../store/productsSlice';
import 'react-quill/dist/quill.snow.css';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ReactQuill = lazy(() => import('react-quill'));

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(addProduct({
        ...formData,
        price: parseFloat(formData.price),
      })).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
  ];

  const inputClasses = `block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border-2 ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-500 text-white placeholder-gray-400' 
      : 'bg-white border-gray-400 text-gray-800 placeholder-gray-500'
  }`;

  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Add New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Description
          </label>
          <div className="relative">
            <div className={`border-2 rounded-md ${isDarkMode ? 'border-gray-300' : 'border-gray-400'} overflow-hidden`}>
              <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                <Suspense fallback={
                  <div className={`h-48 rounded animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                }>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    modules={modules}
                    formats={formats}
                    className={`h-48 [&_.ql-toolbar]:border-none [&_.ql-container]:border-none ${
                      isDarkMode ? 
                      'bg-gray-800 [&_.ql-editor]:text-white [&_.ql-toolbar]:bg-gray-700' : 
                      'bg-white'
                    } [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:overflow-y-auto`}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.price}
            onChange={(e) => {
              const value = Math.max(0, parseFloat(e.target.value) || 0);
              setFormData({ ...formData, price: value.toString() });
            }}
            onKeyDown={(e) => ['-', 'e', 'E'].includes(e.key) && e.preventDefault()}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Image URL
          </label>
          <input
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className={inputClasses}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-md transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md transition-colors ${
              isDarkMode 
                ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Add Product
          </button>
        </div>
      </form>

      <style>
        {`
          .dark .ql-snow .ql-stroke {
            stroke: white !important;
          }
          .dark .ql-snow .ql-fill {
            fill: white !important;
          }
          .dark .ql-snow .ql-picker {
            color: white !important;
          }
          .dark .ql-snow .ql-editor ul,
          .dark .ql-snow .ql-editor ol {
            color: white !important;
          }
          .dark .ql-snow .ql-editor li:before {
            color: white !important;
          }
          .dark .ql-snow .ql-editor blockquote {
            border-left-color: white !important;
            color: #e5e7eb !important;
          }
          .dark .ql-snow .ql-editor pre {
            background-color: #1f2937 !important;
            color: white !important;
          }
          .ql-toolbar.ql-snow {
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          .ql-container.ql-snow {
            border: none !important;
          }
          .dark .ql-toolbar.ql-snow {
            border-bottom-color: #374151 !important;
          }
          .ql-editor {
            max-height: 180px;
            overflow-y: auto;
          }
          .dark .ql-editor::-webkit-scrollbar {
            width: 8px;
            background-color: #1f2937;
          }
          .dark .ql-editor::-webkit-scrollbar-thumb {
            background-color: #4b5563;
            border-radius: 4px;
          }
          .dark .ql-snow .ql-picker-label {
            color: white !important;
          }
          .dark .ql-snow .ql-picker-options {
            background-color: #1f2937 !important;
            border-color: #374151 !important;
          }
          .dark .ql-snow .ql-picker-item {
            color: white !important;
          }
          .dark .ql-snow .ql-picker-item.ql-selected {
            color: #818cf8 !important;
          }
          .dark .ql-snow .ql-header .ql-picker-label {
            color: white !important;
          }
          .dark .ql-snow .ql-header .ql-picker-item {
            color: white !important;
          }
          .dark .ql-snow .ql-header .ql-picker-item.ql-selected {
            color: #818cf8 !important;
          }
          /* Header picker hover states */
          .ql-snow .ql-picker-label:hover,
          .ql-snow .ql-picker-label:hover .ql-stroke {
            color: #818cf8 !important;
            stroke: #818cf8 !important;
          }
          
          .dark .ql-snow .ql-picker-label:hover,
          .dark .ql-snow .ql-picker-label:hover .ql-stroke {
            color: #818cf8 !important;
            stroke: #818cf8 !important;
          }

          /* Selected header state */
          .ql-snow .ql-picker-item.ql-selected,
          .ql-snow .ql-picker-item.ql-active {
            color: #818cf8 !important;
          }

          /* Hover states for picker items */
          .ql-snow .ql-picker-item:hover {
            color: #818cf8 !important;
          }
          .dark .ql-snow .ql-picker-item:hover {
            color: #818cf8 !important;
          }
        `}
      </style>
    </div>
  );
};

export default AddProduct;