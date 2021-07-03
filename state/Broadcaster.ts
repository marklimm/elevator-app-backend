import { Server } from 'socket.io'
import { Elevator, OkOrError, StatusUpdateResponse, User } from '../lib/BuildingActions'
import { ElevatorUpdate, ElevatorUpdateType } from '../lib/ElevatorEvents'

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

export const broadcastElevatorMoving = (elevator: Elevator) : void => {
  const elevatorMovingUpdate: ElevatorUpdate = {
    type: ElevatorUpdateType.MOVING_TO_FLOOR,
    user: [],
    elevator: {
      elevatorId: elevator.name,
      name: elevator.name
    },
    currFloor: elevator.currFloor
  }

  _io.emit('elevator-update', elevatorMovingUpdate)
}

export const broadcastElevatorOpensDoors = (elevator: Elevator) : void => {
  const elevatorOpensDoorsUpdate: ElevatorUpdate = {
    type: ElevatorUpdateType.OPENING_DOORS,
    user: [],
    elevator: {
      elevatorId: elevator.name,
      name: elevator.name
    },
    currFloor: elevator.currFloor
  }

  _io.emit('elevator-update', elevatorOpensDoorsUpdate)
}
