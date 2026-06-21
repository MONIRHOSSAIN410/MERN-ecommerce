import { useParams, useNavigate } from 'react-router-dom'; // 🛠️ FIXED: Changed from 'react-router' to 'react-router-dom'

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className='max-w-xl mx-auto p-6 text-center mt-12'>
      {/* Visual success checkmark indicator */}
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className='text-3xl font-bold text-green-600'>Order Placed Successfully!</h1>
      
      <p className='mt-4 text-gray-600'>
        Thank you for your purchase. Your Order ID is:{" "}
        <span className='font-mono font-semibold bg-gray-100 px-2 py-1 rounded text-gray-800 break-all select-all'>
          {id || "Processing..."} {/* Fallback text if ID is temporarily undefined */}
        </span>
      </p>

      <button 
        onClick={goHome} 
        className='inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded shadow transition-all duration-200'
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;