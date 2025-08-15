import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';
import { FaStar, FaTrashAlt } from 'react-icons/fa';
import DataContext from '../context/DataContext';
import CartContext from '../context/CartContext';
import ReviewForm from './ReviewForm';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Cookies from "js-cookie";

function saveViewedProduct(productId) {
  let viewedProducts = Cookies.get("viewedProducts");
  if (viewedProducts) {
    viewedProducts = JSON.parse(viewedProducts);
  } else {
    viewedProducts = [];
  }
  if (!viewedProducts.includes(productId)) {
    viewedProducts.unshift(productId);
  }
  viewedProducts = viewedProducts.slice(0, 5);
  Cookies.set("viewedProducts", JSON.stringify(viewedProducts), { expires: 7 }); // 7 days
}


const ItemDetails = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const { products } = useContext(DataContext);
    const item = products.find(item => item._id === id);
    const {handleDelete, cartItems} = useContext(CartContext)
    const itemInCart = cartItems.find(cartItem => cartItem.product._id === id);
    const [isLoading , setIsLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    
    const fetchProductReviews = async () => {
        setIsLoading(true)
          try {
              const response = await axiosPrivate.get(`/products/${id}/reviews`);
              console.log(response);
              setReviews(response.data);
              setFetchError(null);
            } catch (err) {
              setFetchError(err.message);
            } finally {
              setIsLoading(false);
            }
            
      };

    useEffect(() => {
        fetchProductReviews();
        saveViewedProduct(id);
    }, []);
    return (
        <main className='item-details'>
            <div className="details-containder" style={{ display: "flex", alignItems: "start", gap: "15px", borderBottom:"1px solid #ccc"}}>
                <figure className="main-picuture">
                    <img src={item.imgURL} alt={item.title} title={item.title}
                        style={{ width: "100%", display: "block" }}
                    />
                </figure>
                <div style={{ flexGrow: "1", display: "flex", flexDirection: "column" , minWidth:"63%", position:"relative"}}>
                    <div>
                        <h2 style={{ fontSize: "2rem" }}>{item.title}</h2>
                        <div style={{ display: "flex", alignItems: "start", gap: "5px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "5px" }} >
                            <p>Rating: {item.ratings}</p>
                            <FaStar style={{ color: "#82853e" }} />
                            <p style={{ borderLeft: "2px solid #ccc", paddingLeft: "5px" }}>Reviews: {item.reviews.length}</p>
                        </div>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <figure style={{ width: "31%" }}>
                            <img src={item.img2} alt="" style={{ width: "100%", minWidth:"100px", maxWidth:"300px"}} />
                        </figure>
                        <figure style={{ width: "31%"}}>
                            <img src={item.img3} alt=""  style={{width: "100%" , minWidth:"100px", maxWidth:"300px"}} />
                        </figure>
                        <figure style={{ width: "31%"}}>
                            <img src={item.img4} alt=""  style={{width: "100%" , minWidth:"100px", maxWidth:"300px"}} />
                        </figure>
                    </div>
                    <div style={{position:"relative", bottom:"0", left:"0"}}>
                        <h3 style={{ fontSize: "2rem" }}>&#8377; {item.price}</h3>
                        <p style={{ fontWeight: "bold" }}>Details:</p>
                        <p>{item.details}</p>
                        <p><span style={{ fontWeight: "bold" }}>Please Note:</span> The accessories used in the image are only for representation purposes.</p>
                        {<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px auto"}}>
                            <AddToCartButton item={item}/>
                            <button
                                style={{ height: "50px", width: "50px", backgroundColor: "#fff", border: "none", outline: "none" }}
                                onClick={() => handleDelete(item._id)}
                            >
                                <FaTrashAlt
                                    style={{ height: "30px", width: "30px", color: !itemInCart ? "#aaa" : "#82853e", cursor: "pointer" }}
                                />
                            </button>
                        </div>}
                    </div>
                </div>
            </div>

            <div style={{ margin:"15px",display: "flex", alignItems: "center", flexDirection:"column", justifyItems:"center" ,width:"100%"}}>
                {reviews.length > 0 ? (
                    <div style = {{width:"100%"}}>
                        <h3 style={{ fontSize: "1.5rem" }} >Customer Reviews</h3>
                        <ul style={{ listStyleType:"none"}}>
                            {reviews.map((review) => (
                            <li key={review._id} style={{ marginBottom: "1rem" }}>
                                <strong>Rating:</strong> {review.rating} <FaStar style={{ color: "#82853e" }} /> <br />
                                <strong>Comment:</strong> {review.comment} <br />
                                <small>
                                Posted on {new Date(review.createdAt).toLocaleDateString()}
                                </small>
                            </li>
                            ))}
                        </ul>
                    </div>
                    ) : (
                    <p>No reviews yet.</p>
                )}
                <ReviewForm/>
            </div>
            
            <p style={{ fontWeight: "bold", marginTop:"5px" }}>Delivery Information:</p>
            <ul style={{ padding: "5px 15px" }}>
                <li><p>The chosen delivery time is an estimate and depends on the availability of the product and the destination to which you want the product to be delivered.</p></li>
                <li><p>This product is hand delivered and will not be delivered along with courier products.</p></li>
                <li><p>Occasionally, substitutions of flavours/designs is necessary due to temporary and/or regional unavailability issues.</p></li>
            </ul>
        </main>
    );
}

export default ItemDetails;
