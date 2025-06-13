import React from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import CartContext from '../context/CartContext'
import useAuth from '../hooks/useAuth'

const AddToCartButton = ({item}) => {
    const {auth} = useAuth();
    const {cartItems, handleAddToCart, handleDecreaseItemQty, handleIncreaseItemQty} = useContext(CartContext)
    
    const [itemInCart, setItemInCart] = useState( false)
    useEffect(()=>{
        setItemInCart(cartItems.length ? cartItems.find(cartItem => cartItem.product._id === item._id): false)
    },[cartItems])
    const quantity = itemInCart ? itemInCart.quantity : 0;
    return (
        <div style={{ display:"flex", alignItems:"center"}}>
                    <button
                        className='item-add'
                        type="button"
                        style={!itemInCart ? {backgroundColor:"#82853e", color:"#fff", border:"none", outline:"none", height: "40px", borderRadius: "7px", 
                        fontSize:"1.25rem",padding:"5px", width:"140px"}:{backgroundColor:"#82853e", color:"#fff", border:"none", outline:"none", height: "40px", borderRadius: "7px 0px 0px 7px", 
                        fontSize:"1rem",padding:"5px",
                        width:"70px"}}
                        onClick={(e)=>handleAddToCart(item._id)}
                    >
                        <p style={!itemInCart ? {cursor:"pointer"} : null}>{!itemInCart ? "Add to Cart" : "Quantity"}</p>
                    </button>
                    {!itemInCart ? null : <><FaMinus
                            style={{paddingRight:"5px",
                            paddingLeft: "5px",
                            width: "25px",
                            backgroundColor:"#82853e", color:"#fff", height: "40px" , cursor:"pointer"}}
                            role="button"
                            onClick={()=>handleDecreaseItemQty(item._id)}
                        />
                        <p style={{height:"40px", backgroundColor:"#82853e", color:"white", display:"grid", width:"20px", placeContent:"center", fontWeight:"bold"}}>{quantity}</p>
                        <FaPlus
                            role="button"
                            style={{ paddingLeft: "5px",
                            paddingRight:"5px",
                            width:"25px", 
                            borderRadius: "0px 7px 7px 0px",
                            backgroundColor:"#82853e", color:"#fff", height: "40px", cursor:"pointer"}}
                            onClick={()=>handleIncreaseItemQty(item._id)}
                        />
                        </>}
                    </div>
    )
}

export default AddToCartButton
