import { useEffect, useRef, useState } from "react"
import { getAllProductItems, getProduct } from "./api/api.js"
import { requestHandler } from "./utils/index.js"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

function Catalog() {
  const [products, setProducts] = useState([])

  const { productId } = useParams()
  const navigate = useNavigate()

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

  const handleProduct = async (item) => {
        navigate(`/product/${item._id}`)
  }


  useEffect(() => {
    getProducts()
  }, [])


    return (
        <>
        <div>
          <div className="grid grid-cols-4 gap-16 p-5">
            {products.map((item) => (
            <div key={item._id} onClick={() => handleProduct(item)} className="h-40 w-40 border">
              <img className="h-40 w-40" src={item.mainImage.url} alt="" />
              <p className="font-semibold">{item.name}</p>
              <p>${item.price}</p>
            </div>
          ))}
          </div>
        </div>
        </>
    )
}

export default Catalog;