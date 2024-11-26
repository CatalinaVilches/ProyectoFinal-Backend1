import { ProductMongoManager as ProductManager } from "../dao/ProductMongoManager.js";
const productos = new ProductManager();

const cartsValidation = async (id, productId, quantity) => {

    if (!id || !productId || !quantity) {
        throw new Error('Todos los campos son obligatorios');
    }


    if (typeof id !== 'string' || typeof productId !== 'string') {
        throw new Error('id y productId deben ser de tipo string');
    }

    if (typeof quantity !== 'number') {
        throw new Error('quantity debe ser de tipo number');
    }

    if (quantity <= 0) {
        throw new Error('quantity debe ser mayor a 0');
    }

    const producto = await productos.getProductsById(productId);

    if (!producto) {
        throw new Error('El producto con el id proporcionado no existe');
    }
};

export default cartsValidation;
