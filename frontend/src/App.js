import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Cakes from "./components/Cakes";
import Bouquets from "./components/Bouquets";
import Plants from "./components/Plants";
import Chocolates from "./components/Chocolates";
import Combos from "./components/Combos";
import ItemDetails from "./components/ItemDetails";
import Layout from "./components/Layout";
import { DataProvider } from "./context/DataContext";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthProvider";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import Admin from "./components/Admin";
import { AdminProvider } from "./context/AdminContext";
import Users from "./components/Users";
import Admins from "./components/Admins";
import Orders from "./components/Orders";
import PaymentSuccess from "./components/PaymentSuccess";
import PersistLogin from "./components/PersistLogin";
import ChatBot from "./components/ChatBot";
import OrderTracking from "./components/OrderTracking";
const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};
function App() {
  return (
    <main className="App">
      <AuthProvider>
        <DataProvider>
          <AdminProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* public routes */}
                  <Route element={<PersistLogin />}>
                    <Route index element={<Home />} />
                    <Route path="auth" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="unauthorized" element={<Unauthorized />} />
                    <Route path="products/cakes" element={<Cakes />} />
                    <Route path="products/bouquets" element={<Bouquets />} />
                    <Route path="products/plants" element={<Plants />} />
                    <Route
                      path="products/chocolates"
                      element={<Chocolates />}
                    />
                    <Route path="products/combos" element={<Combos />} />
                    <Route path=":id" element={<ItemDetails />} />

                    {/* protected routes (wrapped in PersistLogin) */}

                    <Route
                      element={<RequireAuth allowedRoles={[ROLES.User]} />}
                    >
                      <Route path="cart" element={<Cart />} />
                      <Route
                        path="cart/payment-success"
                        element={<PaymentSuccess />}
                      />
                      <Route path="chat" element={<ChatBot />} />
                      <Route path="/order/:id" element={<OrderTracking />} />
                    </Route>

                    <Route
                      element={<RequireAuth allowedRoles={[ROLES.Admin]} />}
                    >
                      <Route path="admin" element={<Admin />} />
                      <Route path="admin/users" element={<Users />} />
                      <Route path="admin/admins" element={<Admins />} />
                      <Route path="admin/orders" element={<Orders />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </CartProvider>
          </AdminProvider>
        </DataProvider>
      </AuthProvider>
    </main>
  );
}

export default App;
