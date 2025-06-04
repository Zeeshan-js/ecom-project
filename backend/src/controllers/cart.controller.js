import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const getCart = async (userId) => {
  const cartAggregation = await Cart.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        product: { $first: "$product" },
        quantity: "$items.quantity",
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$$ROOT"
        },
        cartTotal: {
          $sum: {
            $multiply: ["$product.price", "$quantity"]
          },
        },
      },
    },
  ]);

  return (
    cartAggregation[0] ?? {
      _id: null,
      items: [],
      cartTotal: 0,
    }
  );
};

const getUserCart = asyncHandler(async (req, res) => {
  let cart = await getCart(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addItemsOrUpdateItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;


  // fetch the user cart
  const cart = await Cart.findOne({ owner: req.user._id });


  const product = await Product.findById(productId);


  if (!product) {
    throw new ApiError(404, "Product does not exists");
  }

  const addedProduct = cart.items?.find(
    (item) => item.productId.toString() === productId
  );

  if (addedProduct) {
    addedProduct.quantity = quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save({ validateBeforeSave: true})

  const newCart = await getCart(req.user._id);


  return res
    .status(200)
    .json(new ApiResponse(200, newCart, "Item added to cart"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;


  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product does not exits");
  }

  const cart = await Cart.findOneAndUpdate(
    { owner: req.user._id },
    {
      $pull: {
        items: {
          productId: productId,
        },
      },
    },
    { new: true }
  );

  const newCart = await getCart(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, newCart, "Item removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { owner: req.user._id },
    {
      $set: {
        items: [],
      },
    },
    { new: true }
  );

  const cart = await getCart(req.user._id)

  return res.status(200).json(new ApiResponse(200, cart, "Cart has been cleared"))
});

export { addItemsOrUpdateItemQuantity, removeItemFromCart, clearCart, getCart, getUserCart };
