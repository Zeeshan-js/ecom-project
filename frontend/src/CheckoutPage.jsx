import { useLocation } from "react-router-dom";


const CheckoutPage = () => {
    const location = useLocation()
    const { order } = location.state || {}

    return (
        <>
        <h1>Checkout Page</h1>
        {order.quantity}
        </>
    )
}

export default CheckoutPage;