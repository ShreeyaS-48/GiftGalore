import React, { use } from "react";
import { FaStar, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { useContext } from "react";
import CartContext from "../context/CartContext";
import useAuth from "../hooks/useAuth";
const Product = ({ product }) => {
  const handleMouseOver = (e) => {
    e.currentTarget.querySelector(".transparent-div").style.zIndex = "1";
    const h3 = e.currentTarget.querySelector("h3");
    h3.style.fontSize = "20px";
    h3.style.transform = "translateY(-10px)";
    h3.style.transitionProperty = "all";
    h3.style.transitionTimingFunction = "ease";
    h3.style.transitionDuration = "0.2s";
  };
  const handleMouseOut = (e) => {
    e.currentTarget.querySelector(".transparent-div").style.zIndex = "-1";
    const h3 = e.currentTarget.querySelector("h3");
    h3.style.fontSize = "18px";
    h3.style.transform = "translateY(0)";
    h3.style.transitionProperty = "all";
    h3.style.transitionTimingFunction = "ease";
    h3.style.transitionDuration = "0.2s";
  };
  const { auth } = useAuth();
  const { cartItems, handleDelete } = useContext(CartContext);
  const itemInCart = cartItems.find(
    (cartItem) => cartItem.product._id === product._id
  );
  return (
    <li
      className="item"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Link
        to={`/${product._id}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <figure
          style={{ textAlign: "center", position: "relative", zIndex: "-1" }}
        >
          <img
            src={product.imgURL}
            alt={product.title}
            title={product.title}
            height="100"
            width="100"
          />
          <div
            className="transparent-div"
            style={{
              height: "30px",
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              zIndex: "-1",
            }}
          ></div>
        </figure>
      </Link>
      <div className="item-details-div">
        <h3 style={{ textAlign: "center", zIndex: "-3" }}>{product.title}</h3>
        <div className="details">
          <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            &#8377; {product.price}
          </p>
          <p style={{ textAlign: "right" }}>{product.details}</p>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#82853e",
              display: "flex",
              alignItems: "center",
            }}
          >
            {product.ratings}
            <FaStar style={{ fontSize: "1rem" }} />
            {parseInt(product.reviews.length) >= 80 ? (
              <span
                style={{
                  marginLeft: "3px",
                  backgroundColor: "dodgerblue",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  padding: "3px",
                }}
              >
                BEST SELLER
              </span>
            ) : null}
          </p>
          <p style={{ textAlign: "right" }}>
            {product.reviews.length === 0
              ? "No Reviews"
              : `${product.reviews.length} ${
                  product.reviews.length === 1 ? "Review" : "Reviews"
                }`}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <AddToCartButton item={product} />
          <button
            style={{
              height: "50px",
              width: "50px",
              backgroundColor: "#fff",
              border: "none",
              outline: "none",
            }}
            onClick={() => handleDelete(product._id)}
          >
            <FaTrashAlt
              style={{
                height: "30px",
                width: "30px",
                color: !itemInCart ? "#aaa" : "#82853e",
                cursor: "pointer",
              }}
            />
          </button>
        </div>
      </div>
    </li>
  );
};

export default Product;
