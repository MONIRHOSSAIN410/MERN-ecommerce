import { useState } from 'react';
import api from "../api/axios.js";

const Signup = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    
      const response = await api.post("/auth/signup", form);
      setMsg(response.data.message);
    } catch (error) {
      setMsg(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Create Account</h2>
        
        {msg && (
          <div className='mb-4 text-center text-sm text-blue-600 font-medium'>
            {msg}
          </div>
        )}
        
        {/* 4. Fixed <from> to <form> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 5. Fixed lowercase 'name' attributes and values */}
          <input 
            name='name' 
            type='text'
            placeholder='Enter Name' 
            value={form.name} 
            onChange={handleChange} 
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none' 
            required
          />

          <input 
            name='email' 
            type='email'
            placeholder='Enter Email' 
            value={form.email} 
            onChange={handleChange} 
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none' 
            required
          />

          <input 
            name='password' 
            type='password'
            placeholder='Password' 
            value={form.password} 
            onChange={handleChange} 
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none' 
            required
          />

          <button type="submit" className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 '>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;