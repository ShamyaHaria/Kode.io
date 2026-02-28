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
        <div style={{height:'100vh', display:'flex', flexDirection:'column'}}>
            <div style={{padding:'10px 20px', backgroundColor: '#1e1e1e', color: 'cyan', display:'flex', gap:'20px'}}>
                <span style={{fontSize:'18px', fontWeight:'bold'}}>Kode.io</span>
                <span>Room Id: {roomId.slice(0,8)}</span>
                <span>Username: {username}</span>
            </div>

            <div style={{flex:1}}>
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    )
}

export default Room;