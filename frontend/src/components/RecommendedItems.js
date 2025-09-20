import React from 'react'
import { useState, useEffect,useContext } from 'react';
import DataContext from '../context/DataContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const RecommendedItems = () => {    
    const {products} = useContext(DataContext);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [user, setUser] = useState('Guest');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const getUser = async () =>{
        console.log("fetching user:")
        if(!auth?.user)
            return;
        try{
            setIsLoading(true)
            const response = await axiosPrivate.get(`/admin/${auth.user}`);
            console.log("fetching user:", response.data)
            setUser(response.data);
            setFetchError(null);
          } catch (err) {
            setFetchError(err.message);
          } finally {
            setIsLoading(false);
          }
        }
        useEffect(() => {
            if (auth?.user) {
                getUser();
            }
        }, [auth]);
    return (
        auth?.user ? (
        <main className="recommendedItems" style={{padding:"30px 0 10px 0", margin:"auto 15px"}}>
            <article className='products'>
                <h2 style={{textAlign:"center"}}>Pick Up Where You Left Off</h2>
                <div className='recommendations-display'>
                        {isLoading && <p style={{margin: "5px"}}>Loading Cakes...</p>}
                        {!isLoading && fetchError && <p style={{margin: "5px", color: "Red"}}>Network Error</p>}
                        {!isLoading && !fetchError && user?.recentProducts?.length > 0 &&
                               
                                user.recentProducts.map(item=>{
                                        let p = products.find((product)=> product._id.toString() == item)
                                        if (!p) return null;
                                        return (
                                        <figure>
                                        <Link to={`/${item}`} style={{color: "black", textDecoration:"none"}}>
                                            <img src={p.imgURL} />
                                            <figcaption>{p.title}</figcaption>
                                        </Link>
                                        </figure>   );
                                    }
                                )
                           
                        }
                </div>
            </article>
        </main>) : null
    )
}

export default RecommendedItems
