import { useEffect } from "react";
import { useState } from "react";
import { ApiError } from "../../backend/src/utils/ApiError.js";
import axios from "axios";
import { getCart } from "./api/api.js";
import { Link } from "react-router-dom";
import { requestHandler } from "./utils/index.js";
import Loader from "./components/Loader.jsx";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

const Cart = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false)

  const getUserCart = async () => {
    requestHandler(
      async () => await getCart(),
      setLoading,
      (res) => {
        const data = res.data
        setCarts(data.items || [])
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

  useEffect(() => {
    console.log(carts)
  }, [carts])

  return (
    <>
      <div>
        {loading ? ( <Loader />) : (
          <>
          {carts.length <= 0 ? (
          <div>
            <div className="flex justify-center">
              <span>Your cart is empty</span>
              <Link className="border p-2" to="/">Continue shopping</Link>
            </div>
          </div>
        ) : (
          <div>
            <h2>Your Cart</h2>
            {carts.map((item) => (
              <div className="flex ">
                <img className="h-36 w-36" src={item.product.mainImage.url} alt="" />
                <div>
                  <p>{item.product.name}</p>
                  <p>${item.product.price}</p>
                  <p>{item.product.variant.size}</p>
                  <p>{item.product.variant.colors}</p>
                </div>

                <div>
                  <h2>Quantity</h2>
                  <span className="flex items-center gap-4">
                    <MinusIcon className="h-8"/>
                    <p>{item.quantity}</p>
                    <PlusIcon className="h-8"/>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
