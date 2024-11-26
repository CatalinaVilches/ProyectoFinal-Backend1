import mongoose from 'mongoose';
import productosModel from './models/productos.js'; 
import productValidation from "../validaciones/productsValidation.js";

class ProductMongoManager {
    constructor() {
        this.products = [];
    }

  
    async getProducts(limit = 10, sort = 'asc', query = {}, page = 1) {
        try {
            const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

            const queryOptions = {};

            if (query.category) {
                queryOptions.category = query.category;  
            }
            if (query.status) {
                queryOptions.status = query.status;  
            }

            const result = await productosModel.paginate(queryOptions, {
                limit,
                page,
                sort: sortOptions,
                lean: true,
            });

            if (!result) {
                throw new Error('No se encontraron productos');
            }

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage === false ? null : `http://localhost:8080/products?limit=${limit}&page=${result.prevPage}`,
                nextLink: result.hasNextPage === false ? null : `http://localhost:8080/products?limit=${limit}&page=${result.nextPage}`
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

   
    async getProductById(id) {
        try {
            const product = await productosModel.findById(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error('ID no válido');
        }
    }

    
    async addProduct(title, description, code, price, status, stock, category, thumbnails = ['default.jpg']) {
        try {
            const validaciones = await productValidation(title, description, code, price, status, stock, category, thumbnails);
            if (validaciones !== true) {
                throw new Error(validaciones);
            }

            const newProduct = await productosModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            });

            this.products.push(newProduct.toJSON());
            return newProduct.toJSON();
        } catch (error) {
            console.error('Error al añadir el producto', error);
            throw error;
        }
    }

    
    async updateProduct(id, updateData) {
        try {
            const producto = await this.getProductById(id);
            if (!producto) {
                throw new Error('El producto no existe');
            }

            delete updateData.code;

            const productoActualizado = await productosModel.findByIdAndUpdate(id, { code: producto.code, ...updateData }, { new: true, runValidators: true }).lean();

            if (!productoActualizado) {
                throw new Error('El producto no existe');
            }

            return productoActualizado;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }


    async deleteProduct(id) {
        try {
            const deletedProduct = await productosModel.findByIdAndDelete(id).lean();
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
}

export default ProductMongoManager;  
