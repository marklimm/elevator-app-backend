import { Server } from 'socket.io'
import { StatusUpdateResponse } from '../lib/BuildingActions'

let _io: Server

export const initializeBroadcaster = (io : Server) : void => {
  _io = io
}

export const broadcastUpdate = (data: StatusUpdateResponse) : void => {
  //  broadcast the number of people in the building to all clients
  _io.emit('status-update', data)
}
