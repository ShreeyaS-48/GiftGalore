import React from 'react'
import Product from './Product';
import Filter from './Filter';
import { useContext } from 'react';
import DataContext from '../context/DataContext';
const Bouquets = () => {
    const {searchedBouquets, isLoading, fetchError,  handlePriceFilter, handleReviewsFilter, handleRatingFilter} = useContext(DataContext);
    return (
        <>
            {isLoading && <p style={{margin: "5px"}}>Loading Bouquets...</p>}
            {!isLoading && fetchError && <p style={{margin: "5px", color: "Red"}}>Network Error</p>}
            {!isLoading && !fetchError &&
                    <main className="items-page">
                        <Filter
                            handlePriceFilter={handlePriceFilter}
                            handleRatingFilter={handleRatingFilter}
                            handleReviewsFilter={handleReviewsFilter}
                        />
                        {searchedBouquets.length ? 
                        <ul className='items-display'>
                            {searchedBouquets.map(product=>
                             <Product
                             key = {product._id}
                             product={product}
                         />)
                            }
                        </ul> 
                    : 
                        <p style={{display:"grid",placeContent:"center", width:"100%", minHeight:"85vh", marginTop:"100px"}}>No items to display.</p>
                    }
                    </main>
            }
        </>
    )
}

export default Bouquets
