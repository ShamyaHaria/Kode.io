import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/create-room');
      const data = await response.json();
      navigate(`/room/${data.roomId}`, { state: { username } });
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    }
  };

  const joinRoom = () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!roomId.trim()) {
      alert('Please enter room ID');
      return;
    }
    navigate(`/room/${roomId}`, { state: { username } });
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Kode.io</h1>
        <p className="subtitle">Real-time Collaborative Code Editor</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter room ID (optional)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="button-group">
          <button onClick={createRoom} className="btn btn-primary">
            Create New Room
          </button>
          <button onClick={joinRoom} className="btn btn-secondary">
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;