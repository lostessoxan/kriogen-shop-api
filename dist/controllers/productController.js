"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortedProducts = exports.getTopProducts = exports.createProductReview = exports.updateProduct = exports.createProduct = exports.deleteProduct = exports.getProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const getProducts = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber || 1);
        const keyword = req.query.keyword === "none"
            ? {}
            : {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            };
        const count = await productModel_1.default.countDocuments({ ...keyword });
        const products = await productModel_1.default.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ products, pages: Math.ceil(count / pageSize), page });
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.getProducts = getProducts;
const getTopProducts = async (req, res, next) => {
    try {
        const products = await productModel_1.default.find({}).sort({ rating: -1 }).limit(3);
        res.json(products);
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.getTopProducts = getTopProducts;
const getProduct = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
        if (!mongoose_1.default.isValidObjectId(id)) {
            next((0, http_errors_1.default)(400, "Id is not valid"));
        }
        const product = await productModel_1.default.findById(id);
        if (!product) {
            next((0, http_errors_1.default)(404, `Product not found`));
        }
        res.json(product);
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.getProduct = getProduct;
const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(id)) {
            next((0, http_errors_1.default)(400, "Id is not valid"));
        }
        await productModel_1.default.findByIdAndDelete(id);
        res.json({ message: "Product successfully deleted" });
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, `Product not found / Internal Server Error`));
    }
};
exports.deleteProduct = deleteProduct;
const createProduct = async (req, res, next) => {
    try {
        const product = new productModel_1.default({
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
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, image, description, countInStock, category, brand } = req.body;
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return next((0, http_errors_1.default)(400, "Id is not valid"));
        }
        const product = await productModel_1.default.findById(id);
        if (!product) {
            return next((0, http_errors_1.default)(404, "Product not found"));
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
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.updateProduct = updateProduct;
const createProductReview = async (req, res, next) => {
    const { comment, rating } = req.body;
    const { id } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(id)) {
            return next((0, http_errors_1.default)(400, "Id is not valid"));
        }
        const product = await productModel_1.default.findById(id);
        if (!product) {
            return next((0, http_errors_1.default)(404, "Product not found"));
        }
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            next((0, http_errors_1.default)(400, "Product already reviewed"));
        }
        else {
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
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.createProductReview = createProductReview;
const getSortedProducts = async (req, res, next) => {
    const { sortName } = req.params;
    const { sortOrder } = req.query;
    const orderNumber = Number(sortOrder) === 1 ? 1 : -1;
    try {
        const sortedProducts = await productModel_1.default.find().sort({
            [sortName]: orderNumber,
        });
        if (!sortedProducts) {
            next((0, http_errors_1.default)(404, `Products not found`));
        }
        res.json(sortedProducts);
    }
    catch (error) {
        next((0, http_errors_1.default)(500, `Something went wrong`));
    }
};
exports.getSortedProducts = getSortedProducts;
