import { useEffect, useState } from "react"
import { getAllProductItems } from "./api/api.js"
import { requestHandler } from "./utils/index.js"
import { useNavigate } from "react-router-dom"
import Loader from "./components/Loader.jsx"

function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getProducts = async () => {
    requestHandler(
      async () => await getAllProductItems(),
      setLoading,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
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
                <h2 className="text-lg font-medium text-gray-900 mb-1 truncate">
                  {item.name}
                </h2>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-amber-700">
                    ${item.price.toFixed(2)}
                  </p>
                  {item.variant && (
                    <p className="text-sm text-gray-500">
                      {item.variant.size?.length || 0} sizes
                    </p>
                  )}
                </div>
                {item.variant && item.variant.colors && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-sm text-gray-500">Colors:</span>
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
  )
}

export default Catalog;