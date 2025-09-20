import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useContext } from "react";
import CartContext from "../context/CartContext";
const CartItem = ({ item, quantity }) => {
  const { handleDecreaseItemQty, handleIncreaseItemQty, handleDelete } =
    useContext(CartContext);
  return (
    <li
      className="cart-item-li"
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid #ccc",
        minHeight: "100px",
        padding: "5px",
        marginBottom: "10px",
        maxWidth: "700px",
      }}
    >
      <div style={{ display: "flex", gap: "7px" }}>
        <img
          style={{ display: "block", height: "90px" }}
          src={item.imgURL}
          alt={item.title}
          title={item.title}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{item.title}</p>
          <p>&#8377; {item.price}</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "1rem",
            }}
          >
            <p>Quantity: </p>
            <FaMinus
              style={{ fontSize: "0.8rem", cursor: "pointer" }}
              onClick={() => handleDecreaseItemQty(item._id)}
            />
            <p
              style={{
                width: "20px",
                textAlign: "center",
                border: "1px solid #ccc",
              }}
            >
              {quantity}
            </p>
            <FaPlus
              style={{ fontSize: "0.8rem", cursor: "pointer" }}
              onClick={() => handleIncreaseItemQty(item._id)}
            />
          </div>
        </div>
      </div>
      <button
        style={{
          height: "30px",
          width: "50px",
          padding: "5px",
          backgroundColor: "#82853e",
          color: "white",
          border: "none",
          outline: "none",
          boxShadow: "none",
          alignSelf: "flex-end",
        }}
        type="button"
        onClick={() => handleDelete(item._id)}
      >
        Delete
      </button>
    </li>
  );
};

export default CartItem;
