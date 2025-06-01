import mongoose, { Schema } from "mongoose"

const addressSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Address = mongoose.model("Address", addressSchema)
