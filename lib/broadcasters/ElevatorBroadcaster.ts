
import { Server as SocketIOServer } from 'socket.io'

import { Elevator } from '../state/Elevator'
import { ElevatorUpdate, ElevatorStatus, OkOrError } from '../types/ElevatorAppTypes'

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
        name: elevator.name
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
        name: elevator.name
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
        name: elevator.name
      },
      currFloor: elevator.currFloor
    }

    const elevatorMovingResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorMovingResponse)
  }

  public broadcastElevatorOpensDoors (elevator: Elevator) : void {
    const elevatorUpdate: ElevatorUpdate = {
      type: ElevatorStatus.DOORS_OPENING,
      people: [],
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name
      },
      currFloor: elevator.currFloor
    }

    const elevatorOpensDoorsResponse = {
      status: OkOrError.Ok,
      elevatorUpdate
    }

    this._io.emit('elevator-update', elevatorOpensDoorsResponse)
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
        name: elevator.name
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
