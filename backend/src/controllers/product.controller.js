import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getLocalPath,
  getMongoosePagination,
  getStaticFilePath,
  removeLocalFile,
} from "../utils/helper.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

const getAllProduct = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const productAggregate = Product.aggregate([{ $match: {} }]);

  const products = await Product.aggregatePaginate(
    productAggregate,
    getMongoosePagination(page, limit)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Product fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, variant, stock, price, mainImage } = req.body;
  
  const mainImageUrl = req.files?.mainImage[0]?.path
  
  if (!mainImageUrl) {
    throw new ApiError(404, "Main Image is required");
  }

  const mainImageLocalPath = await cloudinaryUpload(mainImageUrl);

  if (!mainImageLocalPath) {
    throw new ApiError(500, "Image could not be uploaded")
  }

  const subImages =
    req.files.subImages && req.files.subImages.length
      ? req.files.subImages.map((image) => {
          const imageUrl = getStaticFilePath(req, image.filename);
          const imageLocalPath = getLocalPath(image.filename);
          return { url: imageUrl, localPath: imageLocalPath };
        })
      : [];

  const owner = req.user._id;

  const product = await Product.create({
    name,
    description,
    variant,
    stock,
    price,
    mainImage: mainImageLocalPath,
    subImages,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findOneAndDelete({
        _id: productId
    });

    if (!product) {
        throw new ApiError(404, "Product does not exist")
    }

    const productImages = [product.mainImage, ...product.subImages];

    productImages.map((image) => {
        removeLocalFile(image.localPath);
    });

    return res.status(200).json(new ApiResponse(200, { deletedProduct: product }, "Product deleted successfully"))
});

export { createProduct, deleteProduct, getAllProduct }