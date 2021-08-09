
import { Server as SocketIOServer } from 'socket.io'

import { Elevator } from '../state/Elevator'
import { OkOrError } from '../types/ElevatorAppTypes'

/**
 * This class broadcasts Elevator updates to the clients
 */
export class ElevatorBroadcaster {
  private _io: SocketIOServer

  constructor (io: SocketIOServer) {
    this._io = io
  }

  private _sendElevatorUpdate (elevator: Elevator) : void {
    const elevatorUpdate = {
      status: OkOrError.Ok,
      elevatorUpdate: elevator.toJS()
    }

    this._io.emit('elevator-update', elevatorUpdate)
  }

  //  the below broadcast___() functions all do the same thing, but I thought it would make the code easier to read to have descriptive function names to see which update is being broadcast

  public broadcastElevatorReady (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorTookRequest (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorMoving (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorOpeningDoors (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorDoorsOpen (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorReceivedDestination (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorDoorsClosing (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }

  public broadcastElevatorDoorsClosed (elevator: Elevator) : void {
    this._sendElevatorUpdate(elevator)
  }
}
