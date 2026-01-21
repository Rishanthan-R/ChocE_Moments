import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    userId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if using User references strictly
        required: true,
        index: true
    },
    productId: {
        type: String,
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index: MongoDB will automatically delete documents after this time
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to quickly find a user's reservation for a specific product
reservationSchema.index({ userId: 1, productId: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
