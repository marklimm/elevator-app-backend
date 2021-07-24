
import { Server as SocketIOServer } from 'socket.io'

import { Elevator } from '../state/Elevator'
import { ElevatorUpdate, ElevatorStatus } from '../types/EventPayloads'

export class ElevatorBroadcaster {
  private _io: SocketIOServer

  constructor (io: SocketIOServer) {
    this._io = io
  }

  public broadcastElevatorReady (elevator: Elevator) : void {
    const elevatorReady: ElevatorUpdate = {
      type: ElevatorStatus.READY,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name
      },
      currFloor: elevator.currFloor
    }

    this._io.emit('elevator-update', elevatorReady)
  }

  public broadcastElevatorTookRequest (elevator: Elevator) : void {
    const elevatorReceivedRequest: ElevatorUpdate = {
      type: ElevatorStatus.TOOK_REQUEST,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name
      },
      currFloor: elevator.currFloor,
      destFloor: elevator.destFloor
    }

    this._io.emit('elevator-update', elevatorReceivedRequest)
  }

  public broadcastElevatorMoving (elevator: Elevator) : void {
    const elevatorMoving: ElevatorUpdate = {
      type: ElevatorStatus.MOVING_TO_FLOOR,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name
      },
      currFloor: elevator.currFloor
    }

    this._io.emit('elevator-update', elevatorMoving)
  }

  public broadcastElevatorOpensDoors (elevator: Elevator) : void {
    const elevatorDoorsOpening: ElevatorUpdate = {
      type: ElevatorStatus.DOORS_OPENING,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name
      },
      currFloor: elevator.currFloor
    }

    this._io.emit('elevator-update', elevatorDoorsOpening)
  }

  public broadcastElevatorReceivesDestination (elevator: Elevator) : void {
    const elevatorReceivesDestination: ElevatorUpdate = {
      type: ElevatorStatus.RECEIVED_DESTINATION,
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

    this._io.emit('elevator-update', elevatorReceivesDestination)
  }
}
