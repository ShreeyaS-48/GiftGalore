import React from 'react'

const Sort = ({handlePriceFilter, handleRatingFilter, handleReviewsFilter}) => {

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
                        <li onClick={()=>handlePriceFilter(1)}>Price Low to High</li>
                        <li onClick={()=>handlePriceFilter(2)}>Price High to Low</li>
                        <li onClick={()=>handlePriceFilter(0)}>Remove Filter</li>
                    </ul>
                </li>
                <li onClick={handleClick} onMouseLeave={handleMouseLeave} style={{position:"relative"}}>
                    <p style={{borderRight:"1px solid #ccc"}}>Rating</p>
                    <ul className="rating-list" style={{display:"none", position:"absolute", top:"100%"}}>
                        <li onClick={()=>handleRatingFilter(1)}>Rating Low to High</li>
                        <li onClick={()=>handleRatingFilter(2)}>Rating High to Low</li>
                        <li onClick={()=>handleRatingFilter(0)}>Remove Filter</li>
                    </ul>
                </li>
                <li onClick={handleClick} onMouseLeave={handleMouseLeave} style={{position:"relative"}}>
                    <p style={{borderRight:"1px solid #ccc"}}>Reviews</p>
                    <ul className="reviews-list" style={{display:"none", position:"absolute", top:"100%"}}>
                        <li onClick={()=>handleReviewsFilter(1)}>Reviews Low to High</li>
                        <li onClick={()=>handleReviewsFilter(2)}>Reviews High to Low</li>
                        <li onClick={()=>handleReviewsFilter(0)}>Remove Filter</li>
                    </ul>
                </li>
                <li onClick={handleRemoveFilter}>Clear All</li>
            </ul>
        </div>
    )
}

export default Sort
