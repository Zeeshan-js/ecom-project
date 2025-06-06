import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema ({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    orderPrice: {
        type: Number,
        required: true
    },
    items: [{
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "DECLINED", "GATEWAY_ERROR"],
        default: "PENDING"
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
            type: String,
            required: true
        },
        expiryDate: {
            type: String,
            required: true
        },
        cvv: {
            type: String,
            required: true
        },
        cardName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "DECLINED", "GATEWAY_ERROR"],
            default: "PENDING"
        }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual field for order total
orderSchema.virtual('totalItems').get(function() {
    return this.items.length;
});

// Add method to update order status
orderSchema.methods.updateStatus = async function(status) {
    this.status = status;
    this.payment.status = status;
    return await this.save();
};

// Add indexes for better query performance
orderSchema.index({ customer: 1, status: 1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema)