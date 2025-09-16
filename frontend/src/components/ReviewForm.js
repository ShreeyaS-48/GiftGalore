import React from 'react'
import {useState} from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa';

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState([]);
  const {auth} = useAuth();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
      e.target.value = ""; 
    }
  };
  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!auth?.accessToken) {
        navigate("/auth", { state: { from: location }, replace: true });
        return;
      }
      //patch request
      try{
        //await axiosPrivate.post(`/products/${id}/reviews`, review);
        const formData = new FormData();
        formData.append("rating", rating);
        formData.append("comment", comment);
        attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await axiosPrivate.post(`/products/${id}/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Review added successfully");

      setRating("");
      setComment("");
      setAttachments([]);
      }
      catch(err){
        alert('Unable to add review.');
      }
      setAttachments([]);
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
            <label>Attachments (images/videos):</label>
      <input
        type="file"
        name="attachments"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
  
<ul className="reviewFiles">
{attachments.length >0 ? <p>Files attached:</p> : <></>}
  {attachments.map((file, i) => (
    <li 
      key={i} 
      style={{ maxWidth:"50%",display: "flex", alignItems: "flex-center", gap:"30px"}}
    >
       <span>{file.name}</span>
      <button 
        type="button"
        onClick={() => handleRemoveFile(i)}
        style={{ outline:"none", border:"none", background:"transparent", padding:"0" }}
      >
        <FaTrashAlt style={{ color: "#82853e", cursor: "pointer", height:"1rem"}} />
      </button>
    </li>
  ))}
</ul>
      

            <button type="submit" style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px auto", textDecoration:"none"}}>Submit</button>
    </form>
  )
}

export default ReviewForm