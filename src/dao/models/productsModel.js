import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"]
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"]
    },
    code: {
      type: String,
      required: [true, "El código es obligatorio"],
      unique: true
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },
    status: {
      type: Boolean,
      required: [true, "El estado es obligatorio"],
      default: true
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"]
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"]
    },
    thumbnails: {
      type: [String], 
      default: ['default.jpg'] 
    }
  },
  {
    timestamps: true, 
    versionKey: false,
    strict: true 
  }
);


productSchema.plugin(mongoosePaginate);


export const productosModel = mongoose.model("Product", productSchema);
