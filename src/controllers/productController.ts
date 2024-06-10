import Product from "../models/productModel";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { SortOrder } from "mongoose";

const getProducts: RequestHandler<
  unknown,
  unknown,
  unknown,
  { pageNumber: number; keyword: string }
> = async (req, res, next) => {
  try {
    const pageSize = 10;

    const page = Number(req.query.pageNumber || 1);

    const keyword =
      req.query.keyword === "none"
        ? {}
        : {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          };

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, pages: Math.ceil(count / pageSize), page });
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

const getTopProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

const getProduct: RequestHandler<{ id: string }> = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  try {
    if (!mongoose.isValidObjectId(id)) {
      next(createHttpError(400, "Id is not valid"));
    }

    const product = await Product.findById(id);

    if (!product) {
      next(createHttpError(404, `Product not found`));
    }

    res.json(product);
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

const deleteProduct: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      next(createHttpError(400, "Id is not valid"));
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product successfully deleted" });
  } catch (error: any) {
    next(
      createHttpError(
        error.status,
        `Product not found / Internal Server Error`,
      ),
    );
  }
};

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    name: string;
  };
}

const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = new Product({
      name: "Sample Name",
      price: 0,
      user: req.user._id,
      image: "/images/sample.png",
      brand: "Sample brand",
      category: "sample category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });

    const newProduct = await product.save();

    res.json(newProduct);
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

interface UpdateProductBody {
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  countInStock?: number;
  category?: string;
  brand?: string;
}

const updateProduct: RequestHandler<
  {
    id: string;
  },
  unknown,
  UpdateProductBody
> = async (req, res, next) => {
  try {
    const { name, price, image, description, countInStock, category, brand } =
      req.body;

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(createHttpError(400, "Id is not valid"));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.description = description || product.description;
    product.countInStock = countInStock || product.countInStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;

    await product.save();

    res.json({ message: "Product was successfully updated" });
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

const createProductReview: RequestHandler<
  { id: string },
  unknown,
  { comment: string; rating: string }
> = async (req, res, next) => {
  const { comment, rating } = req.body;

  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return next(createHttpError(400, "Id is not valid"));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      next(createHttpError(400, "Product already reviewed"));
    } else {
      const review = {
        user: req.user._id,
        name: req.user.name,
        comment,
        rating: Number(rating),
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.numReviews;

      await product.save();

      res.status(201).json({ message: "Review added" });
    }
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

const getSortedProducts: RequestHandler<
  { sortName: string },
  unknown,
  unknown,
  { sortOrder: string }
> = async (req, res, next) => {
  const { sortName } = req.params;
  const { sortOrder } = req.query;

  const orderNumber = Number(sortOrder) === 1 ? 1 : -1;

  try {
    const sortedProducts = await Product.find().sort({
      [sortName]: orderNumber,
    });

    if (!sortedProducts) {
      next(createHttpError(404, `Products not found`));
    }

    res.json(sortedProducts);
  } catch (error: any) {
    next(createHttpError(500, `Something went wrong`));
  }
};

export {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getSortedProducts,
};
