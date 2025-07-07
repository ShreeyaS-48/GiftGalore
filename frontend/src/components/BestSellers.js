import React from 'react'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import BestSellerItem from './BestSellerItem';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const BestSellers = ({products, isLoading, fetchError}) => {    
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
        <main className="gifts" style={{padding:"10px 0", display:"flex", alignItems:"center", justifyContent:"space-between", margin:"15px", border:"1px solid #cfcfcf"}}>
            <article className='gifts-in-trend'>
                <h2>Best Sellers</h2>
                <div className='gifts-slider'>
                        {isLoading && <p style={{margin: "5px"}}>Loading Cakes...</p>}
                        {!isLoading && fetchError && <p style={{margin: "5px", color: "Red"}}>Network Error</p>}
                        {!isLoading && !fetchError &&
                            <Slider {...settings}>
                                {products.map(item=>
                                   <BestSellerItem
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

export default BestSellers
