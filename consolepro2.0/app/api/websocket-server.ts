import { WebSocketServer } from 'ws';

// Create a new WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send a welcome message to the client
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo the message back to the client
    ws.send(`Echo: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080'); 