import React from "react";
import { useEffect, useState, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DataContext from "../context/DataContext";
import { Link } from "react-router-dom";

const AssociationRules = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const { products } = useContext(DataContext);
  const axiosPrivate = useAxiosPrivate();
  const fetchAssociationRules = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(`/orders/associations`);
      rules.sort((a, b) => {
        if (b.support !== a.support) {
          return b.support - a.support;
        }
        return b.confidence - a.confidence;
      });
      setRules(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAssociationRules();
  }, []);
  return (
    <section>
      <h3>Market Basket Analysis Results</h3>
      <table className="association-rules">
        <thead>
          <tr>
            <th>If Bought</th>
            <th>Reccomend</th>
            <th>Support</th>
            <th>Confidence</th>
            <th>Lift</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule._id}>
              <td>
                <ol style={{ listStyleType: "none" }}>
                  {rule.lhs.map((item) => (
                    <Link
                      to={`/${item}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {products.find((product) => product._id === item).title}
                    </Link>
                  ))}
                </ol>
              </td>
              <td>
                <ol style={{ listStyleType: "none" }}>
                  {rule.rhs.map((item) => (
                    <li key={item}>
                      <Link
                        to={`/${item}`}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        {products.find((product) => product._id === item).title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </td>
              <td>{rule.support.toFixed(2)}</td>
              <td>{rule.confidence.toFixed(2)}</td>
              <td>{rule.lift.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AssociationRules;
