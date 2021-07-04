import { Server } from 'socket.io'
import { ElevatorUpdate, ElevatorUpdateType, PersonUpdate, PersonUpdateType } from './types/EventPayloads'
import { Elevator } from './types/Elevator'
import { Person } from './types/Person'

let _io: Server

export const initializeBroadcaster = (io : Server) : void => {
  _io = io
}

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

export const broadcastPersonRequestedElevator = (person: Person) : void => {
  const personRequestedElevatorUpdate: PersonUpdate = {
    type: PersonUpdateType.REQUESTING_ELEVATOR,
    person: {
      personId: person.name,
      name: person.name
    },
    currFloor: person.currFloor,
    destFloor: person.destFloor
  }

  _io.emit('person-update', personRequestedElevatorUpdate)
}

export const broadcastPersonPressesButton = (elevator: Elevator) : void => {
  const elevatorReceivesDestination: ElevatorUpdate = {
    type: ElevatorUpdateType.RECEIVED_DESTINATION,
    people: elevator.people.map(p => ({
      name: p.name,
      personId: p.name
    })),
    elevator: {
      elevatorId: elevator.name,
      name: elevator.name
    },
    currFloor: elevator.currFloor,
    destFloor: elevator.destFloor
  }

  _io.emit('elevator-update', elevatorReceivesDestination)
}

export const broadcastElevatorTakingRequest = (elevator: Elevator) : void => {
  const elevatorTakingRequest: ElevatorUpdate = {
    type: ElevatorUpdateType.TAKING_REQUEST,
    people: [],
    elevator: {
      elevatorId: elevator.name,
      name: elevator.name
    },
    currFloor: elevator.currFloor,
    destFloor: elevator.destFloor
  }

  _io.emit('elevator-update', elevatorTakingRequest)
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
