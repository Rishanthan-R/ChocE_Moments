import express from "express";

import { createOrder} from "../controllers/orderController.js";

import { isUser } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();
orderRouter.post("/", isUser, createOrder)


export default orderRouter;