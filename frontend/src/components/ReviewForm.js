import React from 'react'
import {useState} from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const {auth} = useAuth();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!auth?.accessToken) {
        navigate("/auth", { state: { from: location }, replace: true });
        return;
      }
      //patch request
      const review = {
        rating, comment
      }
      try{
        await axiosPrivate.post(`/products/${id}/reviews`, review);
        alert('Review added successfully');
      }
      catch(err){
        alert('Unable to add review.');
      }
      
      setRating('');
      setComment('');
  }
    
  return (
    <form  onSubmit={handleSubmit} className='review-form form' style={{width:"90%"}}>
        <h2>Share Your Review</h2>
        <label>Rate the product:</label>
            <input
            type="number"
            name="rating"
            min="1"
            max="5"
            step="0.1"
            placeholder="Enter rating (e.g., 4.5)"
            required
            value={rating}                
            onChange={(e) => setRating(e.target.value)} 
            />
            <label htmlFor='comment'>Comment: </label>
            <textarea
            value={comment}
            id="comment"
            onChange={(e)=>setComment(e.target.value)}
            required
            />
            <button type="submit" style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px auto", textDecoration:"none"}}>Submit</button>
    </form>
  )
}

export default ReviewForm