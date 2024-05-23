"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
router.post("/", orderController_1.createOrder);
router.get("/", orderController_1.getOrders);
router.get("/email", orderController_1.getOrdersByEmail);
exports.default = router;
