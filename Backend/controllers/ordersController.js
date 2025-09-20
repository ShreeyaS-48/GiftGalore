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
export const getOrderAnalytics = async (req, res) =>{
  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },            // for Pie chart
        totalAmount: { $sum: "$totalAmount" } // for average
      }
    }
  ]);

  const statusMap = ["Placed", "Processing", "Dispatched", "Delivered"];
  const formattedStatus = statusCounts.map(s => ({
    name: statusMap[s._id] || "Unknown",
    value: s.count
  }));

  // totalOrders is sum of counts
  const totalOrders = statusCounts.reduce((acc, s) => acc + s.count, 0);

  // average order value
  const totalRevenue = statusCounts.reduce((acc, s) => acc + s.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  res.json({
    statusCounts: formattedStatus,
    avgOrderValue: avgOrderValue.toFixed(2),
    totalOrders
  });

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

export const getSalesAnalytics = async (req, res) => {
    try {
        const now = new Date();
    
        // 📌 Daily sales (today)
        const daily = await Order.aggregate([
          { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
    
        // 📌 Weekly sales (last 7 days)
        const weekly = await Order.aggregate([
          { $match: { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
    
        // 📌 Monthly sales (from 1st of this month)
        const monthly = await Order.aggregate([
          { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
    
        // 📌 Category-wise sales (if items contain category field)
        const categorySales = await Order.aggregate([
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.product.type", // ⚠️ make sure items contain `category`
              totalSales: { $sum: { $multiply: ["$items.product.price", "$items.quantity"] } }
            }
          }
        ]);
    
        // 📌 Revenue growth over last 7 days
        const revenueGrowth = await Order.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              totalRevenue: { $sum: "$totalAmount" }
            }
          },
          { $sort: { _id: 1 } }
        ]);
    
        res.json({
          daily: daily[0]?.total || 0,
          weekly: weekly[0]?.total || 0,
          monthly: monthly[0]?.total || 0,
          categorySales,
          revenueGrowth
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching sales analytics" });
      }
}

export const getOrdersForUser = async (req, res) => {
  try {
    const userName = req.user; // from auth middleware

    const user = await User.findOne({ name: userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only select _id, totalAmount, and status
    const orders = await Order.find({ user: user._id }).populate('items.product', 'title price imgURL')
      .sort({ createdAt: -1 }); // optional: most recent orders first

    if (!orders || orders.length === 0)
      return res.status(404).json({ message: "Orders not found" });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};