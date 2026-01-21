import express from 'express';
import { createOrder, getAllOrders } from '../controllers/orderController.js';
import { isUser, isAdmin } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.post('/', isUser, createOrder);
orderRouter.get('/', isUser, isAdmin, getAllOrders);

export default orderRouter;