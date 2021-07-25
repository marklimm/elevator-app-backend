
import { Server as SocketIOServer } from 'socket.io'
import { Elevator } from '../state/Elevator'

import { Person } from '../state/Person'
import { PersonUpdate, PersonStatus } from '../types/EventPayloads'

/**
 * This class broadcasts Person updates to the clients
 */
export class PersonBroadcaster {
  private _io: SocketIOServer

  constructor (io: SocketIOServer) {
    this._io = io
  }

  public broadcastNewPersonSpawned (person: Person) : void {
    const newPersonSpawned: PersonUpdate = {
      type: PersonStatus.NEWLY_SPAWNED,
      person: {
        personId: person.name,
        name: person.name
      },
      currFloor: person.currFloor
    }

    this._io.emit('person-update', newPersonSpawned)
  }

  public broadcastPersonRequestedElevator (person: Person) : void {
    const personWaitingForElevator: PersonUpdate = {
      type: PersonStatus.WAITING_FOR_ELEVATOR,
      person: {
        personId: person.name,
        name: person.name
      },
      currFloor: person.currFloor,
      destFloor: person.destFloor
    }

    this._io.emit('person-update', personWaitingForElevator)
  }

  public broadcastPersonEnteredElevator (person: Person, elevator: Elevator) : void {
    const personWhoEnteredElevator: PersonUpdate = {
      type: PersonStatus.ENTERED_THE_ELEVATOR,
      person: {
        personId: person.name,
        name: person.name
      },
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name
      },
      currFloor: person.currFloor,
      destFloor: person.destFloor
    }

    this._io.emit('person-update', personWhoEnteredElevator)
  }
}
