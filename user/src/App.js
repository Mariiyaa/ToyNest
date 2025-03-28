import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Footer from './components/Footer';
import axios from 'axios'
import Profile from './pages/Profile';


axios.defaults.baseURL = process.env.REACT_APP_BACK_PORT
axios.defaults.withCredentials = true
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
         {/*<Route path="/checkout" element={<Checkout />} />*/}
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

