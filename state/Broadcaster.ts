import { Server } from 'socket.io'
import { ElevatorUpdate, ElevatorUpdateType, PersonUpdate, PersonUpdateType } from '../lib/types/Events'
import { Elevator } from '../lib/types/Elevator'
import { Person } from '../lib/types/Person'

let _io: Server

export const initializeBroadcaster = (io : Server) : void => {
  _io = io
}

// export const broadcastUserStatusUpdate = (user: User) : void => {
//   const statusUpdateResponse: StatusUpdateResponse = {
//     users: [user],
//     status: OkOrError.Ok
//   }

//   console.log(`broadcasting user status update for ${user}`)

//   //  broadcast a status update to all clients
//   _io.emit('status-update', statusUpdateResponse)
// }

export const broadcastNewPersonSpawned = (person: Person) : void => {
  const newPersonSpawnedUpdate: PersonUpdate = {
    type: PersonUpdateType.NEWLY_SPAWNED,
    person: {
      personId: person.name,
      name: person.name
    },
    currFloor: person.currFloor
  }

  _io.emit('person-update', newPersonSpawnedUpdate)
}

export const broadcastElevatorMoving = (elevator: Elevator) : void => {
  const elevatorMovingUpdate: ElevatorUpdate = {
    type: ElevatorUpdateType.MOVING_TO_FLOOR,
    people: [],
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
    people: [],
    elevator: {
      elevatorId: elevator.name,
      name: elevator.name
    },
    currFloor: elevator.currFloor
  }

  _io.emit('elevator-update', elevatorOpensDoorsUpdate)
}
