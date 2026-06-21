import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get(`/products?search=${search}&category=${category}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, { userId, productId });
      
      const items = res.data?.cart?.items || [];
      const total = items.reduce(
        (sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0
      );
      
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 text-gray-800'>
      {/* Search and Filters Control Panel */}
      <div className='max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
        <div className="w-full sm:w-2/3 relative">
          <input 
            type="text"
            placeholder='Search items, tech, brands...' 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner'
          />
        </div>

        <div className="w-full sm:w-auto">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className='w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer'
          >
            <option value="">All Categories</option>
            <option value="tech">Tech</option>
            <option value="Phone">Phone</option>
            <option value="Laptops">Laptops</option>
          </select>
        </div>
      </div>

      {/* Products Grid Context */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          <div 
            key={product._id} 
            className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Clickable Product Wrapper */}
            <Link to={`/product/${product._id}`} className="w-full p-4 flex flex-col items-center flex-1">
              <div className="w-full h-48 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 mb-4">
                <img 
                  src={product.image}
                  alt={product.title}
                  className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300'
                />
              </div>
              <div className="w-full text-left">
                <h2 className='font-bold text-base text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors min-h-[3rem] mb-1'>
                  {product.title}
                </h2>
                <p className='text-xl font-extrabold text-gray-900 mb-2'>
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </p>
              </div>
            </Link>
            
            {/* Action Call Button */}
            <div className="p-4 pt-0">
              <button 
                onClick={() => addToCart(product._id)}
                className='w-full bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer shadow-sm shadow-blue-200'
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Layout Fallback */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg font-medium">No products matching your filters found.</p>
        </div>
      )}
    </div>
  );
};

export default Home;