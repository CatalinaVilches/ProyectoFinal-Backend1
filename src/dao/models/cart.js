import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  
            required: true
          },
          quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad mínima es 1']
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true
  }
);

cartSchema.pre(['find', 'findOne'], function () {
  this.populate('products.product');
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
