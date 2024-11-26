import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      match: [/\S+@\S+\.\S+/, "Por favor ingrese un correo electrónico válido"] 
    },
    message: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      minlength: [1, "El mensaje no puede estar vacío"] 
    }
  },
  {
    timestamps: true, 
    versionKey: false, 
    strict: true 
  }
);


messageSchema.plugin(mongoosePaginate);

export const MessageModel = mongoose.model("Message", messageSchema);
