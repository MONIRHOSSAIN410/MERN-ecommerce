import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from 'react-router-dom'; // 👈 FIXED: Changed from 'react-router'

const CheckoutAddress = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault(); 
    
    try {
      await api.post("/address/add", {
        ...form,
        userId,
      });
      // Only navigate if the API call succeeds
      navigate("/checkout");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
      
      <form onSubmit={saveAddress} className="space-y-3">
        {Object.keys(form).map((key) => (
          <input 
            key={key} 
            name={key} 
            value={form[key]} 
            placeholder={key.replace(/([A-Z])/g, ' $1').trim()} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded block"
          />
        ))}
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default CheckoutAddress;