import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { orderStatus } from '../api/api.js';

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      navigate('/');
      return;
    }


    const fetchOrder = async () => {
      try {
        const response = await orderStatus(orderId);
        if (response.data) {
          setOrder(response.data.data.order);
          console.log(order)
        } else {
          throw new Error('No order data received');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: "200px",
  };

  const center = {
    lat: 30.2167, // Default coordinates for Srinagar, UK
    lng: 78.7833,
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your order has been successfully placed and is being processed.
              </p>
              <div className="flex items-center justify-center mb-8">
                <svg
                  className="h-16 w-16 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order._id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">${order.orderPrice.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.address.address}, {order.address.city}, {order.address.state} {order.address.pincode}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.mainImage?.url}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">Quantity: {item.stock}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 