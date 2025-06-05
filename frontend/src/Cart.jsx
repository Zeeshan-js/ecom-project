import { useEffect } from "react";
import { useState } from "react";
import { ApiError } from "../../backend/src/utils/ApiError.js";
import axios from "axios";
import { addItemInCart, getCart, removeCartItem } from "./api/api.js";
import { Link, useNavigate } from "react-router-dom";
import { requestHandler } from "./utils/index.js";
import Loader from "./components/Loader.jsx";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({ items: [], cartTotal: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [stockWarnings, setStockWarnings] = useState({});

  const getUserCart = async () => {
    requestHandler(
      async () => await getCart(),
      setLoading,
      (res) => {
        const data = res.data;
        setCartData(data || { items: [], cartTotal: 0 });
        // Set default selected variants for each item
        if (data?.items) {
          const defaultVariants = data.items.reduce((acc, item) => {
            acc[item.product._id] = {
              size: item.product.variant.size[0],
              color: item.product.variant.colors[0],
            };
            return acc;
          }, {});
          setSelectedVariants(defaultVariants);
        }
      },
      alert
    );
  };

  const handleVariantChange = (productId, type, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value,
      },
    }));
  };

  const deleteItem = async (productId) => {
    requestHandler(
      async () => await removeCartItem(productId),
      setLoading,
      (res) => {
        const data = res.data;
        setCartData(data || { items: [], cartTotal: 0 });
        // Clear any stock warnings for the deleted item
        setStockWarnings(prev => {
          const newWarnings = { ...prev };
          delete newWarnings[productId];
          return newWarnings;
        });
      },
      alert
    );
  };

  const handleCartQuantity = (productId, quantity, stock) => {
    // Clear any existing warning for this product
    setStockWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[productId];
      return newWarnings;
    });

    // Validate stock before updating
    if (quantity > stock) {
      setStockWarnings(prev => ({
        ...prev,
        [productId]: `Only ${stock} items available in stock`
      }));
      return;
    }

    requestHandler(
      async () => await addItemInCart(productId, quantity),
      setLoading,
      (res) => {
        const data = res.data;
        setCartData(data || { items: [], cartTotal: 0 });
      },
      alert
    );
  };

  const handleCheckout = () => {
    // Validate that all items have variants selected
    const allItemsHaveVariants = cartData.items.every(item => 
      selectedVariants[item.product._id]?.size && 
      selectedVariants[item.product._id]?.color
    );

    if (!allItemsHaveVariants) {
      alert("Please select size and color for all items");
      return;
    }

    // Check if any items exceed available stock
    const stockExceeded = cartData.items.some(item => item.quantity > item.product.stock);
    if (stockExceeded) {
      alert("Some items in your cart exceed available stock. Please adjust quantities.");
      return;
    }

    // Create order object with cart data and selected variants
    const orderData = {
      items: cartData.items.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          mainImage: item.product.mainImage
        },
        quantity: item.quantity,
        selectedVariant: selectedVariants[item.product._id]
      })),
      totalAmount: cartData.cartTotal
    };

    // Navigate to checkout page with order data
    navigate('/checkout', { 
      state: { 
        order: orderData 
      } 
    });
  };

  useEffect(() => {
    try {
      getUserCart();
    } catch (error) {
      throw new ApiError(500, "Failed to get the cart");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <>
            {!cartData.items?.length ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Add some items to your cart to continue shopping
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Shopping Cart
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartData.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-6">
                        <img
                          className="h-24 w-24 object-cover rounded-md"
                          src={item.product.mainImage.url}
                          alt={item.product.name}
                        />
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-lg font-medium text-amber-700">
                            ${item.product.price.toFixed(2)}
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                Size:
                              </span>
                              <div className="flex gap-2">
                                {item.product.variant.size.map(
                                  (size, sizeIdx) => (
                                    <button
                                      key={sizeIdx}
                                      onClick={() =>
                                        handleVariantChange(
                                          item.product._id,
                                          "size",
                                          size
                                        )
                                      }
                                      className={`px-3 py-1 text-sm rounded-md ${
                                        selectedVariants[item.product._id]
                                          ?.size === size
                                          ? "bg-amber-700 text-white"
                                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                      }`}
                                    >
                                      {size}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                Color:
                              </span>
                              <div className="flex gap-2">
                                {item.product.variant.colors.map(
                                  (color, colorIdx) => (
                                    <button
                                      key={colorIdx}
                                      onClick={() =>
                                        handleVariantChange(
                                          item.product._id,
                                          "color",
                                          color
                                        )
                                      }
                                      className={`px-3 py-1 text-sm rounded-md ${
                                        selectedVariants[item.product._id]
                                          ?.color === color
                                          ? "bg-amber-700 text-white"
                                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                      }`}
                                    >
                                      {color}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-8">
                        <div className="space-y-2">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) return;
                                handleCartQuantity(
                                  item.product._id,
                                  item.quantity - 1,
                                  item.product.stock
                                );
                              }}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="h-5 w-5 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleCartQuantity(
                                  item.product._id,
                                  item.quantity + 1,
                                  item.product.stock
                                )
                              }
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <PlusIcon className="h-5 w-5 text-gray-600" />
                            </button>
                          </div>
                          {stockWarnings[item.product._id] && (
                            <p className="text-sm text-amber-600">
                              {stockWarnings[item.product._id]}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {item.product.stock} available
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteItem(item.product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Estimated Total
                    </h3>
                    <p className="text-2xl font-semibold text-amber-700">
                      ${cartData.cartTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-6 text-right">
                    <button 
                      onClick={handleCheckout}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
