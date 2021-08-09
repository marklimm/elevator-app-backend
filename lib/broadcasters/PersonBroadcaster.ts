
import { Server as SocketIOServer } from 'socket.io'

import { Person } from '../state/Person'
import { OkOrError } from '../types/ElevatorAppTypes'

/**
 * This class broadcasts Person updates to the clients
 */
export class PersonBroadcaster {
  private _io: SocketIOServer

  constructor (io: SocketIOServer) {
    this._io = io
  }

  private _sendPersonUpdate (person: Person) : void {
    const personUpdate = {
      status: OkOrError.Ok,
      personUpdate: person.toJS()
    }

    this._io.emit('person-update', personUpdate)
  }

  //  the below broadcast___() functions all do the same thing, but I thought it would make the code easier to read to have descriptive function names to see which update is being broadcast

  public broadcastNewPersonSpawned (person: Person) : void {
    this._sendPersonUpdate(person)
  }

  public broadcastPersonRequestedElevator (person: Person) : void {
    this._sendPersonUpdate(person)
  }

  public broadcastPersonEnteredElevator (person: Person) : void {
    this._sendPersonUpdate(person)
  }

  public broadcastPersonPressedButton (person: Person) : void {
    this._sendPersonUpdate(person)
  }
}
