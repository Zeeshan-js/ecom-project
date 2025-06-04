import { useLocation, Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const ThankYouPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No order found</h1>
          <Link
            to="/catalog"
            className="mt-4 inline-block px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800"
          >
            Continue Shopping
          </Link>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Confirmation #{order.id || "IARX65UUG"}
            </h2>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Thank you!</h1>
          </div>

          {/* Map */}
          <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
            <div className="bg-white p-4">
              <h3 className="font-medium text-gray-900">Shipping address</h3>
              <p className="text-gray-600">{order.address.address}</p>
              <p className="text-gray-600">
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p className="text-gray-600">{order.address.country}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Order details</h3>
            
            {/* Contact Information */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Contact information
              </h4>
              <p className="text-gray-600">{order.payment.cardName}</p>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Payment method
              </h4>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-amber-700 rounded-md flex items-center justify-center text-white font-bold mr-2">
                  B
                </div>
                <span className="text-gray-600">
                  •••• {order.payment.cardNumber.slice(-4)} • ₹
                  {(order.product?.price * order.quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Shipping method
              </h4>
              <p className="text-gray-600">Standard</p>
            </div>

            {/* Product Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={order.product?.mainImage?.url}
                    alt={order.product?.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {order.product?.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {order.size} / {order.colors}
                  </p>
                  <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="font-medium text-gray-900">
                    ₹{(order.product?.price * order.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(order.product?.price * order.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated taxes</span>
                  <span>₹{(order.product?.price * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    ₹
                    {(
                      order.product?.price * order.quantity +
                      order.product?.price * 0.18
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need help?{" "}
              <Link to="/contact" className="text-amber-700 hover:text-amber-800">
                Contact us
              </Link>
            </p>
            <Link
              to="/catalog"
              className="inline-block px-6 py-3 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 