// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map(); // Map to store WebSocket connections associated with user IDs

wss.on('connection', function connection(ws, req) {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const currentUser = urlParams.get('current_user');

  console.log(`User ${currentUser} connected`);

  clients.set(currentUser, ws);

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      const toUserId = data.toUserId;
      const toUserSocket = clients.get(toUserId);
      
      if (toUserSocket) {
        toUserSocket.send(`From ${currentUser}: ${data.message}`);
      } else {
        console.log(`User ${toUserId} not found`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', function close() {
    console.log(`User ${currentUser} disconnected`);
    clients.delete(currentUser);
  });
});
