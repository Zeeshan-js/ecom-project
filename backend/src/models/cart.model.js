import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            default: 1,
            required: true,
            min: [1, "Quantity cannot be less than 1"],
          },
        },
      ],
      default: []
    }
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
