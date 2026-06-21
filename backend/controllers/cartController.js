import { Cart } from "../models/Cart.js";

// 1. ADD TO CART
export const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: 1 }]
            });
        } else {
            // FIXED: Declare 'item' outside or find it directly in the main scope
            const item = cart.items.find(i => i.productId.toString() === productId);
            
            if (item) {
                item.quantity += 1;
            } else {
                cart.items.push({ productId, quantity: 1 });
            }
        }

        await cart.save();
        res.json({
            message: "Item added to cart",
            cart
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// 2. REMOVE ITEM
export const removeItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // FIXED: Corrected 'findOnd' to 'findOne' and 'uerId' to 'userId'
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);

        await cart.save();
        res.json({
            message: "Item removed from cart",
            cart
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// 3. UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(i => i.productId.toString() === productId);

        if (!item) {
            // FIXED: Added 'return' to stop execution and removed the undefined 'error' variable
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();
        
        res.json({
            message: "Item quantity updated",
            cart
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// 4. GET CART
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        // Good practice: return an empty cart structure if none exists yet
        if (!cart) {
            return res.json({ userId, items: [] });
        }

        res.json(cart);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}