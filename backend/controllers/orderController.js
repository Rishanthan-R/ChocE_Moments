import Order from '../models/order.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';

export async function createOrder(req, res) {
try{
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
        res.status(503).json({
            message: "Database connection error. Please check if MongoDB is running.",
            error: "MongoDB not connected"
        });
        return;
    }

    console.log('Creating order...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);

    if(req.user == null){
        res.status(401).json({
            message : "Please login to create an order"
        });
        return;
    }  
    
    // Generate order ID
    let orderId = "CM00205";
    try {
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1);
        if (latestOrder.length > 0 && latestOrder[0].orderId) {
            const lastOrderIdInString = latestOrder[0].orderId;
            const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("CM", "");
            const lastOrderIdInInteger = parseInt(lastOrderIdWithoutPrefix);
            if (!isNaN(lastOrderIdInInteger)) {
                const newOrderIdInInteger = lastOrderIdInInteger + 1;
                const newOrderIdWithoutPrefix = newOrderIdInInteger.toString().padStart(5, "0");
                orderId = "CM" + newOrderIdWithoutPrefix;
            }
        }
    } catch (orderIdError) {
        console.error('Error generating order ID:', orderIdError);
        // Continue with default orderId if generation fails
    }

        const items = [];
		let total = 0;

		if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
			res.status(400).json({ message: "Invalid items format or empty cart" });
			return;
		}

		for (let i = 0; i < req.body.items.length; i++) {
			let item = req.body.items[i];
			
			// Validate required fields
			if (!item.productId || !item.name || item.quantity === undefined || item.quantity <= 0) {
				console.error('Invalid item:', item);
				res.status(400).json({ 
					message: `Invalid item at index ${i}: missing required fields`,
					item: item
				});
				return;
			}

			// Try to find product, but if not found, use item data directly (for custom items with add-ons)
			let product = null;
			try {
				product = await Product.findOne({
					productId: item.productId,
				});
			} catch (productError) {
				console.error('Error finding product:', productError);
				// Continue without product
			}

			// Note: item.totalPrice is the price per unit (including add-ons)
			const itemTotalPricePerUnit = item.totalPrice || (product ? product.price : item.basePrice || 0);
			
			if (itemTotalPricePerUnit <= 0) {
				console.error('Invalid price for item:', item);
				res.status(400).json({ 
					message: `Invalid price for item: ${item.name}`,
					item: item
				});
				return;
			}
			
			if (product != null) {
				items[i] = {
					productId: product.productId || item.productId,
					name: product.name || item.name,
					image: product.image || item.image || "default-product.jpg",
					price: product.price || item.basePrice || itemTotalPricePerUnit,
					quantity: item.quantity,
					pieces: item.pieces || 0,
					basePrice: item.basePrice || product.price || itemTotalPricePerUnit,
					totalPrice: itemTotalPricePerUnit, // Price per unit
					addOns: item.addOns || {
						giftCard: false,
						customName: null
					}
				};
			} else {
				// Product not in database, use cart item data (for custom configurations)
				items[i] = {
					productId: item.productId,
					name: item.name,
					image: item.image || "default-product.jpg",
					price: item.basePrice || itemTotalPricePerUnit,
					quantity: item.quantity,
					pieces: item.pieces || 0,
					basePrice: item.basePrice || itemTotalPricePerUnit,
					totalPrice: itemTotalPricePerUnit, // Price per unit
					addOns: item.addOns || {
						giftCard: false,
						customName: null
					}
				};
			}
			
			// Calculate total: price per unit * quantity
			total += itemTotalPricePerUnit * item.quantity;
		}

		// Validate required fields
		if (!req.body.address || !req.body.phone) {
			res.status(400).json({ 
				message: "Missing required fields: address and phone are required" 
			});
			return;
		}

		if (!req.user.email) {
			res.status(400).json({ 
				message: "User email not found" 
			});
			return;
		}

		const orderData = {
			orderId: orderId,
			email: req.user.email,
			name: (req.user.firstName || '') + " " + (req.user.lastName || ''),
			address: req.body.address,
			phone: req.body.phone,
			items: items,
			total: total,
			paymentMethod: req.body.paymentMethod || "cash"
		};

		console.log('Order data to save:', JSON.stringify(orderData, null, 2));

		const order = new Order(orderData);
		const result = await order.save();

		console.log('Order saved successfully:', result.orderId);

		res.json({
			message: "Order created successfully",
			result: result,
		});
    } catch (error) {
		console.error('Error creating order:', error);
		console.error('Error stack:', error.stack);
		res.status(500).json({
			message: "Failed to create order",
			error: error.message,
			details: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}


}