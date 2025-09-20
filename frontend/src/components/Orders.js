import React from 'react'
import { useContext, useEffect } from 'react'
import AdminContext from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import AssociationRules from './AssociationRules'

const Orders = () => {
  const navigate = useNavigate();
  const {fetchOrders, ordersPage, setOrdersPage, totalOrdersPages} = useContext(AdminContext);
  const goBack = () => navigate("/admin");
  const {orders, handleDelivery} = useContext(AdminContext);
  useEffect(()=>{
    fetchOrders()
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
        <AssociationRules/>
        <div>
                <button onClick={goBack} style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px 0", textDecoration:"none"}}>Go Back</button>
        </div>
    </main>
  )
}

export default Orders