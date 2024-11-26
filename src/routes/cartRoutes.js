import express from 'express';
import CartModel from '../dao/models/cartsModel.js'; 

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { userId, products } = req.body; 
        const newCart = new CartModel({ userId, products });
        await newCart.save();
        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.id).populate('products.productId'); // Asegúrate de hacer el populate para los productos
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedCart = await CartModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito actualizado', cart: updatedCart });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedCart = await CartModel.findByIdAndDelete(req.params.id);
        if (!deletedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado', cart: deletedCart });
    } catch (error) {
        console.error('Error al eliminar carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});

export default router;

