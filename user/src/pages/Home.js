import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <section className="bg-blue-200 p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to ToyNest</h1>
      <p className="mb-4">Discover a world of toys for all ages!</p>
      <Link to="/products" className="bg-yellow-400 text-white py-2 px-4 rounded">Shop Now</Link>
    </section>
  </div>
);

export default Home;
