import React from 'react'
import BestSellerItem from './BestSellerItem';
import { useContext } from 'react';
import DataContext from '../context/DataContext';

const RecommendedItems = () => {    
    const {products} = useContext(DataContext);
    return (
        <main className="recommendedItems" style={{padding:"30px 0 10px 0", margin:"auto 15px"}}>
            <article className='products'>
                <h2 style={{textAlign:"center"}}>Pick Up Where You Left Off</h2>
                <div className='recommendations-display'>
                        {isLoading && <p style={{margin: "5px"}}>Loading Cakes...</p>}
                        {!isLoading && fetchError && <p style={{margin: "5px", color: "Red"}}>Network Error</p>}
                        {!isLoading && !fetchError &&
                            
                                products.map(item=>
                                   <BestSellerItem
                                        key={item._id}
                                        item={item}
                                   />
                                )
                           
                        }
                </div>
            </article>
        </main>
    )
}

export default RecommendedItems
