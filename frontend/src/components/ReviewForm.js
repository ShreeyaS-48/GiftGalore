import React from 'react'
import {useState} from 'react'
import useAuth from '../hooks/useAuth'
const ReviewForm = () => {
  const {auth} = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        //patch request
        console.log('submitted');
        setRating('');
    }
    const [rating, setRating] = useState('');
  return (
    <form  onSubmit={handleSubmit} className='form' style={{width:"100%"}}>
        <label>Rate the product</label>
            <input
            type="number"
            name="rating"
            min="1"
            max="5"
            step="0.1"
            placeholder="Enter rating (e.g., 4.5)"
            required
            value={rating}                 // <-- connected to state
            onChange={(e) => setRating(e.target.value)} // <-- update state
            disabled = {!auth?.name}
            />
            <button type="submit" style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px auto", textDecoration:"none"}}>Submit</button>
    </form>
  )
}

export default ReviewForm