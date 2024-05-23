"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/api/products", products_1.default);
app.use("/api/orders", orders_1.default);
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
exports.default = app;
