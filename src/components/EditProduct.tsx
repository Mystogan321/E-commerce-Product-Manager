import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { updateProduct } from '../store/productsSlice';
import { RootState } from '../store/store';

const ReactQuill = lazy(() => import('react-quill'));

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const product = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === id)
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(updateProduct({
        id: id!,
        ...formData,
        price: parseFloat(formData.price),
        createdAt: product?.createdAt,
      })).unwrap();

      navigate('/manage');
    } catch (error) {
      console.error('Failed to update product:', error);
      // Add error handling UI here if needed
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

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium">
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
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Category
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/manage')}
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;