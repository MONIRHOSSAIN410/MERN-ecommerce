import Product from "../models/product.js"; 

// 1. Create Product
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body); 
        res.status(201).json({ // 201 Created is better REST practice
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. Get All Products (With Search and Filter)
export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 }); 
        res.json(products); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ADDED: 3. Get Single Product by ID (Crucial for your Frontend Edit Form!)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 4. Update Product
export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Added runValidators to ensure updated data is valid
        );

        if (!updated) {
            return res.status(404).json({ message: "Product not found to update" });
        }

        res.json({
            message: "Product updated successfully",
            updated,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 5. Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Product not found to delete" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};