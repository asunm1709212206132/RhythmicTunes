// Updated Search.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      axios.get(`http://localhost:3000/items?q=${searchTerm}`)
        .then(response => setSearchResults(response.data))
        .catch(error => console.error('Error fetching search results:', error));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div>
      <h2>Search Songs</h2>
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
        {searchResults.map((result) => (
          <div key={result.id}>
            <h5>{result.title} - {result.singer}</h5>
            <audio controls>
              <source src={result.songUrl} />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
