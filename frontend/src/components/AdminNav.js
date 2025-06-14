import React from 'react'
import{Link} from 'react-router-dom';
const AdminNav = () => {
    return (
        <nav className='Nav'>
            <ul className="Nav-list">
                <li>
                    <Link to="/orders">Orders</Link>
                </li>
                <li>
                    <Link to="/admin/users">Users</Link>
                </li>
                <li>
                    <Link to="/admins">Admins</Link>
                </li>
            </ul>
        </nav>
    )
}

export default AdminNav