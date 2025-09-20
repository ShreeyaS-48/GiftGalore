import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import Product from "../models/product.model.js";
import Recommendation from "../models/recommendation.model.js";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.REACT_APP_API_URL ||'http://localhost:3000'; 

export const placeOrder = async (req, res) =>{
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
        const user = await User.findOne({_id: session.metadata.userId})


        const cartItems = JSON.parse(session.metadata.cartItems); 
        const items = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findOne({ _id: item.productId });
                return {
                    product,
                    quantity: item.quantity
                };
            }))
        const order = new Order({
            user: session.metadata.userId,
            items,
            totalAmount:session.metadata.totalAmount,
            address: session.metadata.address,
            phone:user.phone,
            email:user.email,
            name: user.name
          });
          await order.save();
            res.status(200).json({ message: "Order Placed" });
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }

}

export const makePayment = async (req, res) =>{
    try {
        const userName = req.user; // from middleware that verifies token
        
        const user = await User.findOne({name: userName})
        if (!user) return res.status(404).json({ message: "User not found" });
        const userId = user._id;
        const {items, address, totalAmount} = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Invalid products " });
          }  
        const lineItems = items.map((item) => ({
            price_data: {
              currency: "inr",
              product_data: { name: item.product.title },
              unit_amount: item.product.price * 100, // in paise
            },
            quantity: item.quantity,
          }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`${BASE_URL}/cart/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${BASE_URL}/cart`,
            metadata: {
                userId: userId.toString(),
                address: JSON.stringify(address),   // stringify objects too
                totalAmount: totalAmount.toString(),
                cartItems: JSON.stringify(items.map(i => ({
                    productId: i.product._id,
                    quantity: i.quantity
                }))), 
              },
        })
        res.json({id: session.id});

       /*
        
*/
    } catch(err){
        console.error("Error in placing order:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllOrders = async (req, res) =>{
    let { page, limit } = req.query;
    page = parseInt(page) || 1;   // default page = 1
    limit = parseInt(limit) || 5;
    const skip = (page - 1) * limit;
    const orders = await Order.find().skip(skip).limit(limit);   
    const total = await Order.countDocuments();
    res.json({page,
        totalPages: 
        Math.ceil(total / limit),
        totalOrders: 
        total ,orders});
}

export const getAllAssociations = async (req, res)=>{
    const rules = await Recommendation.find()
    if(!rules) return res.status(204).json({'message': 'No rules found'}) // no content
    res.json(rules)
  }

export const orderDelivered = async(req, res) =>{
    try{    
        const {orderId} = req.body;
    const order = await Order.findOne({_id: orderId});
    if(!order){
        return res.status(404).json({ message: "Order not found" });
    }
    order.status = 3;
    await order.save();
    res.status(200).json({ message: "Order Delivered" });
    }
    catch(err){
        res.status(500).json({ message: "Server error" });
    }
}

