import React from "react";
import { useContext, useEffect } from "react";
import DataContext from "../context/DataContext.js";
import { Link } from "react-router-dom";
import Product from "./Product.js";
import BestSellers from "./BestSellers.js";
import GiftsInTrend from "./GiftsInTrend.js";
import RecommendedItems from "./RecommendedItems.js";
const Home = () => {
  const { search, products, searchResults } = useContext(DataContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="home">
      <ul className="home-items-display">
        {search &&
          searchResults.map((product) => (
            <Product key={product._id} product={product} />
          ))}
      </ul>
      <GiftsInTrend />
      {searchResults.length === 0 && search.length !== 0 && (
        <p
          style={{
            textAlign: "center",
            width: "100%",
            height: "100px",
            marginTop: "15px",
          }}
        >
          No items match search
        </p>
      )}
      <article
        className="products"
        style={{ padding: "10px 0", margin: "15px auto 20px auto" }}
      >
        <h2 style={{ textAlign: "center" }}>Our Products</h2>
        <div className="products-display">
          <figure>
            <Link
              to="/products/cakes"
              style={{ color: "black", textDecoration: "none" }}
            >
              <img
                src="https://www.fnp.com/images/pr/l/v200/chocolate-trio-cake-half-kg_1.jpg"
                alt="cakes"
              />
              <figcaption>Cakes</figcaption>
            </Link>
          </figure>
          <figure>
            <Link
              to="/products/bouquets"
              style={{ color: "black", textDecoration: "none" }}
            >
              <img
                src="https://www.fnp.com/images/pr/l/v200/blooming-joy-rose-bouquet_1.jpg"
                alt="bouquets"
              />
              <figcaption>Bouquets</figcaption>
            </Link>
          </figure>
          <figure>
            <Link
              to="/products/plants"
              style={{ color: "black", textDecoration: "none" }}
            >
              <img
                src="https://www.fnp.com/images/pr/l/v200/money-plant-in-colourfull-rajwada-printed-pot-hand-delivery_1.jpg"
                alt="plants"
              />
              <figcaption>Plants</figcaption>
            </Link>
          </figure>
          <figure>
            <Link
              to="/products/chocolates"
              style={{ color: "black", textDecoration: "none" }}
            >
              <img
                src="https://www.fnp.com/images/pr/l/v200/chocolate-fusion-surprise_1.jpg"
                alt="chocolates"
              />
              <figcaption>Chocolates</figcaption>
            </Link>
          </figure>
          <figure>
            <Link
              to="/products/combos"
              style={{ color: "black", textDecoration: "none" }}
            >
              <img
                src="https://www.fnp.com/images/pr/l/v200/luxe-love-orchids-bouquet-truffle-cake_1.jpg"
                alt="combos"
              />
              <figcaption>Combos</figcaption>
            </Link>
          </figure>
        </div>
      </article>
      <RecommendedItems />
      <BestSellers
        products={products.filter((item) => parseInt(item.ratings) >= 4)}
      />
      <article style={{ margin: "20px auto" }}>
        <h2 style={{ textAlign: "center", margin: "20px" }}>
          Joyful Gifting Stories
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <video
            src="https://client-static.saleassist.ai/efd46e24-6e01-4f07-8c95-28e5c730ae8e/6c9d827b-31bb-4d0c-a319-0f57a5cb148c.mp4#t=0.1"
            controls
            style={{ width: "200px", borderRadius: "10px" }}
          />
          <video
            src="https://client-static.saleassist.ai/efd46e24-6e01-4f07-8c95-28e5c730ae8e/9d2d3d41-a3bb-4a44-849c-ec27b86626a6.mp4#t=0.1"
            controls
            style={{ width: "200px", borderRadius: "10px" }}
          />
          <video
            src="https://client-static.saleassist.ai/efd46e24-6e01-4f07-8c95-28e5c730ae8e/2bedc208-7dd2-42e6-99aa-653dbf520021.mp4#t=0.1"
            controls
            style={{ width: "200px", borderRadius: "10px" }}
          />
          <video
            src="https://client-static.saleassist.ai/efd46e24-6e01-4f07-8c95-28e5c730ae8e/9cb62b17-460f-4690-bcad-2b4e4bce2436.mp4#t=0.1"
            controls
            style={{ width: "200px", borderRadius: "10px" }}
          />
          <video
            src="https://client-static.saleassist.ai/efd46e24-6e01-4f07-8c95-28e5c730ae8e/d398f2e4-62be-47b5-a077-7978a09b81fc.mp4#t=0.1"
            controls
            style={{ width: "200px", borderRadius: "10px" }}
          />
        </div>
      </article>
    </main>
  );
};

export default Home;
