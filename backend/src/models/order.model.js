import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema ({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    orderPrice: {
        type: Number,
        required: true
    },
    items: {
        type: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    min: [1, "Quantity cannot be less than 1"],
                    default: 1,
                    required: true
                }
            }
        ],
        default: []
    },
    address: {
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
    },
    payment: {
        cardNumber: {
            type: Number,
            required: true
        },
        expiryDate: {
            type: Number,
            required: true
        },
        securityCode: {
            type: Number,
            required: true
        },
        cardName: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema)