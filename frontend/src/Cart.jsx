import { useEffect } from "react";
import { useState } from "react";
import { ApiError } from "../../backend/src/utils/ApiError.js";
import axios from "axios";
import { getCart } from "./api/api.js";

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
        getCart();
    } catch (error) {
      throw new ApiError(500, "Failed to get the cart");
    }
  }, []);

  return (
    <>
      <div>
        {items.length <= 0 ? (
          <div>
            <div className="flex justify-center">
              <span>Your cart is empty</span>
              <a className="border p-3" href="/">Continue shopping</a>
            </div>
          </div>
        ) : (
          <div>
            {items.map((item) => {
              <div>
                <img src={item.mainImage.url} alt="" />
              </div>;
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
