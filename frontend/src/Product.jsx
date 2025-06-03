import { useEffect, useState } from "react";
import { requestHandler } from "./utils/index.js";
import { getProduct } from "./api/api.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import CheckoutPage from "./CheckoutPage.jsx";

const Product = () => {
  const [product, setProduct] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const navigate = useNavigate()

  const [order, setOrder] = useState({
    product: product,
    size: selectedSize,
    colors: selectedColor,
    quantity: 0,
    orderPrice: product.price * quantity
  });

  const { productId } = useParams();

  const productById = async () => {
    await requestHandler(
      async () => await getProduct(productId),
      setLoadingProduct,
      (res) => {
        setProduct(res.data || []);
      },
      alert
    );
  };

  const handleProduct = () => {
    console.log(order);
    navigate("/checkout", { state: { order }})
  };

  useEffect(() => {
    productById();
  }, []);

  useEffect(() => {
    if (
      product &&
      product.variant &&
      product.variant.size &&
      product.variant.size.length > 0
    ) {
      setSelectedSize(0);
    }
    if (
      product &&
      product.variant &&
      product.variant.colors &&
      product.variant.colors.length > 0
    ) {
      setSelectedColor(0);
    }
  }, [product]);

  useEffect(() => {
    setOrder({
      product: product,
      size: product?.variant?.size?.[selectedSize] || null,
      colors: product?.variant?.colors?.[selectedColor] || null,
      quantity: quantity,
    });
  }, [product, selectedColor, selectedSize, quantity]);

  return (
    <>
      {loadingProduct ? (
        <Loader />
      ) : (
        <div className="flex">
          <div>
            <img src={product?.mainImage?.url} alt="" />
          </div>
          <div>
            <h1 className="font-semibold">{product.name}</h1>
            <p>Size</p>
            <div className="flex gap-4">
              {product?.variant?.size.map((item, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    setOrder((prev) => ({
                      ...order,
                      size: selectedSize,
                    }));
                    setSelectedSize(i);
                  }}
                  style={{
                    background: selectedSize === i ? "white" : "gray",
                    color: selectedSize === i ? "black" : "white",
                  }}
                  className="border p-2 rounded-xl text-white text-center cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {product?.variant?.colors.map((item, i) => (
                <div
                  key={i}
                  className="border p-2 rounded-xl cursor-pointer"
                  onClick={(e) => {
                    setOrder((prev) => ({
                      ...order,
                      color: selectedColor,
                    })),
                      setSelectedColor(i);
                  }}
                  style={{
                    background: selectedColor === i ? "white" : "gray",
                    color: selectedColor === i ? "black" : "white",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <p>Quantity</p>
            <div className="h-16 w-36 border flex items-center justify-between">
              <MinusIcon
                className="h-8 w-8 cursor-pointer"
                onClick={() => {
                  if (quantity <= 1) return;
                  setQuantity((prev) => prev - 1);
                }}
              />
              {quantity}
              <PlusIcon
                className="h-8 w-8 cursor-pointer"
                onClick={() => setQuantity((prev) => prev + 1)}
              />
            </div>

            <p>${product.price}</p>

            <button
              onClick={handleProduct}
              className="border p-4 bg-gray-700 text-white cursor-pointer"
            >
              Buy it now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
