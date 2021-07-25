import { Server as SocketIOServer } from 'socket.io'

import { ElevatorBroadcaster } from './ElevatorBroadcaster'
import { PersonBroadcaster } from './PersonBroadcaster'

export class Broadcasters {
  public elevatorBroadcaster: ElevatorBroadcaster
  public personBroadcaster: PersonBroadcaster

  constructor (io: SocketIOServer) {
    this.elevatorBroadcaster = new ElevatorBroadcaster(io)
    this.personBroadcaster = new PersonBroadcaster(io)
  }
}
