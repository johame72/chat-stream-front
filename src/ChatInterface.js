//src\ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // Establish a WebSocket connection with the server
    ws.current = new WebSocket('wss://chat-stream-51f519488d32.herokuapp.com/');
    
    ws.current.onmessage = (event) => {
      // When a message is received, parse it and update the state
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onopen = () => {
      console.log('Connected to the WebSocket server');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Update the inputValue state when the user types in the input field
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Send the inputValue to the server when the user submits the form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submit action
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ prompt: inputValue }));
      setInputValue(''); // Clear the input field after sending the message
    }
  };

  // Render the messages received from the server
  const renderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} className="message">
        <p>{message.text || message}</p> {/* Adjust according to the message format */}
      </div>
    ));
  };

  return (
    <div className="chat-interface">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
      <div className="messages">
        {renderMessages()}
      </div>
    </div>
  );
};

export default ChatInterface;
