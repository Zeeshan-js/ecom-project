import React, { useState } from "react"
import UploadProduct from "./UploadProduct.jsx"
import { Link } from "react-router-dom"

const Navbar = () => {

    const [product, setProduct] = useState([])
    const [uploadProduct, setUploadProduct] = useState(false)

    return (
        <>
        {uploadProduct ? <UploadProduct open={uploadProduct} onClose={() => { setUploadProduct(false)}} /> : null}
        <div className="h-16 bg-blue-800 relative flex justify-center items-center gap-2">
        <button className="text-white border absolute left-2" onClick={() => setUploadProduct(true)}>Upload Product</button>
           <Link to="/landingPage">Home</Link>
            <Link to="/catalog">Catalog</Link>

            <div className="absolute right-5">
                <Link to="/cart">Cart</Link>
            </div>
        </div>
        </>
    )
}

export default Navbar;