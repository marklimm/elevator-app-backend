import { Server } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import dotenv from 'dotenv'

import { setConnectionListeners } from './ConnectionManager'
import { setClientActionListeners } from './BuildingActionListeners'

import { initializeBroadcasters } from './broadcasts/Broadcaster'
import { initializeGameLoops } from './GameLoops'
import { resetElevators } from '../state/Elevators'

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

  resetElevators()
  initializeGameLoops(io)
  initializeBroadcasters(io)

  io.on('connection', (socket: Socket) => {
    //  this executes whenever a client connects

    setConnectionListeners(socket)

    setClientActionListeners(socket)
  })
}
