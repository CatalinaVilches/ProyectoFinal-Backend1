import path from "path";
import { fileURLToPath } from "url";
import cartsValidation from "../validaciones/cartsValidation.js";
import fs from 'fs/promises';

export default class CartManager {
    
    #__filename = "";
    #__dirname = "";
    #__directory = "";
    #__fileCarts = "";

    constructor() {
        this.carts = []; 
        this.#__filename = fileURLToPath(import.meta.url);  
        this.#__dirname = path.dirname(this.#__filename);   
        this.#__directory = path.join(this.#__dirname, '../data');
        this.#__fileCarts = path.join(this.#__directory, 'carts.json'); 
    }

    async getCarts(limit) {
        try {
            await fs.mkdir(this.#__directory, { recursive: true });

            try {
                const cartsData = await fs.readFile(this.#__fileCarts, 'utf-8');
                this.carts = JSON.parse(cartsData);

                if (!Array.isArray(this.carts)) {
                    throw new Error('El archivo de carritos no contiene un array válido');
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.carts = [];
                } else {
                    throw error;
                }
            }

            return this.carts.slice(0, limit);
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    }

    async getCartsById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart.products; 
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            await this.getCarts(); 

            const id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
            const newCart = {
                id,
                products: [] 
            };

            this.carts.push(newCart);
            await fs.writeFile(this.#__fileCarts, JSON.stringify(this.carts, null, 5)); // Guardamos los carritos

            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('Ocurrió un error al crear el carrito');
        }
    }

    async addProductCart(cid, pid, quantity) {
        await cartsValidation(cid, pid, quantity);

        try {
            const cart = await this.getCartsById(cid);

            if (!cart) {
                throw new Error('El carrito no existe');
            }

            const existingProduct = cart.find(product => product.product === pid);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({ product: pid, quantity });
            }

           
            await fs.writeFile(this.#__fileCarts, JSON.stringify(this.carts, null, 5));

            return true; 
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }
}