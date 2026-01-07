import Order from '../models/order.js';
import Product from '../models/product.js';

	

export async function createOrder(req, res) {

try{


    if(req.user == null){
            res.status(401).json({
            message : "Please login to create an order"
            });
            return;
    }  
    
    //CM00205
    const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

	let orderId = "CM00205";

		if (latestOrder.length > 0) {
			//if old orders exist //"CM00635"
			const lastOrderIdInString = latestOrder[0].orderId; //"CM00635"
			const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("CM", ""); //"00635"
			const lastOrderIdInInteger = parseInt(lastOrderIdWithoutPrefix); //635
			const newOrderIdInInteger = lastOrderIdInInteger + 1; //636
			const newOrderIdWithoutPrefix = newOrderIdInInteger.toString().padStart(5, "0");  //"00636"
			orderId = "CM" + newOrderIdWithoutPrefix; // "CM00636"


		}

        const items = [];
		let total = 0;

		if (req.body.items !== null && Array.isArray(req.body.items)) {
			for (let i = 0; i < req.body.items.length; i++) {
				let item = req.body.items[i];

				// console.log(item)

				let product = await Product.findOne({
					productId: item.productId,
				});

				if (product == null) {
					res.status(400).json({ 
						message: "Invalid product ID: " + item.productId 
    `            `  });
					return;
				}
				items[i] = {
					productId: product.productId,
					name: product.name,
					image: product.image,
					price: product.price,
					quantity: item.quantity,
				};

				total += product.price * item.quantity;
			}
		} else {
			res.status(400).json({ message: "Invalid items format" });
			return;
		}

		const order = new Order({
			orderId: orderId,
			email: req.user.email,
			name: req.user.firstName + " " + req.user.lastName,
			address: req.body.address,
			phone: req.body.phone,
			items: items,
			total: total,
		});


       
		const result = await order.save();

		res.json({
			message: "Order created successfully",
			result: result,
		});
    }catch (error) {
  console.error(error);
  res.status(500).json({
    message: "Failed to create order",
    error: error.message
  });
}


}