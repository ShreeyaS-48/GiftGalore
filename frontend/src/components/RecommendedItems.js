import React from "react";
import { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const RecommendedItems = () => {
  const { products } = useContext(DataContext);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [user, setUser] = useState("Guest");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const getUserRecommendations = async () => {
    if (!auth?.user) return;
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(
        `/admin/collaborative_filtering_recommendations?id=${user._id}`
      );
      console.log(response);
      setRecommendedProducts(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getUser = async () => {
    if (!auth?.user) return;
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/admin/${auth.user}`);
      setUser(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getUser();
    }
  }, [auth]);
  useEffect(() => {
    if (user?._id) {
      getUserRecommendations();
    }
  }, [user]);
  return auth?.user ? (
    <main
      className="recommendedItems"
      style={{ padding: "30px 0 10px 0", margin: "auto 15px" }}
    >
      {/* Pick Up Where You Left Off */}
      {user?.recentProducts?.length > 0 && (
        <article className="products">
          <h2 style={{ textAlign: "center" }}>Pick Up Where You Left Off</h2>
          <div className="recommendations-display">
            {isLoading && <p style={{ margin: "5px" }}>Loading Gifts...</p>}
            {!isLoading && fetchError && (
              <p style={{ margin: "5px", color: "Red" }}>Network Error</p>
            )}
            {!isLoading &&
              !fetchError &&
              user.recentProducts.map((item) => {
                let p = products.find(
                  (product) => product._id.toString() == item
                );
                if (!p) return null;
                return (
                  <figure key={item}>
                    <Link
                      to={`/${item}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <img src={p.imgURL} alt={p.title} />
                      <figcaption>{p.title}</figcaption>
                    </Link>
                  </figure>
                );
              })}
          </div>
        </article>
      )}

      {/* Recommended for You */}
      {recommendedProducts?.length > 0 && (
        <article className="products">
          <h2 style={{ textAlign: "center" }}>Recommended for You</h2>
          <div className="recommendations-display">
            {isLoading && <p style={{ margin: "5px" }}>Loading Gifts...</p>}
            {!isLoading && fetchError && (
              <p style={{ margin: "5px", color: "Red" }}>Network Error</p>
            )}
            {!isLoading &&
              !fetchError &&
              recommendedProducts.map((item) => {
                let p = products.find(
                  (product) => product._id.toString() == item
                );
                if (!p) return null;
                return (
                  <figure key={item}>
                    <Link
                      to={`/${item}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <img src={p.imgURL} alt={p.title} />
                      <figcaption>{p.title}</figcaption>
                    </Link>
                  </figure>
                );
              })}
          </div>
        </article>
      )}
    </main>
  ) : null;
};

export default RecommendedItems;
