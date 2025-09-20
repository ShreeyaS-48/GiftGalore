import React from "react";

const OrderProgress = ({ status }) => {
  // status: 0 = pending, 1 = confirmed, 2 = shipped, 3 = delivered
  const steps = [
    { label: "Order Confirmed" },
    { label: "Order Shipped" },
    { label: "Out for Delivery" },
    { label: "Order Delivered" },
  ];

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Order Status
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {steps.map((step, index) => {
          const isActive = status >= index;
          return (
            <div
              key={index}
              style={{ textAlign: "center", flex: 1, position: "relative" }}
            >
              {/* Circle */}
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: isActive ? "#82853e" : "#ccc",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  zIndex: 1,
                  position: "relative",
                }}
              >
                ✓
              </div>
              {/* Label */}
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: isActive ? "#82853e" : "#555",
                }}
              >
                {step.label}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "50%",
                    width: "100%",
                    height: "4px",
                    background: status > index ? "#82853e" : "#ccc",
                    zIndex: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
