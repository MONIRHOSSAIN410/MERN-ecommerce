import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from "react-router";

const Checkout = () => {
  const userId = localStorage.getItem("userId");
  const [address, setAddress] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    // Fetch Cart Data
    api.get(`/cart/${userId}`)
      .then((res) => {
        console.log("YOUR CART DATA FROM BACKEND:", res.data);
        setCart(res.data);
      })
      .catch((err) => console.error("Error fetching cart:", err));

    // Fetch Address Data
    api.get(`/address/${userId}`)
      .then((res) => {
        const fetchedAddresses = res.data || [];
        setAddress(fetchedAddresses);
        if (fetchedAddresses.length > 0) {
          setSelectedAddress(fetchedAddresses[0]); 
        }
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  }, [userId, navigate]);

  if (!cart) {
    return <div className="text-center p-10 font-semibold">Loading...</div>;
  }

  // Calculate Grand Total
  const total = cart?.items?.reduce((sum, i) => {
    const qty = i.quantity || 0;
    const price = i.product?.price || i.productId?.price || i.price || 0;
    return sum + (qty * price);
  }, 0) || 0;

  // Handle Placing Order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      // Re-map items to exactly match your Order schema array structure
      const formattedItems = (cart.items || []).map((item) => ({
        productId: item.productId?._id || item.product?._id || item.productId,
        quantity: Number(item.quantity || 0),
        price: Number(item.product?.price || item.productId?.price || item.price || 0)
      }));

      const orderData = {
        userId: userId,
        address: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine: selectedAddress.addressLine,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        }, 
        items: formattedItems,
        totalAmount: total,
        paymentMethod: "COD"
      };

      // Send order request to the backend
      const response = await api.post("/order/place", orderData); 
      
      // 🛠️ FIXED HERE: Dynamically grab the newly created order ID from the backend response
      const placedOrderId = response.data?._id || response.data?.order?._id;

      if (placedOrderId) {
        navigate(`/order-success/${placedOrderId}`); 
      } else {
        // Fallback if backend responds with raw text or a different structure
        alert("Order placed successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Backend Error Details:", error.response?.data || error);
      alert(`Failed to place order: ${error.response?.data?.message || "Check network/console logs"}`);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Checkout</h1>

      <h2 className='font-semibold mb-2 text-lg'>Select Address</h2>
      {address.length === 0 ? (
        <p className="text-gray-500 mb-4">No addresses found. Please add an address first.</p>
      ) : (
        address.map((addr) => (
          <div
            key={addr._id}
            onClick={() => setSelectedAddress(addr)}
            className={`border rounded p-4 mb-4 cursor-pointer transition ${
              selectedAddress?._id === addr._id ? 'border-green-500 bg-green-50/50' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedAddress?._id === addr._id}
                onChange={() => setSelectedAddress(addr)}
                className="mt-1 h-4 w-4 text-green-600 cursor-pointer"
              />
              <div className="cursor-pointer">
                <strong className="text-gray-800">{addr.fullName}</strong>
                <p className='text-sm text-gray-600 mt-1'>
                  {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className='text-sm text-gray-500 mt-0.5'>Phone: {addr.phone}</p>
              </div>
            </div>
          </div>
        ))
      )}

      <h2 className='font-semibold mb-2 text-lg mt-6'>Order Summary</h2>
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <p className="text-xl font-bold text-gray-800">Total Amount: ${total.toFixed(2)}</p>
      </div>

      <button
        onClick={handlePlaceOrder}
        className='mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded shadow transition'
      >
        Place Order (COD)
      </button>
    </div>
  );
};

export default Checkout;