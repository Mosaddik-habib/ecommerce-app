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
exports.getOrdersByEmail = exports.getOrders = exports.createOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const product_1 = __importDefault(require("../models/product"));
const orderValidator_1 = require("../validators/orderValidator");
const zod_1 = require("zod");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedOrder = orderValidator_1.orderSchema.parse(req.body);
        const product = yield product_1.default.findById(validatedOrder.productId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        if (product.inventory.quantity < validatedOrder.quantity) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Insufficient quantity available in inventory",
            });
        }
        product.inventory.quantity -= validatedOrder.quantity;
        product.inventory.inStock = product.inventory.quantity > 0;
        yield product.save();
        const newOrder = new order_1.default(validatedOrder);
        yield newOrder.save();
        res
            .status(201)
            .json({
            success: true,
            message: "Order created successfully!",
            data: newOrder,
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
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find();
        res
            .status(200)
            .json({
            success: true,
            message: "Orders fetched successfully!",
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getOrders = getOrders;
const getOrdersByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.query.email) === null || _a === void 0 ? void 0 : _a.toString();
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Email query parameter is required" });
        }
        const orders = yield order_1.default.find({ email });
        res
            .status(200)
            .json({
            success: true,
            message: "Orders fetched successfully for user email!",
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getOrdersByEmail = getOrdersByEmail;
