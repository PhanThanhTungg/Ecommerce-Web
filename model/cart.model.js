//Phan Thanh Tung _ B21DCCN775
const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                sizeId: String,
                quantity: Number
            }
        ],

    },
    {
        timestamps: true
    }
)

cartSchema.pre('save', function (next) {
    const now = new Date();
    this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    next();
});

const Cart = mongoose.model('Cart'/*ten model */, cartSchema, "carts" /*ten collection*/)

module.exports = Cart

