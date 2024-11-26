import { Router } from "express";
import { ProductMongoManager as ProductManager } from "../dao/ProductMongoManager.js";
import { CartMongoManager } from "../dao/cartMongoManager.js"; // Asegúrate de que esta importación esté correcta

const router = Router();
const productos = new ProductManager();
const carts = new CartMongoManager(); // Ahora puedes crear una instancia de CartMongoManager correctamente

router.get("/products", async (req, res) => {
    let { limit, sort, query, page } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    try {
        const sortOptions = sort === 'des' ? { price: -1 } : { price: 1 };
        const queryOptions = query ? { category: query } : {};

        const productosList = await productos.getProducts(limit, sortOptions, queryOptions, page);
        const cartsList = await carts.getCarts(); // Aquí obtienes todos los carritos
        const carritos = cartsList || [];

        res.render("home", {
            products: productosList,
            carts: carritos,
            limit: limit,
            sort: sort || 'asc',
            query: query || '',
            page: page,
            style: 'todo.css',
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get("/carts", async (req, res) => {
    try {
        const cartsList = await carts.getCarts(); // Obtener la lista de carritos
        res.render("carts", {
            style: "todo.css",
            carts: cartsList,
        });
    } catch (error) {
        console.log('Error al obtener carritos:', error);
        res.status(500).send('Error al obtener los carritos');
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        // Validar si el cart id es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send('ID de carrito no válido');
        }

        const cart = await carts.getCartsById(cid);
        res.render("cart", {
            style: "todo.css",
            cart: cart,
            cartId: cid
        });
    } catch (error) {
        console.log('Error al obtener carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        // Validar si el product id es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send('ID de producto no válido');
        }

        const producto = await productos.getProductsById(pid);
        res.render("productDetail", {
            product: producto,
            style: 'todo.css',
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).send('Error al obtener el producto');
    }
});

export default router;
