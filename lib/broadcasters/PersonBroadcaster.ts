
import { Server as SocketIOServer } from 'socket.io'
import { Elevator } from '../state/Elevator'

import { Person } from '../state/Person'
import { PersonUpdate, PersonStatus, OkOrError } from '../types/ElevatorAppTypes'

/**
 * This class broadcasts Person updates to the clients
 */
export class PersonBroadcaster {
  private _io: SocketIOServer

  constructor (io: SocketIOServer) {
    this._io = io
  }

  public broadcastNewPersonSpawned (person: Person) : void {
    const personUpdate: PersonUpdate = {
      type: PersonStatus.NEWLY_SPAWNED,
      person: {
        personId: person.name,
        name: person.name
      },
      currFloor: person.currFloor
    }

    const newPersonSpawnedResponse = {
      status: OkOrError.Ok,
      personUpdate
    }

    this._io.emit('person-update', newPersonSpawnedResponse)
  }

  public broadcastPersonRequestedElevator (person: Person) : void {
    const personUpdate: PersonUpdate = {
      type: PersonStatus.REQUESTED_ELEVATOR,
      person: {
        personId: person.name,
        name: person.name
      },
      currFloor: person.currFloor,
      destFloor: person.destFloor
    }

    const personRequestedElevatorResponse = {
      status: OkOrError.Ok,
      personUpdate
    }

    this._io.emit('person-update', personRequestedElevatorResponse)
  }

  public broadcastPersonEnteredElevator (person: Person, elevator: Elevator) : void {
    const personUpdate: PersonUpdate = {
      type: PersonStatus.ENTERED_THE_ELEVATOR,
      person: {
        personId: person.name,
        name: person.name
      },
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: person.currFloor,
      destFloor: person.destFloor
    }

    const personEnteredElevatorResponse = {
      status: OkOrError.Ok,
      personUpdate
    }

    this._io.emit('person-update', personEnteredElevatorResponse)
  }

  public broadcastPersonPressedButton (person: Person, elevator: Elevator) : void {
    const personUpdate: PersonUpdate = {
      type: PersonStatus.PRESSED_BUTTON,
      person: {
        personId: person.name,
        name: person.name
      },
      elevator: {
        elevatorId: elevator.name,
        name: elevator.name,
        direction: elevator.direction
      },
      currFloor: person.currFloor,
      destFloor: person.destFloor
    }

    const personPressedButtonResponse = {
      status: OkOrError.Ok,
      personUpdate
    }

    this._io.emit('person-update', personPressedButtonResponse)
  }
}
