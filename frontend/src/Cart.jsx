import { useEffect } from "react";
import { useState } from "react";
import { ApiError } from "../../backend/src/utils/ApiError.js";
import axios from "axios";
import { addItemInCart, getCart, removeCartItem } from "./api/api.js";
import { Link } from "react-router-dom";
import { requestHandler } from "./utils/index.js";
import Loader from "./components/Loader.jsx";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

const Cart = () => {
  const [cartData, setCartData] = useState({ items: [], cartTotal: 0 });
  const [loading, setLoading] = useState(false);

  const getUserCart = async () => {
    requestHandler(
      async () => await getCart(),
      setLoading,
      (res) => {
        const data = res.data;
        setCartData(data || { items: [], cartTotal: 0 });
      },
      alert
    );
  };

  const deleteItem = async (productId) => {
    requestHandler(
      async () => await removeCartItem(productId),
      setLoading,
      (res) => {
        const data = res.data;
        setCartData(data || { items: [], cartTotal: 0 });
      },
      alert
    );
  };

  const handleCartQuantity = (productId, quantity) => {
    requestHandler(
      async () => await addItemInCart(productId, quantity),
      setLoading,
      (res) => {
        const data = res.data;
        setCartData(data || { items: [], cartTotal: 0 });
      },
      alert
    )
  }

  useEffect(() => {
    try {
      getUserCart();
    } catch (error) {
      throw new ApiError(500, "Failed to get the cart");
    }
  }, []);

  return (
    <>
      <div className="h-[80vh]">
        {loading ? (
          <Loader />
        ) : (
          <>
            {!cartData.items || cartData.items.length <= 0 ? (
              <div className="h-full flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                  <span className="font-bold text-3xl">Your cart is empty</span>
                  <Link
                    className="border p-4 bg-amber-700 text-white font-semibold rounded-xl"
                    to="/"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div>
                <h2>Your Cart</h2>
                {cartData.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-around items-center">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-36 w-36"
                        src={item.product.mainImage.url}
                        alt=""
                      />
                      <div>
                        <p>{item.product.name}</p>
                        <p>${item.product.price}</p>
                        <p>{item.product.variant.size}</p>
                        <p>{item.product.variant.colors}</p>
                      </div>
                    </div>

                    <div>
                      <span className="flex items-center gap-4">
                        <MinusIcon
                          onClick={() => {
                            if (item.quantity <= 1) return;
                            handleCartQuantity(item.product._id, item.quantity - 1);
                          }}
                          className="h-8"
                        />
                        <p>{item.quantity}</p>
                        <PlusIcon
                          onClick={() => handleCartQuantity(item.product._id, item.quantity + 1)}
                          className="h-8"
                        />
                      </span>
                    </div>

                    <div
                      onClick={() => deleteItem(item.product._id)}
                      className="flex items-center"
                    >
                      <TrashIcon className="h-8 w-8" />
                    </div>

                    <div>
                      <p>Total : ${(item.quantity * item.product.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3>Estimated Total : ${cartData.cartTotal.toFixed(2)}</h3>
              </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
