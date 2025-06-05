import { useEffect, useState } from "react";
import { requestHandler } from "./utils/index.js";
import { getProduct } from "./api/api.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const navigate = useNavigate();
  const { productId } = useParams();

  const productById = async () => {
    await requestHandler(
      async () => await getProduct(productId),
      setLoadingProduct,
      (res) => {
        const data = res.data;
        setProduct(data);
        // Set default selections when product data is loaded
        if (data?.variant?.size?.length > 0) {
          setSelectedSize(data.variant.size[0]);
        }
        if (data?.variant?.colors?.length > 0) {
          setSelectedColor(data.variant.colors[0]);
        }
      },
      alert
    );
  };

  const handleProduct = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }

    const orderData = {
      items: [{
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          mainImage: product.mainImage
        },
        quantity: quantity,
        selectedVariant: {
          size: selectedSize,
          color: selectedColor
        }
      }],
      totalAmount: product.price * quantity
    };

    console.log("Navigating to checkout with order data:", orderData);
    
    navigate("/checkout", { 
      state: { 
        order: orderData 
      } 
    });
  };

  useEffect(() => {
    productById();
  }, []);

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-[600px] w-full">
                <img 
                  className="absolute inset-0 w-full h-full object-cover"
                  src={product?.mainImage?.url}
                  alt={product.name}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  
                  <p className="text-2xl font-semibold text-amber-700 mb-6">
                    ${product.price?.toFixed(2)}
                  </p>

                  <div className="space-y-6">
                    {/* Size Selection */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {product?.variant?.size.map((size, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                              ${selectedSize === size
                                ? 'bg-amber-700 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {product?.variant?.colors.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                              ${selectedColor === color
                                ? 'bg-amber-700 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Quantity</h3>
                      <div className="inline-flex items-center border border-gray-200 rounded-lg">
                        <button
                          className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                          disabled={quantity <= 1}
                        >
                          <MinusIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <span className="px-6 py-2 text-gray-900 font-medium">
                          {quantity}
                        </span>
                        <button
                          className="p-3 hover:bg-gray-100 transition-colors"
                          onClick={() => setQuantity(q => q + 1)}
                        >
                          <PlusIcon className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleProduct}
                    className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Buy Now
                  </button>
                  <Link
                    to="/cart"
                    className="block text-center w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
