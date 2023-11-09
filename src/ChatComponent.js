// src\ChatComponent.js
import React, { useState, useEffect, useRef } from 'react';

const ChatComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  // Connect to WebSocket server
  useEffect(() => {
    // Replace with your Heroku server WebSocket URL
    ws.current = new WebSocket('wss://chat-stream-51f519488d32.herokuapp.com/');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up function that runs when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to send message
  const sendMessage = () => {
    if (inputValue.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ prompt: inputValue }));
      setInputValue(''); // Reset input field
    }
  };

  // Function to render messages
  const renderMessages = () => {
    return messages.map((message, index) => (
      <div key={index}>
        <p>{message}</p>
      </div>
    ));
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type your prompt"
      />
      <button onClick={sendMessage}>Send</button>
      <div>{renderMessages()}</div>
    </div>
  );
};

export default ChatComponent;
