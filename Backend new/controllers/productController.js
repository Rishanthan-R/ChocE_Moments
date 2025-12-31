import Product from '../models/product.js';
import { isAdmin } from './userController.js';


export async function createProduct(req, res) {

    if(!isAdmin(req)) {
        res.status(403).json({
            message : "Access denied. Admins only."
        });
        return;
    }
    const product = new Product(req.body);

    try {
        const response = await product.save();

        res.json({
            message : "Product created successfully",
            product : response
        })
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            message : "Failed to create product"
        })
    }
        
    }  
    
export async function getProduct(req, res) { 
       
    try{

        if(isAdmin(req)){
            const products = await Product.find();
            return res.json(products);

        }
        else{
            const products = await Product.find({ isActive: true });
            return res.json(products);

        }
    }

    catch(error){
        console.error("Error fetching products:", error);
        return res.status(500).json({
            message : "Failed to fetch products"
        })
    }

}

export async function deleteProduct(req, res) {

    if(!isAdmin(req)) {
        res.status(403).json({
            message : "Access denied. Admins only."
        });
        return;
    }

    try {
    const productId = req.params.productId;
    
        await Product.deleteOne({
            productId : productId
        });  
        
        res.json({
            message : "Product deleted successfully"
        })  
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message : "Failed to delete product"
        })
    }

}
export  async function updateProduct(req, res) {

    if(!isAdmin(req)) {
        res.status(403).json({
            message : "Access denied. Admins only."
        });
        return;
    }
 
    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId;       


    try {

        await Product.updateOne(
             { 
                productId : productId 
            },
            data 
        );   
        
        res.json({
            message : "Product updated successfully"
        })  
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message : "Failed to update product"
        })
    }

}

export  async function getProductInfo(req, res) {

    try {   
        const productId = req.params.productId;
        const product = await Product.findOne(
            {productId : productId}
        );

        if(product == null) {
            res.status(404).json({
                message : "Product not found"
            });
            return;
        }
        if(isAdmin(req)){
            res.json(product);
        }else{  
            if(product.isActive){
                res.json(product);
            }
            else{
                res.status(404).json({
                    message : "Product is inactive."
                });
            }

        }

    }       
    catch (error) {
        console.error("Error fetching product info:", error);
        return res.status(500).json({
            message : "Failed to fetch product info"
        })
    } 
}  
