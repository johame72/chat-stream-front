// src\App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('wss://chat-stream-51f519488d32.herokuapp.com/');

    ws.current.onmessage = (event) => {
      console.log('Message received:', event.data);
      try {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending message:', inputValue);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ prompt: inputValue }));
      setInputValue('');
    }
  };

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} className="message">
        <p>{message.text || message}</p>
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with AI</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="App-input"
          />
          <button type="submit" className="App-submit">
            Send
          </button>
        </form>
        <div className="App-messages">
          {renderMessages()}
        </div>
      </header>
    </div>
  );
}

export default App;
