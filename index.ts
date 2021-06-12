import express from 'express';
import { createServer } from 'http'
import dotenv from 'dotenv'
import { Server, Socket } from "socket.io";

//  started to create this file following https://blog.logrocket.com/typescript-with-node-js-and-express/


/**
 * A message that is sent between client and server via socketio
 */
interface StatusMessage {
  text: string
}


const app = express();
const httpServer = createServer(app)

dotenv.config()
const options = { cors: {
  //  only allow specific clients to connect
  origin: (process.env.CLIENT_URLS || "").split(' ')
}}

const io = new Server(httpServer, options)

const PORT = process.env.PORT || 8000;

//  a regular API route
app.get('/', (req,res) => res.send(`Express + TypeScript Server is awesome!!! - ${new Date()}`));

/**
 * The number of currently connected clients
 */
let numClients = 0

io.on("connection", (socket: Socket) => {
  //  this executes whenever a client connects

  console.log('a user connected')
  console.log(`There are now ${++numClients} client(s) connected`)

  //  when a connection is made, acknowledge that connection --> is this necessary?
  // socket.emit('connectionAck', {
  //   message: `thanks for connecting at ${new Date()}!`
  // })

  
  socket.on('client-message', (message: StatusMessage) => {
    console.log('message from client: ', message)

    const modifiedMessage: StatusMessage = {
      text: `Sent from a client: ${message.text}`
    }

    //  send status update to all clients
    io.emit("status-update", modifiedMessage);

    //  send status update to all clients except the one that sent this message
    // socket.broadcast.emit("status-update", modifiedMessage);    
  })

  socket.on('disconnect', function () {
    //  this executes whenever a client disconnects

    numClients--
    console.log('a user has disconnected');
 });
})

httpServer.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`)
})
