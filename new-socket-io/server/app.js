const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('new client connected', socket.id);

  socket.on('user_join', (name) => {
    socket.broadcast.emit('user_join', name);
  });

  socket.on('join-room', (data) => {
    socket.leave(data.previousRoom);
    socket.join(data.newRoom);
    console.log(`joined room ${data.newRoom}`);
    socket.emit('joined-room', {roomId: data.newRoom, name: data.name});
  });

  socket.on('send-message', ({name, message, room}) => {
    console.log({name, message, room});
    io.to(room).emit('receive-message', {name, message});
  });

  socket.on('message', ({name, message}) => {
    console.log(name, message, socket.id);
    io.emit('message', {name, message});
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
