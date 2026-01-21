import Order from '../models/order.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';



export async function createOrder(req, res) {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
            return res.status(503).json({
                message: "Database connection error. Please check if MongoDB is running.",
                error: "MongoDB not connected"
            });
        }

        console.log('Creating order...');

        if (req.user == null) {
            return res.status(401).json({
                message: "Please login to create an order"
            });
        }

        const items = [];
        let total = 0;

        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ message: "Invalid items format or empty cart" });
        }

        
        let orderId = "CM00001"; // Default start
        try {
            
            const latestOrder = await Order.findOne().sort({ _id: -1 });
            if (latestOrder && latestOrder.orderId) {
                const lastIdStr = latestOrder.orderId.replace("CM", "");
                const lastIdNum = parseInt(lastIdStr, 10);
                if (!isNaN(lastIdNum)) {
                    orderId = "CM" + (lastIdNum + 1).toString().padStart(5, "0");
                }
            }
        } catch (idError) {
            console.error('Error generating Order ID:', idError);
            // Fallback to random ID to avoid collision if generation fails
            orderId = "CM" + Math.floor(Math.random() * 100000).toString().padStart(5, "0");
        }
        

        for (let i = 0; i < req.body.items.length; i++) {
            let item = req.body.items[i];

            // Basic validation
            if (!item.productId || !item.name || !item.quantity) {
                return res.status(400).json({
                    message: `Invalid item at index ${i}: missing required fields`,
                });
            }

            // Find product
            let product = null;
            try {
                product = await Product.findOne({ productId: item.productId });
            } catch (e) {
                console.warn(`Product lookup failed for ${item.productId}`, e);
            }

            
            if (product && product.options && product.options.length > 0) {
                

                const selectedOptions = item.selectedOptions || {};

                for (const option of product.options) {
                    const userValue = selectedOptions[option.name];

                    // 1. Check if required option is missing
                    if (!userValue) {
                        return res.status(400).json({
                            message: `Missing required option '${option.name}' for product '${product.name}'`
                        });
                    }

                    // 2. Check if selected value is valid
                    if (!option.values.includes(userValue)) {
                        return res.status(400).json({
                            message: `Invalid value '${userValue}' for option '${option.name}'. Allowed: ${option.values.join(", ")}`
                        });
                    }
                }
            }
            

            
            if (!product) {
                
                return res.status(400).json({ message: `Product not found: ${item.productId}` });
            }

            
            const pricePerUnit = product.price;

            

            items.push({
                productId: product.productId,
                name: product.name,
                image: product.image,
                price: pricePerUnit,
                quantity: Number(item.quantity),
                pieces: Number(item.pieces) || 0,
                basePrice: pricePerUnit,       // Store the verified unit price
                totalPrice: pricePerUnit,      // Consistent with original `itemTotalPrice` usage (unit price)
                addOns: item.addOns || { giftCard: false, customName: null }
            });

            // Calculate total using the trusted unit price and quantity
            total += pricePerUnit * Number(item.quantity);
        }

        // Validate user info from token/body
        if (!req.body.address || !req.body.phone) {
            return res.status(400).json({ message: "Address and Phone are required." });
        }

        const orderData = {
            orderId: orderId,
            email: req.user.email,
            name: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email, // Fallback name
            address: req.body.address,
            phone: req.body.phone,
            items: items,
            total: total,
            paymentMethod: req.body.paymentMethod || "cash",
            date: new Date() // Explicitly set date
        };

        const order = new Order(orderData);
        const result = await order.save();

        console.log('Order saved:', result.orderId);
        res.json({
            message: "Order created successfully",
            result: result
        });

    } catch (error) {
        console.error('Order creation error:', error);

        // Handle Duplicate Key Error (E11000) for orderId specifically
        if (error.code === 11000 && error.keyPattern && error.keyPattern.orderId) {
            return res.status(409).json({
                message: "Order creation failed due to ID collision. Please try again.",
                error: "Duplicate Order ID"
            });
        }

        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
}

export async function getAllOrders(req, res) {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
}