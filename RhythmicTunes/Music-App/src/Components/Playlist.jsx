// Updated Playlist.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/playlist')
      .then(response => setPlaylist(response.data))
      .catch(error => console.error('Error fetching playlist items:', error));
  }, []);

  const handleAudioPlay = (audioElement) => {
    if (currentlyPlaying && currentlyPlaying !== audioElement) {
      currentlyPlaying.pause();
    }
    setCurrentlyPlaying(audioElement);
  };

  const playAllSongs = () => {
    if (playlist.length === 0) return;
    
    const firstSong = document.getElementById(`audio-${playlist[0].id}`);
    if (!firstSong) return;
    
    if (firstSong.paused) {
      firstSong.play();
      setIsPlaying(true);
      firstSong.addEventListener('ended', function playNext() {
        const nextIndex = (playlist.indexOf(playlist[0]) + 1) % playlist.length;
        const nextSong = document.getElementById(`audio-${playlist[nextIndex].id}`);
        if (nextSong) nextSong.play();
        firstSong.removeEventListener('ended', playNext);
      });
    } else {
      firstSong.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <h2>Playlist</h2>
      <Button onClick={playAllSongs}>
        {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
      </Button>
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
          {playlist.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.genre}</td>
              <td>
                <audio controls id={`audio-${item.id}`} onPlay={(e) => handleAudioPlay(e.target)}>
                  <source src={item.songUrl} />
                </audio>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Playlist;
