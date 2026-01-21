import Reservation from '../models/reservation.js';
import Product from '../models/product.js';

// Configuration
const RESERVATION_TIMEOUT_MINUTES = 15;

/**
 * Add item to cart (Reserve Inventory)
 * POST /api/cart/add
 * Body: { productId, quantity }
 */
export async function addToCart(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Please login to add items to cart." });
    }

    const { productId, quantity } = req.body;
    const reqQty = parseInt(quantity);

    if (!productId || isNaN(reqQty) || reqQty <= 0) {
        return res.status(400).json({ message: "Invalid product or quantity." });
    }

    try {
        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // 1. Calculate currently reserved stock for this product (excluding this user's if updating)
        // Actually, simpler to think: User wants Total X. Is (Stock - AllReservationsByOthers) >= X?

        // Find existing reservation for this user to update it
        let existingReservation = await Reservation.findOne({
            userId: req.user.email, // Using email as ID consistent with orderController
            productId: productId
        });

        const currentReservedByUser = existingReservation ? existingReservation.quantity : 0;
        const targetQuantity = reqQty; // The user is setting the new total quantity? Or adding? 
        // Typically "Add to Cart" adds. Let's assume "Add". 
        // BUT standard implementation often accumulates.
        // Let's assume the payload is "quantity to add".
        // If the user already has 2, and adds 1, they want 3 total.

        // However, usually frontends send "Add 1". 
        // Let's check typical behavior. The prompt "Actor adds... maximum allowable". 
        // Let's treat valid quantity as "quantity to reserve".

        // For simplicity and robustness against "reservation extension attacks":
        // We will calculate "Total Desired Quantity" = currentReserved + newAdd.
        const totalDesired = currentReservedByUser + reqQty;

        // 2. Check global availability
        // Sum all ACTIVE reservations for this product
        const allReservations = await Reservation.aggregate([
            { $match: { productId: productId, expiresAt: { $gt: new Date() } } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const totalReserved = allReservations.length > 0 ? allReservations[0].total : 0;

        // Available = Stock - (TotalReserved - MyCurrentReservation)
        // because "TotalReserved" includes my current hold, which I'm about to replace/update.
        const availableStock = product.stock - (totalReserved - currentReservedByUser);

        if (availableStock < totalDesired) {
            return res.status(409).json({
                message: `Insufficient stock. Only ${availableStock} units available (some items may be held in other carts).`,
                available: availableStock
            });
        }

        // 3. Create or Update Reservation
        const expiresAt = new Date(Date.now() + RESERVATION_TIMEOUT_MINUTES * 60000);

        if (existingReservation) {
            existingReservation.quantity = totalDesired;
            existingReservation.expiresAt = expiresAt; // Refresh timeout ??
            // AUC-03 says "fails to automatically release...".
            // Refreshing timeout is standard UX, but can be abused ("Camping").
            // For this fix, let's allow refresh (standard e-commerce), but the timeout logic itself fixes the "indefinite hold".
            // The attacker must keep sending requests to hold it. 
            await existingReservation.save();
        } else {
            await Reservation.create({
                userId: req.user.email,
                productId,
                quantity: totalDesired,
                expiresAt
            });
        }

        res.json({
            message: "Item added to cart and reserved.",
            reservedUntil: expiresAt,
            totalQuantity: totalDesired
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Failed to add item to cart." });
    }
}

/**
 * Get Cart
 * GET /api/cart
 */
export async function getCart(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Find valid reservations
        const reservations = await Reservation.find({
            userId: req.user.email
        });

        // Enrich with product details
        // Note: In a real app, uses $lookup. Here manual for simplicity.
        const cartItems = [];
        for (const resv of reservations) {
            const product = await Product.findOne({ productId: resv.productId });
            if (product) {
                cartItems.push({
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: resv.quantity,
                    reservedUntil: resv.expiresAt
                });
            }
        }

        res.json(cartItems);

    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ message: "Failed to retrieve cart." });
    }
}
