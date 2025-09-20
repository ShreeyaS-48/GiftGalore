import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import OrderProgress from "./OrderProgress";
import { Link } from "react-router-dom";
const OrderTracking = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const axiosPrivate = useAxiosPrivate();
  const fetchOrderHistory = async () => {
    try {
      if (!auth?.accessToken) return;
      setIsLoading(true);
      const response = await axiosPrivate.get("/orders/order-history");
      setOrderHistory(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderHistory();
  }, []);
  const order = orderHistory.find((order) => order._id === id);

  return (
    <main className="order-tracking">
      {isLoading && <p>Loading order details...</p>}
      {fetchError && <p>Error: {fetchError}</p>}
      {!isLoading && !fetchError && !order && <p>No order found.</p>}
      {!isLoading && !fetchError && order && (
        <>
          <h2 style={{ textAlign: "center" }}>Track Your Order</h2>
          <h3 style={{ textAlign: "center" }}>Order ID: {order._id}</h3>
          <div style={{ margin: "10px", lineHeight: "1.5rem" }}>
            <p>
              <strong>Name:</strong> {order.name}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.address.replace(/"/g, "")}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <OrderProgress status={order.status} />

          <h3 style={{ textAlign: "center", margin: "20px 0" }}>Items</h3>

          <div
            className="order-items"
            style={{
              display: "flex", // horizontal layout
              flexWrap: "wrap", // allows wrapping on smaller screens
              gap: "10px", // spacing between items
              margin: "0 10px",
              justifyContent: "center", // align items from left
            }}
          >
            {order.items.map((item, index) => (
              <Link
                to={`/${item.product._id}`}
                style={{ color: "black", textDecoration: "none" }}
              >
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    flex: "1 1 200px", // responsive: grows, shrinks, min width 200px
                    maxWidth: "250px", // optional: restrict max size
                    boxSizing: "border-box", // include padding in width
                  }}
                >
                  <img
                    src={item.product.imgURL}
                    alt={item.product.title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <h4>{item.product.title}</h4>
                  <p>{item.product.details}</p>
                  <p>Price: ₹{item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default OrderTracking;
