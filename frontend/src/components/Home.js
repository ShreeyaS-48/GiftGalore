import React from 'react'
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import { Link } from 'react-router-dom';
import Product from './Product.js';
import BestSellers from './BestSellers.js';
import GiftsInTrend from './GiftsInTrend.js';
const Home = () => {
  const {search ,products, searchResults} = useContext(DataContext);
    var settings ={
            dots:true,
            infinite:true,
            speed:500,
            slidesToShow:1,
            slidesToScroll:1,
            nextArrow:null,
            prevArrow:null
    }
    return (
      <main className='home'>
          <ul className='home-items-display'>
              {search &&
              searchResults.map(product=>
              <Product
                  key = {product._id}
                  product={product}
              />)
              }
          </ul> 
          <GiftsInTrend/>
          {searchResults.length === 0 && <p style={{textAlign:"center", width:"100%", height:"100px"}}>No items to display</p>}
          <article className='products' style={{padding:"10px 0", margin:"15px auto 20px auto"}}>
                <h2>Our Products</h2>
                <div className='products-display' style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
                    <figure>
                        <Link to="/products/cakes" style={{color: "black", textDecoration:"none"}}>
                            <img src="https://www.fnp.com/images/pr/l/v200/chocolate-trio-cake-half-kg_1.jpg" alt="cakes" />
                            <figcaption>Cakes</figcaption>
                        </Link>
                    </figure>
                    <figure>
                        <Link to="/products/bouquets"style={{color: "black", textDecoration:"none"}}>
                            <img src="https://www.fnp.com/images/pr/l/v200/blooming-joy-rose-bouquet_1.jpg" alt="bouquets" />
                            <figcaption>Bouquets</figcaption>
                        </Link>
                    </figure>
                    <figure>
                        <Link to = "/products/plants"style={{color: "black", textDecoration:"none"}}>
                            <img src="https://www.fnp.com/images/pr/l/v200/money-plant-in-colourfull-rajwada-printed-pot-hand-delivery_1.jpg" alt="plants" />
                            <figcaption>Plants</figcaption>
                        </Link>
                    </figure>
                    <figure>
                        <Link to="/products/chocolates" style={{color: "black", textDecoration:"none"}}>
                            <img src="https://www.fnp.com/images/pr/l/v200/chocolate-fusion-surprise_1.jpg" alt="chocolates" />
                            <figcaption>Chocolates</figcaption>
                        </Link>
                    </figure>
                    <figure>
                        <Link to="/products/combos" style={{color: "black", textDecoration:"none"}}>
                            <img src="https://www.fnp.com/images/pr/l/v200/luxe-love-orchids-bouquet-truffle-cake_1.jpg" alt="combos" />
                            <figcaption>Combos</figcaption>
                        </Link>
                    </figure>
                </div>
            </article>
          <BestSellers
                products={products.filter(item => parseInt(item.reviews) >= 80)}
            />
      </main>
  )
}

export default Home
