import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router'; // Note: Ensure you meant 'react-router-dom' if routing fails

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // 1. Wrapped in try/catch for safety
  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 2. Fixed naming consistency: changed to match the onClick handler (deleteProduct)
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/delete/${id}`);
      alert("Product deleted successfully!");
      loadProducts(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // 3. Added the empty dependency array [] to prevent the infinite loop
  useEffect(() => {
    loadProducts();
  }, []); 

  return (
    <div className='max-w-4xl mx-auto mt-10'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Product List</h2>
        <Link to="/admin/products/add" className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
          Add New Product
        </Link>
      </div>
      
      <table className='w-full table-auto border-collapse border border-gray-200'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border border-gray-200 px-4 py-2'>Title</th>
            <th className='border border-gray-200 px-4 py-2'>Price</th>
            <th className='border border-gray-200 px-4 py-2'>Stock</th>
            <th className='border border-gray-200 px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className='text-center'>
              {/* 4. Removed the incorrect '$' from the title cell */}
              <td className='border border-gray-200 px-4 py-2'>{product.title}</td>
              <td className='border border-gray-200 px-4 py-2'>${product.price}</td>
              <td className='border border-gray-200 px-4 py-2'>{product.stock}</td>
              <td className='border border-gray-200 px-4 py-2 flex justify-center gap-4'>
                <Link to={`/admin/products/edit/${product._id}`} className='text-blue-600 hover:underline'>Edit</Link>
                <button 
                  onClick={() => deleteProduct(product._id)} 
                  className='text-red-500 hover:underline'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;