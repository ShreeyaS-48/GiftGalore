import React from "react";
import { useEffect, useState, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DataContext from "../context/DataContext";
import { Link } from "react-router-dom";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts";

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
  const chartData = rules.map((rule) => {
    const lhsNames = rule.lhs
      .map((id) => products.find((p) => p._id === id)?.title || "")
      .join(", ");
    const rhsNames = rule.rhs
      .map((id) => products.find((p) => p._id === id)?.title || "")
      .join(", ");
    return {
      support: rule.support,
      confidence: rule.confidence,
      lift: rule.lift,
      label: `${lhsNames} → ${rhsNames}`,
    };
  });
  return (
    <section>
      <h3>Market Basket Analysis Results</h3>
      <div className="chart-container" style={{ flex: 1, minWidth: "300px" }}>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="support" name="Support" />
            <YAxis type="number" dataKey="confidence" name="Confidence" />
            <ZAxis type="number" dataKey="lift" range={[60, 400]} name="Lift" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => value.toFixed(2)}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "white",
                        border: "1px solid #ccc",
                        padding: "8px",
                      }}
                    >
                      <strong>{d.label}</strong>
                      <br />
                      Support: {d.support.toFixed(2)}
                      <br />
                      Confidence: {d.confidence.toFixed(2)}
                      <br />
                      Lift: {d.lift.toFixed(2)}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter name="Rules" data={chartData} fill="#82853e" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
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
