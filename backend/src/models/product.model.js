import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    variant: {
      size: {
        type: [
          {
            type: String
          }
        ],
      },
      colors: {
        type: [
          {
            type: String
          }
        ],
      },
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    inventoryCount: {
      type: Number,
      default: 0
    },
    mainImage: {
        type: {
            url: String,
            localPath: String
        }
    },
    subImages: {
        type: [
            {
                url: String,
                localPath: String
            }
        ],
        default: []
    }
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate)

export const Product = mongoose.model("Product", productSchema);
