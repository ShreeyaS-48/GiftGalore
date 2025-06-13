import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import {FaShoppingCart, FaUserCircle, FaSearch, FaMapMarker, FaArrowRight} 
from 'react-icons/fa';
import{ Link } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import CartContext from '../context/CartContext';
const Header = () => {
    const {auth} = useContext(AuthContext)
    const {search, setSearch} = useContext(DataContext);
    const {cartItems, setCartItems} = useContext(CartContext);
    const [userName, setUserName] = useState('Guest');

useEffect(() => {
    if (auth?.name) {
        setUserName(auth.name);
    } else {
        setUserName('Guest');
        setCartItems([]);
    }
}, [auth]);

     return (
        <header className='header'>
          <Link to="/">
            <figure>
                <img src="../../public/favicon.png" alt="Ferns n Petals Logo" />
            </figure>
          </Link>
            <div className='header-forms'>
                <form onSubmit={(e)=>e.preventDefault()}>
                    <label htmlFor='search-items'>
                        Search Items
                    </label>
                    <input 
                        id='search-items'
                        type='text'
                        required
                        placeholder='Search flowers, gifts, cakes, etc.'
                        value = {search}
                        onChange={(e)=>setSearch(e.target.value)}
                        autoComplete='off'
                    />
                    <button type='submit'>
                        <FaSearch className='search-icon'/>
                    </button>
                </form>
                
            </div>
            <div className='cart-and-user'>
                <Link to ="/cart" style={{color:"white", textDecoration:"none"}}>
                    <FaShoppingCart/>
                    {<p>{cartItems.length} {cartItems.length === 1 ? "Item": "Items"}</p>}
                </Link> 
                <div>
                    <Link to="/auth" style={{color:"white", textDecoration:"none"}}>
                        <FaUserCircle/>
                        <p>Hi {userName}</p>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
