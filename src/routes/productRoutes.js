import { Router } from 'express';
import ProductMongoManager from '../dao/productManager';

const router = Router();
const productManager = new ProductMongoManager();

// Ruta para obtener productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    const { limit = 10, sort = 'asc', query = {}, page = 1 } = req.query;

    try {
        const productos = await productManager.getProducts(limit, sort, query, page);
        res.json({
            status: 'success',
            payload: productos.payload,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.prevLink,
            nextLink: productos.nextLink,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
