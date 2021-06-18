import express, { Application, Request, Response } from 'express';
import { createServer } from 'http'
import dotenv from 'dotenv'
import { Server, Socket } from "socket.io";

import { BuildingState, Elevator, ElevatorDirective, StatusMessage } from './lib/Elevator'
import { getGameLoop } from './lib/GameLoop';


//  started to create this file following https://blog.logrocket.com/typescript-with-node-js-and-express/



const app: Application = express();
const httpServer = createServer(app)

dotenv.config()
const options = { cors: {
  //  only allow specific clients to connect
  origin: (process.env.CLIENT_URLS || "").split(' ')
}}

const io = new Server(httpServer, options)

const PORT = process.env.PORT || 8000;

//  a regular API route
app.get('/', (req: Request, res: Response) => res.send(`Express + TypeScript Server is awesome!!! - ${new Date()}`));

/**
 * The number of currently connected clients
 */
let numClients = 0




let theInterval: NodeJS.Timeout
let theIntervalIsRunning = false

io.on("connection", (socket: Socket) => {
  //  this executes whenever a client connects

  console.log('a user connected')

  numClients += 1
  console.log(`There are now ${numClients} client(s) connected`)

  if (!theIntervalIsRunning) {
    theIntervalIsRunning = true

    const gameLoopFunction = getGameLoop(io)

    theInterval = setInterval(gameLoopFunction, 4000)
  }


  //  when a connection is made, send back the current state of the elevators
  socket.emit('newConnectionAck', {
    message: 'Thanks for connecting!  You will soon receive updates on the current buliding status',
  })

  socket.on('disconnect', function () {
    //  this executes whenever a client disconnects

    numClients--
    console.log('a user has disconnected');

    if (numClients <= 0) {
      //  stop the interval since no more clients are connected

      clearInterval(theInterval)
      theIntervalIsRunning = false
    }
 });
})

httpServer.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`)
})
