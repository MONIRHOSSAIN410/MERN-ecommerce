import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) return setCartCount(0);
      try {
        const res = await api.get(`/cart/${userId}`);
        // Ensure items exist before running reduce to prevent crashing
        const items = res.data?.items || [];
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch (error) {
        console.error("Error loading cart count:", error);
      }
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className='flex justify-between items-center p-4 shadow bg-gray-200'>
      <Link to="/" className='font-bold text-xl px-10'>Store</Link>
      
      <div className='flex gap-6 items-center'>
        {/* Cart Link with explicit text/icon placeholder */}
        <Link to="/cart" className='relative text-lg font-medium hover:text-blue-600 transition-colors'>
          Cart
          {cartCount > 0 && (
            <span className='absolute -top-2.5 -right-4 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse'>
              {cartCount}
            </span>
          )}
        </Link>

        {/* Authentication Links */}
        {!userId ? (
          <div className='flex gap-4 i'>
            <Link to="/login" className='text-lg font-bold text-gray-700 hover:text-black '>Login</Link>
            <Link to="/signup" className='text-lg font-bold text-gray-700 hover:text-black'>Signup</Link>
          </div>
        ) : (
          <button 
            onClick={logout} 
            className='text-lg font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer mr-6'
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;