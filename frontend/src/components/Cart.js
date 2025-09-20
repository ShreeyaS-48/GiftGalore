import React from 'react'
import { useContext, useState} from 'react'
import CartContext from '../context/CartContext'
import CartItem from './CartItem'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {loadStripe} from '@stripe/stripe-js';
const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;

const Cart = () => {
    const { totalAmount, cartItems, handleDeleteAllItems} = useContext(CartContext);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const [fetchError, setFetchError] = useState(null);
    
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
    /*
    await axiosPrivate.post("/orders", {
              items: cartItems,
              address: deliveryAddress,
              totalAmount
          });
          console.log("placed order")
          handleDeleteAllItems();
          fetchOrders();*/ 
  return (
         
        <div className='cart'>
        <h2 style={{textAlign:"center", paddingTop:"5px", fontSize:"1.8rem"}}>Shopping Cart</h2>
      { cartItems.length > 0? <div className='cart-inside'>
                    <div className='cart-items'>
                        
                    <ul style={{padding:"10px"}} >
                        {cartItems.map(item=> 
                            <CartItem
                                key={item._id}
                                item={item.product}
                                quantity={item.quantity}
                            />)
                        }
                    </ul>
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
                                disabled= {deliveryAddress == ""}>
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
                   
                    </aside>
                </div>:
        <p style={{textAlign:"center"}}>Cart Is Empty</p>
      }
    </div>

              
  )
}

export default Cart