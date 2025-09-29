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
  const [topProducts, setTopProducts] = useState([]);
  const [forcastedProducts, setForcastedProducts] = useState([]);

  const fetchProducts = async () => {
    if (!auth?.accessToken) return;
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/products/admin-products?page=${productsPage}&limit=5`
      );
      setProducts(response.data.products);
      setTotalProductsPages(response.data.totalPages);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTopProducts = async () => {
    try {
      const response = await axiosPrivate.get("/products/top-products");
      setTopProducts(response.data);
      const productSalesMap = {};

      response.data.forEach((monthData) => {
        monthData.topProducts.forEach((p) => {
          if (!productSalesMap[p.productId])
            productSalesMap[p.productId] = { name: p.name, sales: [] };
          productSalesMap[p.productId].sales.push(p.sales);
        });
      });
      const forecast = Object.entries(productSalesMap).map(
        ([productId, data]) => {
          const salesArray = data.sales;
          const avg = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;
          const trend =
            (salesArray[salesArray.length - 1] - salesArray[0]) /
            (salesArray.length - 1 || 1);
          const forecast = Math.max(0, Math.round(avg + trend)); // no negative sales
          return { productId, name: data.name, forecast };
        }
      );
      const topForecasted = forecast
        .sort((a, b) => b.forecast - a.forecast)
        .slice(0, 3);
      setForcastedProducts(topForecasted);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [productsPage]);
  useEffect(() => {
    fetchTopProducts();
  }, []);
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

      <section style={{ width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>Top Selling Products</h3>
        <div className="analytics-cards">
          {topProducts.map((topProduct) => (
            <div className="card">
              <h4>{topProduct.month}</h4>
              <ol style={{ listStyleType: "none" }}>
                {topProduct.topProducts.length === 0 ? (
                  <li>No Sales</li>
                ) : (
                  <>
                    {topProduct.topProducts.map((product) => (
                      <li key={product.productId} style={{ padding: "4px 0" }}>
                        {product.name} - {product.sales}
                      </li>
                    ))}
                  </>
                )}
              </ol>
            </div>
          ))}
        </div>
        <h3 style={{ textAlign: "center" }}>Forecast for Next Month</h3>
        <div className="analytics-cards">
          {forcastedProducts.map((p) => (
            <div className="card" key={p.productId}>
              <h4>{p.name}</h4>
              <p>Forecast: {p.forecast}</p>
            </div>
          ))}
        </div>
      </section>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AddProductForm />
      </div>
    </main>
  );
};

export default AdminProducts;
