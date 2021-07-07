import { Server } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import dotenv from 'dotenv'
import AsyncLock from 'async-lock'

import { ConnectionManager } from './ConnectionManager'
import { setClientActionListeners } from './BuildingActionListeners'

import { StateManager } from './StateManager'

import { PersonBroadcaster } from './broadcasts/PersonBroadcaster'
import { ElevatorBroadcaster } from './broadcasts/ElevatorBroadcaster'

export let elevatorBroadcaster: ElevatorBroadcaster
export let personBroadcaster: PersonBroadcaster

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

  const connectionManager = new ConnectionManager(io, stateManager, lock)

  elevatorBroadcaster = new ElevatorBroadcaster(io)
  personBroadcaster = new PersonBroadcaster(io)

  io.on('connection', (socket: Socket) => {
    //  this executes whenever a client connects

    connectionManager.setConnectionListeners(socket)

    setClientActionListeners(socket)
  })
}
