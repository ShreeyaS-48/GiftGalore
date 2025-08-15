import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import {FaShoppingCart, FaUserCircle, FaSearch,FaComment} 
from 'react-icons/fa';
import{ Link } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import CartContext from '../context/CartContext';
const Header = () => {
    const {auth} = useContext(AuthContext)
    const {search, setSearch} = useContext(DataContext);
    const {cartItems, setCartItems} = useContext(CartContext);
    const [userName, setUserName] = useState('Guest');
    const [cartItemsLength, setCartItemsLength] = useState(0);
useEffect(() => {
    if (auth?.name) {
        setCartItemsLength(cartItems.length);
        setUserName(auth.name);
    } else {
        setUserName('Guest');
        setCartItemsLength(0);
        setCartItems([]);
    }
}, [auth]);
    useEffect(()=>{
        setCartItemsLength(cartItems.length)
    },[cartItems])
     return (
        <header className='header'>
          <Link to="/">
            <figure>
                <img src="/favicon.png" alt="Ferns n Petals Logo" />
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
            <Link to ="/chat" style={{color:"white", textDecoration:"none"}}>
                    <FaComment/>
                    {<p>Chat</p>}
                </Link> 
                <Link to ="/cart" style={{color:"white", textDecoration:"none"}}>
                    <FaShoppingCart/>
                    {<p>{cartItemsLength} {cartItemsLength === 1 ? "Item": "Items"}</p>}
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
