import { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../api/axios'

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [msg, setMsg] = useState("")
  // Quick tip: You might want a separate state for success vs error styling, 
  // but keeping it simple for now!
  const [isSuccess, setIsSuccess] = useState(false) 
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post("/auth/login", form)
      console.log(res, "data")

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId",res.data.user.id);
      
      setMsg("Login Successful")
      setIsSuccess(true)

      setTimeout(() => {
        navigate("/")
      }, 1000)
    } catch (err) {
      setIsSuccess(false)
      setMsg(err.response?.data?.message || "An error occurred")
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login to Your Account</h2>
        
        {msg && (
          <div className={`mb-4 text-center text-sm font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </div>
        )}

        {/* FIXED: Changed onSubmit from handleChange to handleSubmit */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input 
            name='email' 
            type='email' // Typo fix: lowercase 'email' is standard for HTML5
            placeholder='Enter Email' 
            value={form.email} 
            onChange={handleChange} // FIXED: Added missing onChange handler
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none' 
            required
          />
          
          <input 
            name='password' 
            type='password' 
            placeholder='Enter Password' 
            value={form.password} 
            onChange={handleChange} 
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none' 
            required
          />

          <button type="submit" className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login;