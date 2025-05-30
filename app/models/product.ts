import mongoose, { ObjectId } from "mongoose";

export interface IProduct {
    _id: ObjectId | string; // align with typescript
    name: string,
    nickname: string
    price: number, // item.price * 100
    description: string,
    image: string,
    currency: string
    unit_amount: number //price per unit of the item
    //category: string
    stripePriceId: string,
    stripeProductId: string
    timestamp: number
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        // required: [true, "Image is required"],
    },
    stripePriceId: {
        type: String,
        required: true,
    },
    stripeProductId: {
        type: String,
        // required: true,
    },
    /* category: {
         type: String,
         required: true,
     },*/

}, { timestamps: true });


export const Product = mongoose.models.products || mongoose.model<IProduct>('products', productSchema)