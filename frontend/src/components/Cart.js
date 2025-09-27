import React from "react";
import { useContext, useState, useEffect } from "react";
import CartContext from "../context/CartContext";
import CartItem from "./CartItem";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { loadStripe } from "@stripe/stripe-js";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;

const Cart = () => {
  const { auth } = useAuth();
  const { totalAmount, cartItems, handleDeleteAllItems } =
    useContext(CartContext);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const makePayment = async (e) => {
    e.preventDefault();
    try {
      const stripe = await loadStripe(PUBLISHABLE_KEY);
      const body = {
        items: cartItems,
        address: deliveryAddress,
        totalAmount,
      };
      const res = await axiosPrivate.post(
        "/cart/create-checkout-session",
        body
      );
      const session = res.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.error(result.error.message);
        setFetchError(result.error.message);
      }
    } catch (err) {
      console.error(err);
      setFetchError(err.message);
    }
  };
  return (
    <div className="cart">
      <h2
        style={{ textAlign: "center", paddingTop: "5px", fontSize: "1.8rem" }}
      >
        Shopping Cart
      </h2>
      <div className="cart-inside">
        <div className="cart-items">
          {cartItems.length > 0 ? (
            <ul style={{ padding: "10px" }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item.product}
                  quantity={item.quantity}
                />
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", margin: "20px" }}>Cart Is Empty</p>
          )}
        </div>
        <aside className="cart-aside">
          <div className="purchase">
            <h3
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
                fontWeight: "bold",
                margin: "5px auto",
              }}
            >
              Purchase all cart Items
            </h3>
            <p
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
                fontWeight: "bold",
                margin: "5px auto",
              }}
            >
              Total Amount:{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                &#8377; {totalAmount}
              </span>
            </p>
            <form
              className="form"
              style={{ border: "none", boxShadow: "none" }}
            >
              <label htmlFor="address">Delivery Address: </label>
              <textarea
                value={deliveryAddress}
                id="address"
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
              <button
                type="submit"
                onClick={makePayment}
                style={{
                  backgroundColor: "#82853e",
                  color: "white",
                  minHeight: "35px",
                  display: "block",
                  fontSize: "1rem",
                  margin: "10px auto",
                  border: "none",
                  outline: "none",
                  padding: "5px",
                }}
                disabled={deliveryAddress == "" || cartItems.length == 0}
              >
                Proceed to Pay
              </button>
            </form>

            <button
              style={{
                backgroundColor: "white",
                color: "#82853e",
                minHeight: "40px",
                display: "block",
                fontSize: "0.9rem",
                margin: "auto",
                border: "none",
                outline: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={handleDeleteAllItems}
            >
              Delete All Items
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
