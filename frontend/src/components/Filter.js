import React from 'react'

const Filter = ({handlePriceFilter, handleRatingFilter, handleReviewsFilter}) => {

    const handleClick = (event)=>{
            const list = event.currentTarget.querySelector("ul");
            list.style.display="flex";
            list.style.flexDirection="column";
    }
    const handleMouseLeave = (event)=>{
        const list = event.currentTarget.querySelector("ul");
            list.style.display="none";
    }
    const handleRemoveFilter=()=>{
        handlePriceFilter(0);
        handleRatingFilter(0);
        handleReviewsFilter(0);
    }
    return (
        <div className='filter'>
            <ul className='filters-list'>
                <li onClick={handleClick} onMouseLeave={handleMouseLeave} style={{position:"relative"}}>
                    <p style={{borderRight:"1px solid #ccc"}}>Price</p>
                    <ul className="price-list" style={{display:"none", position:"absolute", top:"100%"}}>
                        <li onClick={()=>handlePriceFilter(1)}>Less than Rs.700</li>
                        <li onClick={()=>handlePriceFilter(2)}>Rs.700 - Rs.1200</li>
                        <li onClick={()=>handlePriceFilter(3)}>More than Rs.1200</li>
                        <li onClick={()=>handlePriceFilter(0)}>Remove Filter</li>
                    </ul>
                </li>
                <li onClick={handleClick} onMouseLeave={handleMouseLeave} style={{position:"relative"}}>
                    <p style={{borderRight:"1px solid #ccc"}}>Rating</p>
                    <ul className="rating-list" style={{display:"none", position:"absolute", top:"100%"}}>
                        <li onClick={()=>handleRatingFilter(1)}>Less than 4.6</li>
                        <li onClick={()=>handleRatingFilter(2)}>4.6 - 4.8</li>
                        <li onClick={()=>handleRatingFilter(3)}>More than 4.8</li>
                        <li onClick={()=>handleRatingFilter(0)}>Remove Filter</li>
                    </ul>
                </li>
                <li onClick={handleClick} onMouseLeave={handleMouseLeave} style={{position:"relative"}}>
                    <p style={{borderRight:"1px solid #ccc"}}>Reviews</p>
                    <ul className="reviews-list" style={{display:"none", position:"absolute", top:"100%"}}>
                        <li onClick={()=>handleReviewsFilter(1)}>Less than 25</li>
                        <li onClick={()=>handleReviewsFilter(2)}>25 - 75</li>
                        <li onClick={()=>handleReviewsFilter(3)}>More than 75</li>
                        <li onClick={()=>handleReviewsFilter(0)}>Remove Filter</li>
                    </ul>
                </li>
                <li onClick={handleRemoveFilter}>Clear All</li>
            </ul>
        </div>
    )
}

export default Filter
