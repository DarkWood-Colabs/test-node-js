// index.js

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('chatMessage', async (message) => {
    try {
	    const apiKey = 'YOUR_API_KEY';
	    const apiResponse = await axios.post('https://api.openai.com/v1/conversations/text-davinci-003/messages', {
		    message: message,
		    apiKey: apiKey
      });

      const responseMessage = apiResponse.data.message;
      io.emit('message', responseMessage);
    } catch (error) {
      console.error('Error calling the API:', error.message);
      io.emit('message', 'Error: Could not process your message.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

