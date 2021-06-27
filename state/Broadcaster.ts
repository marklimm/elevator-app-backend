import { Server } from 'socket.io'
import { Elevator, ElevatorStatusUpdate, OkOrError, StatusUpdateResponse, User } from '../lib/BuildingActions'

let _io: Server

export const initializeBroadcaster = (io : Server) : void => {
  _io = io
}

export const broadcastUserStatusUpdate = (user: User) : void => {
  const statusUpdateResponse: StatusUpdateResponse = {
    users: [user],
    status: OkOrError.Ok
  }

  console.log(`broadcasting user status update for ${user}`)

  //  broadcast a status update to all clients
  _io.emit('status-update', statusUpdateResponse)
}

export const broadcastElevatorStatusUpdate = (elevator: Elevator) : void => {
  const elevatorStatusUpdate: ElevatorStatusUpdate = {
    elevator,
    status: OkOrError.Ok
  }

  //  broadcast the elevator status change to all clients
  _io.emit('elevator-update', elevatorStatusUpdate)
}
