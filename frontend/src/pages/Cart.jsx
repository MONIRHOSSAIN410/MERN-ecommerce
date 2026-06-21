import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router';

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.post(`/cart/remove`, { userId, productId });
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updatedQty = async (productId, quantity) => {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }
    try {
      await api.post(`/cart/update`, { userId, productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (!cart) {
    return <div className="text-center mt-10 text-gray-500">Loading your cart...</div>;
  }

  const total = cart.items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>
      
      {cart.items.length === 0 ? (
        <div className="text-gray-500 bg-gray-50 p-6 rounded text-center">Your cart is empty</div>
      ) : (
        <div className='space-y-4'>
          {/* ✅ The loop wraps around the entire item block now */}
          {cart.items.map((item) => {
            // Check if product metadata exists to avoid rendering runtime errors
            if (!item.productId) return null;

            return (
              <div 
                key={item.productId._id}
                className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-white shadow-sm gap-4'
              >
                {/* Product Info (Image + Title & Price) */}
                <div className='flex items-center gap-4 flex-1'>
                  <img 
                    src={item.productId.image} 
                    alt={item.productId.title} 
                    className='w-16 h-16 object-cover rounded bg-gray-100'
                  />
                  <div>
                    <h2 className='text-lg font-semibold text-gray-800'>{item.productId.title}</h2>
                    <p className='text-gray-600'>${item.productId.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity Adjustment Controls */}
                <div className='flex items-center gap-2 border rounded-md p-1 bg-gray-50'>
                  <button 
                    onClick={() => updatedQty(item.productId._id, item.quantity - 1)}
                    className='px-2.5 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold transition-colors cursor-pointer'
                  >
                    -
                  </button>
                  <span className='px-2 font-medium min-w-[24px] text-center'>{item.quantity}</span>
                  <button 
                    onClick={() => updatedQty(item.productId._id, item.quantity + 1)}
                    className='px-2.5 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold transition-colors cursor-pointer'
                  >
                    +
                  </button>
                </div>

                {/* Item Line Total Subtotal */}
                <div className="min-w-[80px] text-right">
                  <p className='font-semibold text-gray-900'>
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Trash/Remove Button */}
                <div>
                  <button 
                    onClick={() => removeItem(item.productId._id)}
                    className='text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer text-sm sm:text-base'
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Summary Header Footnote */}
      <div className='text-right mt-6 border-t pt-4'>
        <h2 className='text-xl font-bold text-gray-900'>
          Total: ${total.toFixed(2)}
        </h2>
      </div>
      <button onClick={()=>navigate("/checkout-address")} className='w-full bg-blue-500 text-white p-2 rounded'>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;