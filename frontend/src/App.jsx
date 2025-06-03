import { useState } from "react";
import Catalog from "./Catalog.jsx";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Cart from "./Cart.jsx";
import Login from "./pages/Login.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Register from "./pages/Register.jsx";
import { useAuth } from "./components/AuthContext.jsx";
import Product from "./Product.jsx";
import CheckoutPage from "./CheckoutPage.jsx";

function App() {
  const [count, setCount] = useState(0);

  const { token, user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            token && user?._id ? (
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            ) : (
              <PublicRoute>
                <Login />
              </PublicRoute>
            )
          }
        ></Route>

        <Route
          path="/landingPage"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/catalog"
          element={
            <PrivateRoute>
              <Catalog />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/product/:productId"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
