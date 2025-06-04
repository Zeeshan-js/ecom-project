import { useEffect, useState } from "react";
import { requestHandler } from "./utils/index.js";
import { addItemInCart, getAllProductItems } from "./api/api";
import Loader from "./components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProducts = async () => {
    await requestHandler(
      async () => await getAllProductItems(),
      setLoading,
      (res) => {
        const data = res.data;
        setProducts(data.docs);
      },
      alert
    );
  };

  const handleProduct = async (item) => {
    navigate(`/product/${item._id}`);
  };

  const handleCart = async (e, item) => {
    e.stopPropagation(); // Prevent triggering the card click
    await addItemInCart(item._id, 1);
    alert("Item added to cart");
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Welcome to Our Store
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-amber-100">
              Discover our latest collection of premium products
            </p>
            <div className="mt-10">
              <button
                onClick={() => navigate('/catalog')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                View All Products
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((item) => (
            <div
              key={item._id}
              onClick={() => handleProduct(item)}
              className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative aspect-square">
                <img
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  src={item.mainImage.url}
                  alt={item.name}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-amber-700">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => handleCart(e, item)}
                    className="inline-flex items-center p-2 text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
                  >
                    <ShoppingBagIcon className="h-6 w-6" />
                  </button>
                </div>
                {item.variant && item.variant.colors && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-sm text-gray-500">Available in</span>
                    <div className="flex gap-1">
                      {item.variant.colors.slice(0, 3).map((color, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {color}
                        </span>
                      ))}
                      {item.variant.colors.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{item.variant.colors.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
