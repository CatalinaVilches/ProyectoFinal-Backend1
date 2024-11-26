import ProductManager from '../dao/productManager.js'; 

const productValidation = async (title, description, code, price, status, stock, category, thumbnail) => {
    const productos = new ProductManager();

    try {
    
        const data = await productos.getProducts();

   
        const productoExistente = data.find(p => p.code === code);


        if (!title || !description || !code || !price || status === undefined || !stock || !category || !thumbnail) {
            throw new Error('Todos los campos son obligatorios');
        }

      
        if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string') {
            throw new Error('Título, descripción, código y categoría deben ser de tipo string');
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            throw new Error('Precio y stock deben ser de tipo number');
        }

        if (typeof status !== 'boolean') {
            throw new Error('El campo "status" debe ser de tipo boolean');
        }

    
        if (price <= 0 || stock <= 0) {
            throw new Error('Precio y stock deben ser mayores a 0');
        }


        if (thumbnail && (!Array.isArray(thumbnail) || !thumbnail.every(item => typeof item === 'string'))) {
            throw new Error('Thumbnail debe ser un array de strings');
        }

    
        if (productoExistente) {
            throw new Error('El producto con este código ya existe');
        }

       
        return true;

    } catch (error) {
       
        return error.message;
    }
}

export default productValidation;