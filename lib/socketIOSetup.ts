import { Server } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import dotenv from 'dotenv'
import AsyncLock from 'async-lock'

import { ConnectionManager } from './ConnectionManager'
import { setClientActionListeners } from './BuildingActionListeners'

import { StateManager } from './state/StateManager'
import { Broadcasters } from './broadcasters/Broadcasters'

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

  //  the single AsyncLock in the project
  const lock = new AsyncLock()

  const stateManager = new StateManager(lock)

  const broadcasters = new Broadcasters(io)

  const connectionManager = new ConnectionManager(io, stateManager, broadcasters, lock)

  io.on('connection', (socket: Socket) => {
    //  this executes whenever a client connects

    connectionManager.setConnectionListeners(socket)

    setClientActionListeners(socket)
  })
}
