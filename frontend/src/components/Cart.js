import React from 'react'
import { useContext, useState, useEffect} from 'react'
import CartContext from '../context/CartContext'
import CartItem from './CartItem'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {loadStripe} from '@stripe/stripe-js';
import useAuth from "../hooks/useAuth";
import {Link} from "react-router-dom";
const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;


const Cart = () => {
    const {auth} = useAuth();
    const { totalAmount, cartItems, handleDeleteAllItems} = useContext(CartContext);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const makePayment = async (e) =>{
        e.preventDefault();        
        try{
        const stripe = await loadStripe(PUBLISHABLE_KEY);
        const body = {
            items: cartItems,
            address: deliveryAddress,
            totalAmount
        }
        const res = await axiosPrivate.post("/cart/create-checkout-session", body);
        const session = res.data;

        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        })
        if (result.error) {
            console.error(result.error.message);
            setFetchError(result.error.message);
          }
          
        }
        catch (err) {
        console.error(err);
          setFetchError(err.message);
        }
    }
    const fetchOrderHistory = async () => {
        try {
          if (!auth?.accessToken) 
          return;
          setIsLoading(true)
          const response = await axiosPrivate.get("/orders/order-history");
          console.log(response.data);
          setOrderHistory( response.data );
          setFetchError(null);
        } catch (err) {
          setFetchError(err.message);
        }
        finally {
          setIsLoading(false);
        }
      };
      useEffect(() => {
        fetchOrderHistory();
    }, []);
  return (
         
        <div className='cart'>
        <h2 style={{textAlign:"center", paddingTop:"5px", fontSize:"1.8rem"}}>Shopping Cart</h2>
       <div className='cart-inside'>
                    <div className='cart-items'>
                    {cartItems.length > 0?(
                    <ul style={{padding:"10px"}} >
                        {cartItems.map(item=> 
                            <CartItem
                                key={item._id}
                                item={item.product}
                                quantity={item.quantity}
                            />)
                        }
                    </ul>) : 
        <p style={{textAlign:"center", margin:"20px"}}>Cart Is Empty</p>}
                    </div>
                    <aside className='cart-aside'>
                        <div className="purchase" >
                            <h3 style={{textAlign:"center", fontSize:"1.2rem", fontWeight:"bold", margin:"5px auto"}}>Purchase all cart Items</h3>
                            <p style={{textAlign:"center", fontSize:"1.2rem", fontWeight:"bold", margin:"5px auto"}}>Total Amount: <span style={{whiteSpace:"nowrap"}}>&#8377; {totalAmount}</span></p>
                            <form className="form" style={{border:"none", boxShadow:"none"}}>
                            <label htmlFor='address'>Delivery Address: </label>
                            <textarea
                                value={deliveryAddress}
                                id="address"
                                onChange={(e)=>setDeliveryAddress(e.target.value)}
                                required
                            />
                            <button
                                type="submit" onClick={makePayment}
                                style={{backgroundColor:"#82853e", color:"white", minHeight:"35px", display:"block", fontSize:"1rem", margin:"10px auto", border:"none", outline:"none", padding:"5px"}}
                                disabled= {deliveryAddress == "" || cartItems.length == 0}>
                                Proceed to Pay
                            </button>
                            </form>
                            
                            <button 
                                style={{backgroundColor:"white", color:"#82853e", minHeight:"40px", display:"block", fontSize:"0.9rem", margin:"auto", border:"none", outline:"none", cursor:"pointer", textDecoration:"underline"}}
                                onClick = {handleDeleteAllItems}
                            >
                                Delete All Items
                            </button>
                        </div>
                        <div className="order-history">
  <h3 style={{textAlign:"center"}}>Track Your Orders</h3>
  {orderHistory.length > 0 ? (
    <div>
      {orderHistory.slice(0, 4).map((order) => (
        <Link to={`/order/${order._id}`} style={{color:"black", textDecoration:"none"}}>
       
        <div className="order-card" style={{borderBottom:"1px solid #82853e"}} key={order._id}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p>
            <strong>Status:</strong>{" "}
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
          </p>
        </div>
        </Link> 
      ))}
    </div>

  ) : (
    <p>No past orders</p>
  )}
</div>
                    </aside>
                </div>
      
    </div>

              
  )
}

export default Cart