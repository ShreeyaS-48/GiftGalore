import Order from "../models/order.model.js";
import User from "../models/user.model.js";
export const placeOrder = async (req, res) =>{
    try {
        const userName = req.user; // from middleware that verifies token
        
        const user = await User.findOne({name: userName})
        if (!user) return res.status(404).json({ message: "User not found" });
        const userId = user._id;
        const {items, totalAmount} = req.body;
        if (!items) {
            return res.status(400).json({ message: "Invalid products " });
          }  
        const order = new Order({
            user: userId,
            items,
            totalAmount,
            address:user.address,
            phone:user.phone,
            email:user.email,
            name: user.name
          });
          await order.save();
          console.log(order);
          res.status(200).json({ message: "Order Placed" });

    } catch(err){
        console.error("Error in placing order:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllOrders = async (req, res) =>{
    const orders = await Order.find();   
    console.log(orders);
    res.json(orders);
}

export const orderDelivered = async(req, res) =>{
    try{    
        const {orderId} = req.body;
    const order = await Order.findOne({_id: orderId});
    if(!order){
        return res.status(404).json({ message: "Order not found" });
    }
    order.status = 1;
    await order.save();
    res.status(200).json({ message: "Order Delivered" });
    }
    catch(err){
        res.status(500).json({ message: "Server error" });
    }
}