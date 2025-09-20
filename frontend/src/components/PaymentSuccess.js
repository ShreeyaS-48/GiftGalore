import { useEffect } from "react"
import { useContext} from 'react'
import CartContext from '../context/CartContext'
import { useNavigate } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const PaymentSuccess = () => {
    const navigate = useNavigate();
    const goHome = () => navigate("/");
    const axiosPrivate = useAxiosPrivate();
    const {handleDeleteAllItems} = useContext(CartContext);
    
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const sessionId = query.get("session_id");
      
        if (sessionId) {
          const confirmPayment = async () => {
            try {
              await axiosPrivate.post("/cart/payment-success", { sessionId });
                handleDeleteAllItems();

            } catch (err) {
              console.error("Payment confirmation failed", err);
            }
          };
      
          confirmPayment();
        }
      }, []);

    return (
        <main className = 'unauthorized'>
            <h2>Payment Successful</h2>
            <br />
            <p>Your order has been placed.</p>
            <div>
                <button onClick={goHome} style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px 0", textDecoration:"none"}}>Go to Home page</button>
            </div>
        </main>
    )
}

export default PaymentSuccess