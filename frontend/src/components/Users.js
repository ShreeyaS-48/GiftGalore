import React from "react";
import { useContext, useEffect, useState } from "react";
import AdminContext from "../context/AdminContext";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const {
    fetchUsers,
    users,
    handleDeleteUser,
    usersPage,
    setUsersPage,
    totalUsersPages,
  } = useContext(AdminContext);
  const [userActivityStats, setUserActivityStats] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserActivityStats = async () => {
    if (!auth?.accessToken) return;
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(`/admin/userActivityStats`);
      setUserActivityStats(response.data);
      console.log(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, [usersPage]);
  useEffect(() => {
    fetchUserActivityStats();
  }, []);
  const goBack = () => navigate("/admin");
  return (
    <main className="admin">
      <h2 style={{ textAlign: "center" }}>Users</h2>
      {users.length > 0 ? (
        <table className="users">
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <button
                    style={{
                      height: "50px",
                      width: "50px",
                      backgroundColor: "#fff",
                      border: "none",
                      outline: "none",
                    }}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <FaTrashAlt
                      style={{
                        height: "30px",
                        width: "30px",
                        color: "#82853e",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Users</p>
      )}
      <Pagination
        currentPage={usersPage}
        totalPages={totalUsersPages}
        onPageChange={(page) => setUsersPage(page)}
      />
      <div>
        <h3>Churn Trend (Last 6 Months)</h3>
        <div className="chart-container" style={{ flex: 1, minWidth: "300px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={userActivityStats}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="atRiskColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="churnedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f44336" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f44336" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis domain={[0, "dataMax + 2"]} allowDecimals={false} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="active"
                stackId="1"
                stroke="#4caf50"
                fill="url(#activeColor)"
              />
              <Area
                type="monotone"
                dataKey="atRisk"
                stackId="1"
                stroke="#ff9800"
                fill="url(#atRiskColor)"
              />
              <Area
                type="monotone"
                dataKey="churned"
                stackId="1"
                stroke="#f44336"
                fill="url(#churnedColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <button
          onClick={goBack}
          style={{
            display: "block",
            backgroundColor: "#82853e",
            color: "white",
            border: "none",
            outline: "none",
            padding: "7px",
            borderRadius: "3px",
            margin: "10px 0",
            textDecoration: "none",
          }}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default Users;
