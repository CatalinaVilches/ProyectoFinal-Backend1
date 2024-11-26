import CartModel from '../models/cartsModel.js';
import ProductModel from '../models/productModel.js';


export const createCart = async (req, res) => {
    try {
        const newCart = new CartModel();
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: error.message });
    }
};


export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartModel.findById(cid);
        const product = await ProductModel.findById(pid);

        if (!cart || !product) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        const existingProduct = cart.products.find(item => item.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: error.message });
    }
};


export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = products; 
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: error.message });
    }
};


export const clearCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).json({ error: error.message });
    }
};
