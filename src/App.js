import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  // This effect will run once after the initial rendering of the component
  useEffect(() => {
    // Connect to your WebSocket backend
    ws.current = new WebSocket('wss://chat-stream-51f519488d32.herokuapp.com/');

    ws.current.onmessage = (event) => {
      // Update the messages state when a new message is received
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onopen = () => {
      console.log('Connected to the WebSocket server.');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the WebSocket server.');
    };

    // Clean up the WebSocket connection when the component unmounts
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
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Send the inputValue as a stringified JSON object
      ws.current.send(JSON.stringify({ prompt: inputValue }));
      setInputValue('');
    }
  };

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} className="message">
        {/* Render the message text or the entire message */}
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
