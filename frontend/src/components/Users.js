import React from 'react'
import { useContext } from 'react';
import AdminContext from '../context/AdminContext';
import { FaTrashAlt} from 'react-icons/fa';
const Users = () => { 
    const {users} = useContext(AdminContext);
  return (
   <main className ="admin">
    <h2>Users</h2>
    <table className="users">
        <thead className="table-header">
            <tr>
                <th>Username</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) =>
            <tr key={user._id}>
                <td>
                    {user.name}
                </td>
                <td>
                    {user.phone}
                </td>
                <td>
                    {user.email}
                </td>
                <td>
                    {user.address}
                </td>
                <td>
                <button 
                    style={{height:"50px", width:"50px", backgroundColor:"#fff",border:"none", outline:"none" }}
                    //onClick={()=>handleDelete(product._id)}            
                >
                    <FaTrashAlt 
                        style={{height:"30px", width:"30px", color:  "#82853e", cursor:"pointer"}}
                    />
                </button>
                </td>
            </tr> )}
        </tbody>
    </table>
   </main>
  )
}

export default Users