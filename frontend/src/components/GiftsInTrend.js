import React, { useContext } from 'react'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import TrendItem from './TrendItem';
import { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DataContext from '../context/DataContext';
const GiftsInTrend = () => {
    const [giftItems, setGiftItems] = useState([])
    const {isLoading, fetchError, products}  = useContext(DataContext)
    useEffect(()=>{
      console.log("gifts reload")
        if ( products.length) {
            // Shuffle the array and pick first N items (e.g., 6)
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 10); // Select 6 random items
            setGiftItems(selected);
          }
        }, [products]);
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
              breakpoint: 1400,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: true,
                dots: false
              }
            },
            {
              breakpoint:1150,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: false
              }
            },
            {
              breakpoint: 900,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: false
              }
            },
            {
                breakpoint: 625,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: false
                }
              }
        ]
      };
      function SampleNextArrow(props) {
        const { onClick } = props;
        return (
            <div className='slider-arrows' onClick={onClick}>
                <FaChevronRight style={{width:"20px", height:"20px", cursor:"pointer"}}/>
            </div>
        );
      }
      function SamplePrevArrow(props) {
        const { onClick } = props;
        return (
            <div className='slider-arrows' onClick={onClick}>
                <FaChevronLeft style={{width:"20px", height:"20px", cursor:"pointer"}}/>
            </div>
        );
      }
    return (
        <main className="gifts" style={{padding:"10px 0", display:"flex", alignItems:"center", justifyContent:"space-between", margin:"auto 15px", border:"1px solid #cfcfcf"}}>
            <article className='gifts-in-trend'>
                <h2 style={{textAlign:"center"}}>Gifts In Trend</h2>
                <div className='gifts-slider'>
                        {isLoading && <p style={{margin: "5px"}}>Loading Gifts..</p>}
                        {!isLoading && fetchError && <p style={{margin: "5px", color: "Red"}}>Network Error</p>}
                        {!isLoading && !fetchError &&
                            <Slider {...settings}>
                                {giftItems.map(item=>
                                   <TrendItem
                                        key={item._id}
                                        item={item}
                                   />
                                )}
                            </Slider>
                        }
                </div>
            </article>
        </main>
    )
}

export default GiftsInTrend

