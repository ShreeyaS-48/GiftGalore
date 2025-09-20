import React from "react";
import { Link } from "react-router-dom";
const Nav = () => {
  return (
    <nav className="Nav">
      <ul className="Nav-list">
        <li>
          <Link to="/products/cakes">Cakes</Link>
        </li>
        <li>
          <Link to="/products/bouquets">Bouquets</Link>
        </li>
        <li>
          <Link to="/products/plants">Plants</Link>
        </li>
        <li>
          <Link to="/products/chocolates">Chocolates</Link>
        </li>
        <li>
          <Link to="/products/combos">Combos</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
