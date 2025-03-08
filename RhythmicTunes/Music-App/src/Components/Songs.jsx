// Updated Songs.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './sidebar.css';

function Songs() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching songs:', error));

    axios.get('http://localhost:3000/favorities')
      .then(response => setWishlist(response.data))
      .catch(() => setWishlist([]));

    axios.get('http://localhost:3000/playlist')
      .then(response => setPlaylist(response.data))
      .catch(() => setPlaylist([]));
  }, []);

  const handleAudioPlay = (audioElement) => {
    if (currentlyPlaying && currentlyPlaying !== audioElement) {
      currentlyPlaying.pause();
    }
    setCurrentlyPlaying(audioElement);
  };

  const addToWishlist = async (itemId) => {
    const selectedItem = items.find(item => item.id === itemId);
    if (!selectedItem) return;
    await axios.post('http://localhost:3000/favorities', selectedItem);
    setWishlist([...wishlist, selectedItem]);
  };

  const removeFromWishlist = async (itemId) => {
    await axios.delete(`http://localhost:3000/favorities/${itemId}`);
    setWishlist(wishlist.filter(item => item.id !== itemId));
  };

  const isItemInWishlist = (itemId) => wishlist.some(item => item.id === itemId);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.singer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Songs List</h2>
      <InputGroup>
        <InputGroup.Text><FaSearch /></InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Search by singer, genre, or song name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <div>
        {filteredItems.map((item) => (
          <div key={item.id}>
            <h5>{item.title}</h5>
            <audio controls onPlay={(e) => handleAudioPlay(e.target)}>
              <source src={item.songUrl} />
            </audio>
            {isItemInWishlist(item.id) ? (
              <Button onClick={() => removeFromWishlist(item.id)}>Remove</Button>
            ) : (
              <Button onClick={() => addToWishlist(item.id)}>Add to Wishlist</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Songs;
