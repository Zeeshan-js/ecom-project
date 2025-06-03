import { useEffect, useState } from "react";
import { requestHandler } from "./utils/index.js";
import { addItemInCart, getAllProductItems } from "./api/api";
import Loader from "./components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

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
    navigate(`/product/${item._id}`)
  }

  const handleCart = async (item) => {
    await addItemInCart(item._id, 1)
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <h1>This is the landing page</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-4 gap-16 p-5">
          {products.map((item, i) => (
            <div key={i} className="h-40 w-40 border">
            <div
              key={item._id}
              onClick={() => handleProduct(item)}
            >
              <img className="h-40 w-40" src={item.mainImage.url} alt="" />
              <p className="font-semibold">{item.name}</p>
              <p>${item.price}</p>
            </div>
              <button className="border p-2 w-full cursor-pointer"
              onClick={() => handleCart(item)}
              >Add to cart</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default LandingPage;
