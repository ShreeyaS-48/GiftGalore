import React, { useEffect } from "react";
import AddProductForm from "./AddProductForm";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
const AdminProducts = () => {
  const [totalProductsPages, setTotalProductsPages] = useState(0);
  const [products, setProducts] = useState([]);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [fetchError, setFetchError] = useState(null);
  const [productsPage, setProductsPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProducts = async () => {
    if (!auth?.accessToken) return;
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/products/admin-products?page=${productsPage}&limit=5`
      );
      console.log(response);
      setProducts(response.data.products);
      setTotalProductsPages(response.data.totalPages);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [productsPage]);
  return (
    <main
      className="admin"
      style={{
        marginBottom: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Products</h2>
      <table className="orders">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Price</th>
            <th>Details</th>
            <th>Ratings</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <Link
                  to={`/${product._id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  {product.title}
                </Link>
              </td>
              <td>{product.type}</td>
              <td>{product.price}</td>
              <td>{product.details}</td>
              <td>{product.ratings}</td>
              <td>{product.reviews.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={productsPage}
        totalPages={totalProductsPages}
        onPageChange={(page) => setProductsPage(page)}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AddProductForm />
      </div>
    </main>
  );
};

export default AdminProducts;
