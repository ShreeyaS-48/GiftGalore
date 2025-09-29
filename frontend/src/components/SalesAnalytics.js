import React from "react";
import { useEffect, useState, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DataContext from "../context/DataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SalesAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const { products } = useContext(DataContext);
  const axiosPrivate = useAxiosPrivate();
  const fetchASalesAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(`/orders/sales-analytics`);
      setAnalytics(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchASalesAnalytics();
  }, []);
  return (
    <section style={{ width: "100%" }}>
      <h3 style={{ textAlign: "center" }}>Sales Analytics</h3>
      <div className="analytics-cards">
        <div className="card">
          <h4>Daily Sales</h4>
          <p>₹{analytics.daily}</p>
        </div>
        <div className="card">
          <h4>Weekly Sales</h4>
          <p>₹{analytics.weekly}</p>
        </div>
        <div className="card">
          <h4>Monthly Sales</h4>
          <p>₹{analytics.monthly}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap", // stack on smaller screens
          justifyContent: "space-between",
        }}
      >
        <div className="chart-container" style={{ flex: 1, minWidth: "300px" }}>
          <h4>Sales by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#82853e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container" style={{ flex: 1, minWidth: "300px" }}>
          <h4>Revenue Growth</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#82853e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default SalesAnalytics;
