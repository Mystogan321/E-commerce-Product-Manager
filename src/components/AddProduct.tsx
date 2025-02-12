import React, { useState } from 'react';
import { useAppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../store/productsSlice';
import 'react-quill/dist/quill.snow.css';
import { lazy, Suspense } from 'react';

const ReactQuill = lazy(() => import('react-quill'));

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="prose prose-sm max-w-none">
            <Suspense fallback={<div className="h-48 bg-gray-100 rounded animate-pulse" />}>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                modules={modules}
                formats={formats}
                className="h-48 mb-12"
              />
            </Suspense>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.price}
            onChange={(e) => {
              const value = e.target.value.replace(/^-/, '');
              setFormData({ ...formData, price: value });
            }}
            onKeyDown={(e) => {
              if (['-', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;