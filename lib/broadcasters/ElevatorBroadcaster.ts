
import { Server as SocketIOServer } from 'socket.io'

import { Elevator } from '../state/Elevator'
import { ElevatorUpdate, ElevatorStatus, OkOrError, Direction } from '../types/ElevatorAppTypes'

/**
 * This class broadcasts Elevator updates to the clients
 */
export class ElevatorBroadcaster {
  private _io: SocketIOServer

  constructor (io: SocketIOServer) {
    this._io = io
  }

  public broadcastElevatorReady (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.READY,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: Direction.NONE
      },
      currFloor: elevator.currFloor
    }

    const elevatorReadyResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorReadyResponse)
  }

  public broadcastElevatorTookRequest (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.TOOK_REQUEST,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: elevator.currFloor,
      destFloor: elevator.destFloor
    }

    const elevatorTookRequestResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorTookRequestResponse)
  }

  public broadcastElevatorMoving (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.MOVING_TO_FLOOR,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: elevator.currFloor
    }

    const elevatorMovingResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorMovingResponse)
  }

  public broadcastElevatorOpeningDoors (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.DOORS_OPENING,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: elevator.currFloor
    }

    const elevatorOpensDoorsResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorOpensDoorsResponse)
  }

  public broadcastElevatorDoorsOpen (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.DOORS_OPEN,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: elevator.currFloor
    }

    const elevatorDoorsOpenResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorDoorsOpenResponse)
  }

  public broadcastElevatorReceivesDestination (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.RECEIVED_DESTINATION,
      people: elevator.people.map(p => ({
        name: p.name,
        personId: p.name
      })),
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: elevator.currFloor,
      destFloor: elevator.destFloor
    }

    const elevatorReceivesDestinationResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorReceivesDestinationResponse)
  }
}
