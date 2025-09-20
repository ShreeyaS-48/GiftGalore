import React from "react";

import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const today = new Date();
  return (
    <footer className="footer">
      <p>&copy; {today.getFullYear()} Gift Galore</p>
      <p>Connect With Us</p>
      <ul
        className="connect"
        style={{ listStyleType: "none", display: "flex", gap: "7px" }}
      >
        <li>
          <FaTwitter />
        </li>
        <li>
          <FaFacebook />
        </li>
        <li>
          <FaInstagram />
        </li>
      </ul>
      <ul
        className="connect"
        style={{ listStyleType: "none", display: "flex", gap: "7px" }}
      >
        <li>Contact Us</li>
        <li>FAQs</li>
      </ul>
    </footer>
  );
};

export default Footer;
