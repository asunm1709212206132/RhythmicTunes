// Updated Wishlist.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Unavbar from './Unavbar';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.get(`http://localhost:3000/wishlist/${user.id}`)
        .then(response => setWishlist(response.data))
        .catch(error => console.error('Error fetching wishlist:', error));
    }
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.post(`http://localhost:3000/wishlist/remove`, { itemId });
      setWishlist(wishlist.filter(item => item.itemId !== itemId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  return (
    <div>
      <Unavbar />
      <h2 className="text-3xl font-semibold mb-4 text-center">Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <img src={item.itemImage} alt="Item" className="rounded-t-lg" style={{ height: '350px', width: '500px' }} />
            <p className="text-xl font-bold mb-2">{item.title}</p>
            <p className="text-gray-700 mb-2">Author: {item.author}</p>
            <p className="text-gray-700 mb-2">Genre: {item.genre}</p>
            <Button style={{ backgroundColor: 'red', border: 'none' }} onClick={() => removeFromWishlist(item.itemId)}>
              Remove
            </Button>
            <Button style={{ backgroundColor: 'purple', border: 'none' }}>
              <Link to={`/uitem/${item.itemId}`} style={{ color: 'white', textDecoration: 'none' }}>View</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
