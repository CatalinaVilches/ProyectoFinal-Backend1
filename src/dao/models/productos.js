import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: ['default.jpg'] }
});


const productosModel = mongoose.model('Producto', productoSchema);

export default productosModel;
