import React from 'react'
import { useContext, useEffect, useState } from 'react'
import AdminContext from '../context/AdminContext'
import DataContext from "../context/DataContext"
import AddProductForm from './AddProductForm'
const Admin = () => {
    const {users, admins, orders} = useContext(AdminContext)
    const [undelivered, setUndelivered] = useState(0);
    const [productsLen, setProductsLen] = useState(0);
    const {products} = useContext(DataContext);
    useEffect(() => {
    const pending = orders.filter(order => order.status !== 1).length;
    setUndelivered(pending);
  }, [orders]);
  useEffect(() => {
    setProductsLen(products.length);
  }, [products]);
  return (
    <main className='admin' style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"20px"}}>
        <h2>Admin Dashboard</h2>
        <table className="users">
          <tbody>
          <tr>
            <td>Total Users</td>
            <td>{users.length}</td>
          </tr>
          <tr>
            <td>Total Admins</td>
            <td>{admins.length}</td>
          </tr>
          <tr>
            <td>Pending Orders</td>
            <td>{undelivered}</td>
          </tr>
          <tr>
            <td>Total Products</td>
            <td>{productsLen}</td>
          </tr>
          </tbody>
        </table>

          <AddProductForm/>
          
        
    </main>
  )
}

export default Admin