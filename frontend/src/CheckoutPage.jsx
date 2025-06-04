import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    address: {
      country: "",
      city: "",
      state: "",
      address: "",
      pincode: "",
    },
    payment: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
    },
  });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear any previous error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const cardNumber = parseInt(formData.payment.cardNumber);

    try {
      switch (cardNumber) {
        case 1:
          navigate('/thank-you', { 
            state: { 
              order: { ...order, ...formData } 
            } 
          });
          break;
        case 2:
          setError('Order declined');
          break;
        case 3:
          throw new Error('Payment gateway error');
        default:
          setError('Invalid card number');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No order found</h1>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Please complete your order details</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Order Form - Left Side */}
            <div className="md:w-1/2 p-6 border-r border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-400">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Shipping Address Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) =>
                          handleInputChange("address", "country", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) =>
                            handleInputChange("address", "city", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.address.state}
                          onChange={(e) =>
                            handleInputChange("address", "state", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.address.address}
                        onChange={(e) =>
                          handleInputChange("address", "address", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={formData.address.pincode}
                        onChange={(e) =>
                          handleInputChange("address", "pincode", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.payment.cardNumber}
                        onChange={(e) =>
                          handleInputChange("payment", "cardNumber", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.payment.expiryDate}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "expiryDate",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.payment.cvv}
                          onChange={(e) =>
                            handleInputChange("payment", "cvv", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={formData.payment.cardName}
                        onChange={(e) =>
                          handleInputChange("payment", "cardName", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-700 text-white py-3 px-4 rounded-md font-medium hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Place Order
                </button>
              </form>
            </div>

            {/* Order Summary - Right Side */}
            <div className="md:w-1/2 bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-6">
                {/* Product Details */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={order.product?.mainImage?.url}
                      alt={order.product?.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {order.product?.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.product?.description}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        Size: {order.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Color: {order.colors}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-lg font-medium text-gray-900">
                      ${(order.product?.price * order.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${(order.product?.price * order.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${(order.product?.price * order.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;