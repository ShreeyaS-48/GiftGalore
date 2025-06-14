import React from 'react'
import { useContext } from 'react'
import AdminContext from '../context/AdminContext'
const Admin = () => {
    const {users, admins} = useContext(AdminContext)
  return (
    <main className='admin'>
        <h2>Admin Dashboard</h2>
        <ul>
            <li>{`Total Users: ${users.length} `}</li>
            <li>{`Total Admins: ${admins.length} `}</li>
        </ul>
    </main>
  )
}

export default Admin