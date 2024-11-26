import express from 'express';
import { engine } from 'express-handlebars';
import productsRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);


app.get('/products', async (req, res) => {
    const { limit = 10, sort = 'asc', query = {}, page = 1 } = req.query;

    try {
        const productos = await productManager.getProducts(limit, sort, query, page);
        res.render('index', { 
            products: productos.payload,
            page: productos.page,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            limit,
            sort,
            query
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartModel.findById(cid).populate('products.product');
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
