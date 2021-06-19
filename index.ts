import express, { Application, Request, Response } from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import { Server, Socket } from 'socket.io'
import { onDisconnect, onNewConnection, setSocketListeners } from './lib/GameLoopManager'

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

io.on('connection', (socket: Socket) => {
  //  this executes whenever a client connects

  onNewConnection(io, socket)

  socket.on('disconnect', onDisconnect)

  setSocketListeners(socket)
})

httpServer.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`)
})
