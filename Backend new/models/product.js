import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    productId : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    description : {
        type : String
    
    },
    price : {
        type : Number,
        required : true
    },  
    stock : {
        type : Number,
        required : true,
        default : 0
    },  
    category : {
        type : String,
        required : true         
    },
    image : {
        type : String,
        default : "default-product.jpg"
    },
    isActive : {
        type : Boolean,
        default : true
    }

})

const Product = mongoose.model("products", productSchema);

export default Product;    

