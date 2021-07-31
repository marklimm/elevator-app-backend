import { Server } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import dotenv from 'dotenv'
import AsyncLock from 'async-lock'

import { ConnectionManager } from './ConnectionManager'
import { setClientActionListeners } from './BuildingActionListeners'
import { GameLoopManager } from '../gameLoops/GameLoopManager'

import { StateManager } from '../state/StateManager'
import { Broadcasters } from '../broadcasters/Broadcasters'

export class SocketIOSetup {
  static doSetup (httpServer: Server) : void {
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

    const gameLoopManager = new GameLoopManager(io, stateManager, broadcasters, lock)

    const connectionManager = new ConnectionManager(io, stateManager, gameLoopManager)

    io.on('connection', (socket: Socket) => {
      //  this executes whenever a client connects

      connectionManager.setConnectionListeners(socket)

      setClientActionListeners(socket, gameLoopManager, stateManager)
    })
  }
}
