import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";

function Room() {
    const { roomId } = useParams();
    const location = useLocation();
    const { username } = location.state;
    const [code, setCode] = useState('');
    const socketRef = useRef(null);

     function handleEditorChange(newCode){
        setCode(newCode);
        socketRef.current.emit('code-change',{
            roomId: roomId,
            code: newCode
        });
    }

    useEffect(() => {
        socketRef.current = io('http://localhost:5001');
        console.log('WebSocket Connected');

        socketRef.current.emit('join-room', {
            roomId: roomId,
            username: username
        });

        socketRef.current.on('load-code',(code) => {
            console.log(code);
            setCode(code);
        });

        socketRef.current.on('code-update',(updatedCode)=>{
            setCode(updatedCode);
        })
    }, []);

    return (
        <div>
            <div>
                <h1>Room Component</h1>
                <p>This is where the editor shall be.</p>
                <p>Room Id: {roomId}</p>
                <p>Username: {username}</p>
            </div>

        <Editor
            height="500px"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
        />
        </div>
    )
}

export default Room;