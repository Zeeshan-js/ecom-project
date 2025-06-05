import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { getCart } from "./cart.controller.js";

// Payment processing simulation
const processPayment = async (paymentDetails) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (paymentDetails.cardNumber) {
        case "1":
            return {
                success: true,
                status: "APPROVED",
                message: "Transaction approved successfully"
            };
        case "2":
            return {
                success: false,
                status: "DECLINED",
                message: "Transaction declined by the bank"
            };
        case "3":
            return {
                success: false,
                status: "GATEWAY_ERROR",
                message: "Payment gateway error occurred"
            };
        default:
            return {
                success: false,
                status: "INVALID",
                message: "Invalid card number"
            };
    }
};

const createOrder = asyncHandler(async (req, res) => {
    const { 
        address,
        payment,
        orderPrice
    } = req.body;
    const { productId } = req.params;

    // Validate required fields
    if (!address || !payment || !orderPrice) {
        throw new ApiError(400, "Please provide all required order details");
    }

    // Validate nested address fields
    if (!address.country || !address.state || !address.city || !address.address || !address.pincode) {
        throw new ApiError(400, "Please provide all address details");
    }

    // Validate nested payment fields
    if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.cardName) {
        throw new ApiError(400, "Please provide all payment details");
    }

    let orderItems;
    let itemsWithQuantity = [];

    if (productId) {
        // If productId is provided, create order for single product
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        
        // Get quantity from request body for single product order
        const quantity = req.body.quantity || 1;
        
        // Check if enough stock is available
        if (product.stock < quantity) {
            throw new ApiError(400, `Only ${product.stock} items available in stock`);
        }
        
        orderItems = [product];
        itemsWithQuantity = [{ product, quantity }];
    } else {
        // Otherwise use cart items
        const cart = await getCart(req.user._id);
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new ApiError(400, "No items in cart");
        }

        // Check stock availability for all cart items
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                throw new ApiError(404, `Product ${item.product.name} not found`);
            }
            if (product.stock < item.quantity) {
                throw new ApiError(400, `Only ${product.stock} items available for ${product.name}`);
            }
        }
        
        orderItems = cart.items.map(item => item.product);
        itemsWithQuantity = cart.items.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
    }

    // Process payment
    const paymentResult = await processPayment({ 
        cardNumber: payment.cardNumber, 
        expiryDate: payment.expiryDate, 
        cvv: payment.cvv, 
        cardName: payment.cardName 
    });

    if (!paymentResult.success) {
        throw new ApiError(
            paymentResult.status === "GATEWAY_ERROR" ? 503 : 400,
            paymentResult.message
        );
    }

    // Create order
    const order = await Order.create({
        address: {
            country: address.country,
            state: address.state,
            city: address.city,
            address: address.address,
            pincode: address.pincode
        },
        payment: {
            cardNumber: payment.cardNumber,
            expiryDate: payment.expiryDate,
            cvv: payment.cvv,
            cardName: payment.cardName,
            status: paymentResult.status
        },
        customer: req.user._id,
        items: orderItems,
        orderPrice,
        status: paymentResult.status
    });

    // Update stock and inventory for each product
    for (const item of itemsWithQuantity) {
        await Product.findByIdAndUpdate(
            item.product._id,
            {
                $inc: { stock: -item.quantity }, // Decrease stock by ordered quantity
                $set: { inventoryCount: item.quantity } // Set inventory count to ordered quantity
            },
            { new: true }
        );
    }

    // Clear cart after successful order creation if ordering from cart
    if (!productId) {
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } }
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201, 
            {
                order: order._id,
                paymentStatus: paymentResult.status,
                redirectUrl: `/api/v1/${order._id}/status`
            },
            paymentResult.message
        )
    );
});

// Get order status and handle thank you page redirection
const getOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
        .populate('items')
        .populate('customer', 'username email');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to view this order");
    }

    if (order.status === "APPROVED") {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    order,
                    shouldRedirect: true,
                    redirectUrl: `/thank-you?orderId=${orderId}`
                },
                "Order approved successfully"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                order,
                shouldRedirect: false,
                error: order.status === "DECLINED" ? "Payment was declined" : "Payment processing error"
            },
            `Order status: ${order.status}`
        )
    );
});

export {
    createOrder,
    getOrderStatus
};