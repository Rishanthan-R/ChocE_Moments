import express from 'express';
import { addToCart, getCart } from '../controllers/cartController.js';
import { isUser } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

// Require login for all cart actions
cartRouter.use(isUser);

cartRouter.post('/add', addToCart);
cartRouter.get('/', getCart);

export default cartRouter;
