import React from 'react'

import { Link } from 'react-router-dom'

const BestSellerItem = ({item}) => {
    return (     
        
            <div className='trend-item'>
            <Link to={`/${item._id}`} style={{color:"black", textDecoration:"none"}}>
            <figure>
                <img src={item.imgURL} alt={item.title} title={item.title} /> 
            </figure>
            <p className='title'style={{fontWeight:"bold", fontSize:"19px"}}>{item.title}</p>
            <p>&#8377; {item.price}</p>
            </Link> 
            </div>
        
    )
}


export default BestSellerItem
