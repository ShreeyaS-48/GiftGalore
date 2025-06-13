// components/Layout.js
import React from 'react';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Header />
      <Nav />
      <Outlet />  {/* This is where nested routes render */}
      <Footer />
    </>
  );
};

export default Layout;
