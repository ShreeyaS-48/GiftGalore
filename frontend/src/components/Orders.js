import React from 'react'
import { useContext, useEffect, useState } from 'react'
import AdminContext from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import AssociationRules from './AssociationRules'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";

const Orders = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {fetchOrders, ordersPage, setOrdersPage, totalOrdersPages} = useContext(AdminContext);
  const goBack = () => navigate("/admin");
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const fetchOrderAnalytics = async () => {
    if (!auth?.accessToken) 
      return;
    setIsLoading(true)
      try {
          const response = await axiosPrivate.get(`/orders/order-analytics`);
          setOrdersStatus(response.data.statusCounts);
          setAvgOrderValue(response.data.avgOrderValue);
          setTotalOrders(response.data.totalOrders);
          console.log(response)
          setFetchError(null);
        } catch (err) {
          setFetchError(err.message);
        } finally {
          setIsLoading(false);
        }
  };
  const {orders, handleDelivery} = useContext(AdminContext);
  const statusMap = [
    { label: "Placed", color: "Gray" },
    { label: "Processing", color: "Blue" },
    { label: "Dispatched", color: "Orange" },
    { label: "Delivered", color: "Green" }
  ];
  
  // Convert to array for PieChart
  const pieData = ordersStatus.map((entry, index) => ({
    name: entry.name,
    value: entry.value,
    color: statusMap.find(s => s.label === entry.name)?.color || "Gray"
  }));

  useEffect(()=>{
    fetchOrders()
    fetchOrderAnalytics()
  }, [ordersPage]);
  return (
    <main className='admin'>
        <h2>Orders</h2>
        <table className='orders'>
          <thead>
          <tr>
                <th>Username</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
            <tr key={order._id}>
                <td>
                    {order.name}
                </td>
                <td>
                    {order.phone}
                </td>
                <td>
                    {order.email}
                </td>
                <td>
                    {order.address}
                </td>
                <td> 
                  <ol style={{listStyleType:"none"}}>
                  {order.items.map((item)=>(
                    
                    <li key={item.product._id} >
                      {`${item.product.title} - ${item.quantity}`}
                    </li>
                  ))}
                  </ol>
                  
                </td>
                <td>
                  {order.totalAmount}
                </td>
                <td>
                    {order.status === 3 && (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Delivered</span>
                    )}
                    {order.status === 2 && (
                      <span style={{ color: 'amber', fontWeight: 'bold' }}>Dispatched</span>
                    )}
                    {order.status === 1 && (
                      <span style={{ color: 'Blue', fontWeight: 'bold' }}>Processing</span>
                    )}
                    {order.status === 0 && (
                      <span style={{ color: 'Gray', fontWeight: 'bold' }}>Placed</span>
                    )}
                </td>
            </tr> )}
        </tbody>
        </table>
        <Pagination
      currentPage={ordersPage}
      totalPages={totalOrdersPages}
      onPageChange={(page) => setOrdersPage(page)}
      />
        <div>
          <h3>Order Analytics</h3>
          <div style={{
      display: "flex",
      gap: "20px",
      flexWrap: "wrap", // stack on smaller screens
      justifyContent: "space-between",
      alignItems:"center"
    }}>
          <div className="chart-container"  style={{ flex: 1, minWidth: "300px" }}>
          <ResponsiveContainer width="100%" height={300}>  
    <PieChart>
      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36}/>
    </PieChart>
  </ResponsiveContainer>
          </div>
          
  <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      textAlign: "center",
      width: "200px",
      margin: "10px"
    }}>
      <h4>Avg Order Value</h4>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{avgOrderValue ? Number(avgOrderValue).toFixed(2) : "0.00"}</p>
      <small>{totalOrders} Orders</small>
    </div>
    </div>
        </div>
        <AssociationRules/>

        <div>
                <button onClick={goBack} style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px 0", textDecoration:"none"}}>Go Back</button>
        </div>
    </main>
  )
}

export default Orders