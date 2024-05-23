"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const productValidator_1 = require("../validators/productValidator");
const zod_1 = require("zod");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedProduct = productValidator_1.productSchema.parse(req.body);
        const newProduct = new product_1.default(validatedProduct);
        yield newProduct.save();
        res
            .status(201)
            .json({
            success: true,
            message: "Product created successfully!",
            data: newProduct,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Validation Error",
                errors: error.errors,
            });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find();
        res
            .status(200)
            .json({
            success: true,
            message: "Products fetched successfully!",
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.findById(req.params.productId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        res
            .status(200)
            .json({
            success: true,
            message: "Product fetched successfully!",
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedProduct = productValidator_1.productSchema.parse(req.body);
        const product = yield product_1.default.findByIdAndUpdate(req.params.productId, validatedProduct, { new: true });
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        res
            .status(200)
            .json({
            success: true,
            message: "Product updated successfully!",
            data: product,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Validation Error",
                errors: error.errors,
            });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.findByIdAndDelete(req.params.productId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        res
            .status(200)
            .json({
            success: true,
            message: "Product deleted successfully!",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteProduct = deleteProduct;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const searchTerm = ((_a = req.query.searchTerm) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const products = yield product_1.default.find({ name: new RegExp(searchTerm, "i") });
        res
            .status(200)
            .json({
            success: true,
            message: `Products matching search term '${searchTerm}' fetched successfully!`,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.searchProducts = searchProducts;
