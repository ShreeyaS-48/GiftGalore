import React from 'react'
import { useContext, useEffect } from 'react'
import AdminContext from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  useEffect(()=>{
    fetchOrders()
  }, []);
  const navigate = useNavigate();
const {fetchOrders} = useContext(AdminContext);
    const goBack = () => navigate("/admin");
  const {orders, handleDelivery} = useContext(AdminContext);
  console.log(orders);
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
                <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={order.status === 1}
                      disabled={order.status === 1}
                      onChange={() => handleDelivery(order._id)}
                      style={{
                        cursor: order.status === 1 ? 'not-allowed' : 'pointer'
                      }}
                    />
                    {order.status === 1 && (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Delivered</span>
                    )}
                  </div>
                </td>
            </tr> )}
        </tbody>
        </table>
        <div>
                <button onClick={goBack} style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px 0", textDecoration:"none"}}>Go Back</button>
        </div>
    </main>
  )
}

export default Orders