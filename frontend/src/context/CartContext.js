import { createContext, useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import AdminContext from "./AdminContext";
const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const { fetchOrders } = useContext(AdminContext);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const getCartItems = async () => {
    try {
      if (!auth?.accessToken) return;
      setIsLoading(true);
      const response = await axiosPrivate.get("/cart");
      setTotalAmount(response.data.totalAmount);
      setCartItems(response.data.items);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {}, [cartItems]);
  useEffect(() => {
    getCartItems();
  }, [auth]);
  const handleAddToCart = async (id) => {
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

      setCartItems(response.data.items);
    } catch (err) {
      setFetchError(err.message);
    }
  };
  const handleDecreaseItemQty = async (id) => {
    try {
      await axiosPrivate.patch("/cart", {
        productId: id,
        action: "decrease",
      });
      const response = await axiosPrivate.get("/cart");
      setTotalAmount(response.data.totalAmount);
      setCartItems(response.data.items);
    } catch (err) {
      setFetchError(err.message);
    }
  };
  const handleIncreaseItemQty = async (id) => {
    try {
      await axiosPrivate.patch("/cart", {
        productId: id,
        action: "increase",
      });
      const response = await axiosPrivate.get("/cart");
      setTotalAmount(response.data.totalAmount);
      setCartItems(response.data.items);
    } catch (err) {
      setFetchError(err.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete("/cart", {
        data: { productId: id },
      });
      const response = await axiosPrivate.get("/cart");
      setTotalAmount(response.data.totalAmount);
      setCartItems(response.data.items);
    } catch (err) {
      setFetchError(err.message);
    }
  };
  const handleDeleteAllItems = async () => {
    try {
      const temp = await axiosPrivate.get("/cart");
      const items = temp.data.items; // Don't forget `.data`

      for (const item of items) {
        await handleDelete(item.product._id);
      }
    } catch (err) {
      console.error("Failed to delete all items:", err);
    }
  };
  const placeOrder = async () => {
    try {
      await axiosPrivate.post("/orders", {
        items: cartItems,
        totalAmount,
      });
      handleDeleteAllItems();
      fetchOrders();
    } catch (err) {
      setFetchError(err.message);
    }
  };
  return (
    <CartContext.Provider
      value={{
        fetchError,
        isLoading,
        totalAmount,
        handleDeleteAllItems,
        placeOrder,
        cartItems,
        setCartItems,
        handleAddToCart,
        handleDecreaseItemQty,
        handleIncreaseItemQty,
        handleDelete,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
