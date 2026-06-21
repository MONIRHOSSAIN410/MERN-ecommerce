import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });

  const allowedFields = ["title", "description", "price", "category", "image", "stock"];

  const loadProduct = async () => {
    try {
      // OPTIMIZATION: Fetch just the specific product if your API supports it:
      // const res = await api.get(`/products/${id}`);
      // setForm(res.data);

      // Current fallback logic fixed:
      const res = await api.get(`/products`);
      const product = res.data.find((p) => String(p.id) === String(id));
      
      if (product) {
        setForm(product);
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  // Good practice: Add id to the dependency array
  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/update/${id}`, form);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded'>
      <h2 className='text-2xl font-bold mb-6'>Edit Product</h2>
      <form onSubmit={handleSubmit} className='space-y-3'>
        {allowedFields.map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-semibold capitalize text-gray-600 mb-1">{key}</label>
            <input
              name={key}
              // FIX: The "|| ''" prevents the uncontrolled input runtime error
              value={form[key] || ""} 
              onChange={handleChange}
              placeholder={key}
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
        ))}
        <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors mt-4'>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;