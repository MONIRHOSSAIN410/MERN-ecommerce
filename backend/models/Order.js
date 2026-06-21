import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }
    ],
    address: {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
    },
    totalAmount: Number,
    paymentMethod: {
        type: String, // Fixed: changed 'typ' to 'type'
        default: 'COD'
    },
    status: {
        type: String, // Fixed: added the missing 'type'
        default: 'Placed',
    },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);