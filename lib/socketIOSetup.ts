import { Server } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import dotenv from 'dotenv'

import { setConnectionListeners } from './ClientManager'
import { setClientActionListeners } from './BuildingActionListeners'

import { initializeBroadcaster } from '../state/Broadcaster'
import { initializeGameLoops } from '../state/GameLoops'

export const initSocketIO = (httpServer: Server) : void => {
//  allows us to read environment variables
  dotenv.config()

  const options = {
    cors: {
    //  only allow specific clients to connect
      origin: (process.env.CLIENT_URLS || '').split(' ')
    }
  }

  const io = new SocketIOServer(httpServer, options)

  initializeGameLoops(io)
  initializeBroadcaster(io)

  io.on('connection', (socket: Socket) => {
    //  this executes whenever a client connects

    setConnectionListeners(socket)

    setClientActionListeners(socket)
  })
}
