// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import Slider from 'react-slick';
import PropTypes from 'prop-types';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderLoading = () => <div>Loading...</div>;
  const renderError = () => <div>Error: {error}</div>;
  
  const renderGraphData = () => 
    products.map(({ name, quantity }) => ({ name, quantity }));

  const renderImageCarousel = () => {
    const images = [
      'https://via.placeholder.com/200?text=Product+A',
      'https://via.placeholder.com/200?text=Product+B',
      'https://via.placeholder.com/200?text=Product+C',
    ];
    
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="image-carousel">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Product ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const renderProductTable = () => (
    <table className="table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity in Stock</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ?
          products.map(({ id, name, quantity }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{quantity}</td>
            </tr>
          )) :
          <tr>
            <td colSpan="2" className="no-products">No products available</td>
          </tr>
        }
      </tbody>
    </table>
  );

  return (
    <div className="dashboard">
      <h2>Dashboard - Current Stock Levels</h2>
      {loading ? renderLoading() : error ? renderError() : (
        <>
          <BarChart width={600} height={300} data={renderGraphData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
          {renderImageCarousel()}
          {renderProductTable()}
        </>
      )}
    </div>
  );
};

export default Dashboard;
