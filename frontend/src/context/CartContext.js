import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const CartContext = createContext({});


export const CartProvider = ({children})=>{
    const { auth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const getCartItems = async () => {
        try {
          if (!auth?.accessToken) 
          return;
          setIsLoading(true)
          const response = await axiosPrivate.get("/cart");
          console.log("cart data", response.data);
          console.log(response.data.items)
          setTotalAmount(response.data.totalAmount);
          

          setCartItems( response.data.items );

          setFetchError(null);
        } catch (err) {
          setFetchError(err.message);
        }
        finally {
          setIsLoading(false);
        }
      };
      useEffect(() => {
        console.log("cartItems updated", cartItems);
      }, [cartItems]);
    useEffect(() => {
        console.log("fetching cartItems")
        getCartItems();
    }, [auth, axiosPrivate]);
      const handleAddToCart = async (id)=>{
        if (!auth?.accessToken) {
          navigate("/auth", { state: { from: location }, replace: true });
          return;
        }
        try {
          await axiosPrivate.post("/cart", {
            productId: id,
          });
          const response = await axiosPrivate.get("/cart");
         
          setTotalAmount(response.data.totalAmount);
          

          setCartItems( response.data.items );
          console.log("Added to cart");
        } catch (err) {
          setFetchError(err.message);
        }
      }
      const handleDecreaseItemQty = async (id) =>{
        try {
          await axiosPrivate.patch("/cart", {
            productId: id,
            action: "decrease"
          });
          const response = await axiosPrivate.get("/cart");
          setTotalAmount(response.data.totalAmount);
          

          setCartItems( response.data.items );
          console.log("Decreased quantity");
        } catch (err) {
          setFetchError(err.message);
        }
      }
      const handleIncreaseItemQty = async (id) =>{
        try {
          await axiosPrivate.patch("/cart", {
            productId: id,
            action: "increase"
          });
          const response = await axiosPrivate.get("/cart");
          setTotalAmount(response.data.totalAmount);
          

          setCartItems( response.data.items );
          console.log("Increased quantity");
        } catch (err) {
          setFetchError(err.message);
        }
      }
      const handleDelete = async (id) =>{
        console.log(id)
        try {
          await axiosPrivate.delete("/cart", {
            data: { productId: id },
          });
          const response = await axiosPrivate.get("/cart");
          setTotalAmount(response.data.totalAmount);
          

          setCartItems( response.data.items );
          console.log("Product Deleted");

        } catch (err) {
          setFetchError(err.message);
        }
      }
      const handleDeleteAllItems = async () =>{
        try {
          const temp = await axiosPrivate.get("/cart");
          const items = temp.data.items; // Don't forget `.data`
      
          for (const item of items) {
            await handleDelete(item.product._id);
          }
        } catch (err) {
          console.error("Failed to delete all items:", err);
        }
      }
    return(
        <CartContext.Provider value={{
           fetchError, isLoading,  totalAmount,handleDeleteAllItems,
          cartItems ,setCartItems,handleAddToCart, handleDecreaseItemQty, handleIncreaseItemQty, handleDelete
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext