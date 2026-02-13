import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useRef, useEffect } from 'react';

function Room() {
    const { roomId } = useParams();
    const location = useLocation();
    const { username } = location.state;

    useEffect(() => {
        const socket = io('http://localhost:5001');
        console.log('WebSocket Connected');

        socket.emit('join-room', {
            roomId: roomId,
            username: username
        });

        socket.on('load-code',(code) => {
        console.log(code);
        });
    }, []);

    return (
        <div>
            <h1>Room Component</h1>
            <p>This is where the editor shall be.</p>
            <p>Room Id: {roomId}</p>
            <p>Username: {username}</p>
        </div>
    )
}

export default Room;