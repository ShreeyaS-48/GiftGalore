import Cart from '../models/cart.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const getCartItems = async (req, res) => {
    try {
      const userName = req.user; // from middleware that verifies token
      
      const user = await User.findOne({name: userName})
      const userId = user._id
      
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
  
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      res.json(cart);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  export const addToCart = async (req, res) => {

    try {
      const userName = req.user; 
      const user = await User.findOne({ name: userName });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const userId = user._id;
  
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({ message: "Invalid product or quantity" });
      }
      const product = await Product.findOne({ _id: productId });
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        // Create new cart
        cart = new Cart({
          user: userId,
          items: [{ product: productId, quantity : 1}],
          totalAmount: product.price
        });
      } else {
        // Update existing cart  
          cart.items.push({ product: productId, quantity:1 });
          cart.totalAmount = cart.totalAmount + product.price;
      } 
      await cart.save();
      res.status(200).json({ message: "Cart updated" });
  
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  export const deleteFromCart = async (req, res) => {
    try {
      const userName = req.user;
      const user = await User.findOne({ name: userName });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const userId = user._id;
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ message: "Invalid product" });
      }
  
      let cart = await Cart.findOne({ user: userId }).populate("items.product");
      const index = cart.items.findIndex(i => i.product._id.toString() === productId.toString());
  
      if (index === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      const amt = cart.items[index].product.price;
      const qty = cart.items[index].quantity;
  
      cart.items.splice(index, 1);
      cart.totalAmount = cart.totalAmount - amt * qty;
  
      await cart.save();
      res.status(200).json({ message: "Cart updated" });
  
    } catch (error) {
      console.error("Delete from cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const updateQauntity = async(req, res) => {
    try {
      const userName = req.user; 
      const user = await User.findOne({ name: userName });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const userId = user._id;
      const { productId, action} = req.body;  
      if (!productId) {
        return res.status(400).json({ message: "Invalid product" });
      }
  
      let cart = await Cart.findOne({ user: userId }).populate("items.product");
      const index = cart.items.findIndex(i => i.product._id.toString() === productId);
      const amt = cart.items[index].product.price;
      if(action === 'increase') {
        cart.items[index].quantity += 1; 
        cart.totalAmount = cart.totalAmount + amt;

      } else if(action === 'decrease') {
        if(cart.items[index].quantity > 1){
          cart.items[index].quantity -= 1;
        }
        else{
          cart.items.splice(index, 1);
        }
        cart.totalAmount = cart.totalAmount - amt;
      } else{
        return res.status(400).json({ message: "Invalid action" });
      }
      await cart.save();
      res.status(200).json({ message: "Cart updated" });
  
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }


