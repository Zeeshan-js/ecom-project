import { useEffect, useRef, useState } from "react"
import { getAllProductItems } from "./api/api.js"
import { requestHandler } from "./utils/index.js"

function CheckoutPage() {
  const [products, setProducts] = useState([])

  const productRef = useRef()

  const getProducts = async () => {
    requestHandler(
      async () => await getAllProductItems(),
      null,
      (res) => {
        const { data } = res
        setProducts(data.docs || [])
      },
      alert
    )
  }

  const handleProduct = (id) => {
    productRef.current = id
    console.log(productRef)
  }


  useEffect(() => {
    getProducts()
  }, [])


    return (
        <>
        <div>
          <h1>This is checkout page</h1>
          <div className="grid grid-cols-4">
            {products.map((item) => (
            <div onClick={() => handleProduct(item._id)} className="h-28 w-28 border">
              <img src={item.mainImage.url} alt="" />
              <p className="font-semibold">{item.name}</p>
              <p>${item.price}</p>
            </div>
          ))}
          </div>
        </div>
        </>
    )
}

export default CheckoutPage