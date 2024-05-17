const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const url = require('url');

// Load SSL certificates
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/hwg.saikh.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/hwg.saikh.com/privkey.pem')
});

// Create WebSocket server using the HTTPS server
const wss = new WebSocket.Server({ server });
const clients = new Map(); // Map to store WebSocket connections associated with user IDs

wss.on('connection', function connection(ws, req) {
  const urlParams = new URLSearchParams(url.parse(req.url).query);
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

// Start the HTTPS server
server.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
