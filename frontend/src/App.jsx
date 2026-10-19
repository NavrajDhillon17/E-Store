import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes";
import "./App.css";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Store Pages with Nav and Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoutes requireAdmin={true}>
                <Admin />
              </ProtectedRoutes>
            }
          />
        </Route>

        {/* Dedicated Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
