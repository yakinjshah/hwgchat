<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSocket Chat</title>
</head>
<body>
  <h2>Chat with User</h2>
  <label for="toUser">Send to User:</label>
  <input type="text" id="toUser" placeholder="User ID">

  <input type="text" id="messageInput" placeholder="Type a message...">
  <button id="sendButton">Send</button>
  <ul id="messages"></ul>

  <script>

      // Example: Decode token to obtain user ID
      //const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentUser = <?php echo $_GET['me']; ?>; //decodedToken.userId

      const socket = new WebSocket(`ws://localhost:3000?current_user=${currentUser}`);

      const messagesElement = document.getElementById('messages');
      const messageInput = document.getElementById('messageInput');
      const sendButton = document.getElementById('sendButton');

      sendButton.addEventListener('click', function() {
        const toUser = document.getElementById('toUser').value.trim();
        const message = messageInput.value.trim();
        if (toUser !== '' && message !== '') {
          // Example: Send message along with recipient's user ID
          const data = {
            toUserId: toUser,
            message: message
          };
          socket.send(JSON.stringify(data));
          messageInput.value = '';
        } else {
          alert('Please enter recipient user ID and message.');
        }
      });

      socket.addEventListener('message', function(event) {
        const message = event.data;
        displayMessage(message);
      });

      function displayMessage(message) {
        const li = document.createElement('li');
        li.textContent = message;
        messagesElement.appendChild(li);
      }
  </script>
</body>
</html>
