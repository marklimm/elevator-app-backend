import express, { Application, Request, Response } from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import { Server, Socket } from 'socket.io'
import { setConnectionListeners } from './lib/ClientManager'
import { GameLoops } from './lib/GameLoops'

//  started to create this file following https://blog.logrocket.com/typescript-with-node-js-and-express/

const app: Application = express()
const httpServer = createServer(app)

dotenv.config()
const options = {
  cors: {
  //  only allow specific clients to connect
    origin: (process.env.CLIENT_URLS || '').split(' ')
  }
}

const io = new Server(httpServer, options)

const PORT = process.env.PORT || 8000

//  a regular API route
app.get('/', (req: Request, res: Response) => res.send(`Express + TypeScript Server is awesome!!! - ${new Date()}`))

//  initialize the game loops but don't start them yet
const gameLoops = new GameLoops(io)

io.on('connection', (socket: Socket) => {
  //  this executes whenever a client connects

  setConnectionListeners(gameLoops, socket)
})

httpServer.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`)
})
