import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchedCakes, setSearchedCakes] = useState([]);
  const [searchedBouquets, setSearchedBouquets] = useState([]);
  const [searchedPlants, setSearchedPlants] = useState([]);
  const [searchedChocolates, setSearchedChocolates] = useState([]);
  const [searchedCombos, setSearchedCombos] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [ratingRange, setRatingRange] = useState(0);
  const [reviewRange, setReviewRange] = useState(0);
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get("/products");
      setProducts(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [auth]);
  useEffect(() => {
    const filterItems = () => {
      const filteredResults = products.filter(
        (item) =>
          (item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.details.toLowerCase().includes(search.toLowerCase())) &&
          (priceRange === 1
            ? item.price < 700
            : priceRange === 2
            ? item.price >= 700 && parseInt(item.price) < 1200
            : priceRange === 3
            ? item.price >= 1200
            : item.price > 0) &&
          (reviewRange === 1
            ? item.reviews.length < 25
            : reviewRange === 2
            ? item.reviews.length >= 25 && item.reviews.length < 75
            : reviewRange === 3
            ? item.reviews.length >= 75
            : item.reviews.length >= 0) &&
          (ratingRange === 1
            ? item.ratings < 4.6
            : ratingRange === 2
            ? item.ratings >= 4.6 && item.ratings < 4.8
            : ratingRange === 3
            ? item.ratings >= 4.8
            : item.ratings >= 0)
      );
      setSearchResults(filteredResults);
      setSearchedCakes(filteredResults.filter((item) => item.type === "cake"));
      setSearchedBouquets(
        filteredResults.filter((item) => item.type === "bouquet")
      );
      setSearchedPlants(
        filteredResults.filter((item) => item.type === "plant")
      );
      setSearchedChocolates(
        filteredResults.filter((item) => item.type === "chocolate")
      );
      setSearchedCombos(
        filteredResults.filter((item) => item.type === "combo")
      );
      //setSearch('');
    };

    filterItems();
  }, [products, search, priceRange, reviewRange, ratingRange]);
  const handlePriceFilter = (filterNumber) => {
    setPriceRange(filterNumber);
    if (filterNumber === 1)
      document.querySelector(
        ".filters-list:nth-child(1) p"
      ).textContent = `Price: Less than 700`;
    else if (filterNumber === 2)
      document.querySelector(
        ".filters-list:nth-child(1) p"
      ).textContent = `Price: 700 - 1200`;
    else if (filterNumber === 3)
      document.querySelector(
        ".filters-list:nth-child(1) p"
      ).textContent = `Price: More than 1200`;
    else
      document.querySelector(
        ".filters-list:nth-child(1) p"
      ).textContent = `Price`;
  };
  const handleRatingFilter = (filterNumber) => {
    setRatingRange(filterNumber);
    if (filterNumber === 1)
      document.querySelector(
        ".filters-list li:nth-of-type(2) p"
      ).textContent = `Rating: Less than 4.6`;
    else if (filterNumber === 2)
      document.querySelector(
        ".filters-list li:nth-of-type(2) p"
      ).textContent = `Rating: 4.6 - 4.8`;
    else if (filterNumber === 3)
      document.querySelector(
        ".filters-list li:nth-of-type(2) p"
      ).textContent = `Rating: More than 4.8`;
    else
      document.querySelector(
        ".filters-list li:nth-of-type(2) p"
      ).textContent = `Rating`;
  };
  const handleReviewsFilter = (filterNumber) => {
    setReviewRange(filterNumber);
    if (filterNumber === 1)
      document.querySelector(
        ".filters-list li:nth-of-type(3) p"
      ).textContent = `Reviews: Less than 25`;
    else if (filterNumber === 2)
      document.querySelector(
        ".filters-list li:nth-of-type(3) p"
      ).textContent = `Reviews: 25 - 75`;
    else if (filterNumber === 3)
      document.querySelector(
        ".filters-list li:nth-of-type(3) p"
      ).textContent = `Reviews: More than 75`;
    else
      document.querySelector(
        ".filters-list li:nth-of-type(3) p"
      ).textContent = `Reviews`;
  };
  return (
    <DataContext.Provider
      value={{
        fetchProducts,
        search,
        products,
        setProducts,
        fetchError,
        isLoading,
        handlePriceFilter,
        handleRatingFilter,
        handleReviewsFilter,
        setSearch,
        searchResults,
        searchedCakes,
        searchedChocolates,
        searchedPlants,
        searchedBouquets,
        searchedCombos,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
