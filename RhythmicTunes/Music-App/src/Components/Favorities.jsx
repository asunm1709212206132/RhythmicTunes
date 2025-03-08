// Updated Favorities.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';

function Favorities() {
  const [favorites, setFavorites] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/favorities')
      .then(response => setFavorites(response.data))
      .catch(error => console.error('Error fetching favorites:', error));
  }, []);

  const handleAudioPlay = (audioElement) => {
    if (currentlyPlaying && currentlyPlaying !== audioElement) {
      currentlyPlaying.pause();
    }
    setCurrentlyPlaying(audioElement);
  };

  const removeFromFavorites = async (itemId) => {
    await axios.delete(`http://localhost:3000/favorities/${itemId}`);
    setFavorites(favorites.filter(item => item.id !== itemId));
  };

  return (
    <div>
      <h2>Favorites</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.genre}</td>
              <td>
                <audio controls onPlay={(e) => handleAudioPlay(e.target)}>
                  <source src={item.songUrl} />
                </audio>
                <Button style={{ backgroundColor: 'red', border: 'none' }} onClick={() => removeFromFavorites(item.id)}>
                  <FaHeart color="white" /> Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Favorities;
