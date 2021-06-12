import express from 'express';
import { createServer } from 'http'
import { Server, Socket } from "socket.io";

//  started to create this file following https://blog.logrocket.com/typescript-with-node-js-and-express/

const app = express();

const httpServer = createServer(app)

const options = { cors: {
  //  only allow specific clients to connect
  origin: 'http://localhost:3000'
}}

const socketIO = new Server(httpServer, options)

const PORT = process.env.PORT || 8000;

//  a regular API route
app.get('/', (req,res) => res.send(`Express + TypeScript Server is awesome!!! - ${new Date()}`));


socketIO.on("connection", (socket: Socket) => {
  //  this executes whenever a client connects

  console.log('a user connected')

  //  when a connection is made, emit back to that connection
  socket.emit('connectionAck', {
    message: 'thanks!  connection received!'
  })

  socket.on('clientMessage', (data) => {
    console.log('data from client: ', data)
  })

  socket.on('disconnect', function () {
    //  this executes whenever a client disconnects

    console.log('a user disconnected');
 });
})

httpServer.listen(PORT, () => {
  console.log(`⚡️ server listening on *:${PORT}`)
})
