import Order from '../models/order.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';

// ... (imports remain)

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

        // --- Improved Order ID Generation ---
        let orderId = "CM00001"; // Default start
        try {
            // Sort by _id (creation time) instead of date to be safer
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
        // ------------------------------------

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

            // --- Server-Side Option Validation (MMUC-02 Mitigation) ---
            if (product && product.options && product.options.length > 0) {
                // Ensure the user sent options for this item
                // We expect item.selectedOptions to be an object like { "Size": "Small" }
                // Note: You might need to adjust based on how your frontend sends data. 
                // If frontend sends array, logic changes slightly. Assuming object map for now.
                
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
            // -----------------------------------------------------------

            // Determine price safely
            // Use Number() to ensure we don't do string concatenation
            const basePrice = Number(item.basePrice) || (product ? product.price : 0) || 0;
            const itemTotalPrice = Number(item.totalPrice) || basePrice; // Fallback

            if (itemTotalPrice <= 0) {
                 return res.status(400).json({ message: `Invalid price for item: ${item.name}`});
            }

            items.push({
                productId: product ? product.productId : item.productId,
                name: product ? product.name : item.name,
                image: (product && product.image) ? product.image : (item.image || "default-product.jpg"),
                price: basePrice,
                quantity: Number(item.quantity),
                pieces: Number(item.pieces) || 0,
                basePrice: basePrice,
                totalPrice: itemTotalPrice,
                addOns: item.addOns || { giftCard: false, customName: null }
            });

            total += itemTotalPrice * Number(item.quantity);
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