import React from 'react';
import Header from './Header';
import Nav from './Nav';
import AdminNav from './AdminNav';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const hideNavPaths = ['/admin', '/admin/users', '/admin/admins', '/admin/orders']; // you can add more paths here if needed

  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      <Header />
      {!shouldHideNav && <Nav />}
      {shouldHideNav && <AdminNav/>}
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;

