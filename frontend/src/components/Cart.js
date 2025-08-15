import React from 'react'
import { useContext, useEffect} from 'react'
import CartContext from '../context/CartContext'
import CartItem from './CartItem'

const Cart = () => {
    const { totalAmount, cartItems, handleDeleteAllItems, placeOrder} = useContext(CartContext);
    
    
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
                        <div className="purchase">
                            <p style={{textAlign:"center", fontSize:"1.2rem", fontWeight:"bold", margin:"5px auto"}}>Total Amount: <span style={{whiteSpace:"nowrap"}}>&#8377; {totalAmount}</span></p>
                            <button style={{backgroundColor:"#82853e", color:"white", minHeight:"35px", display:"block", fontSize:"1rem", margin:"5px auto", border:"none", outline:"none", padding:"5px"}}
                            onClick = {placeOrder}>
                                Proceed to Purchase
                            </button>
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