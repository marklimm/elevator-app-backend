import { Server } from 'socket.io'
import { ElevatorBroadcaster } from './ElevatorBroadcaster'
import { PersonBroadcaster } from './PersonBroadcaster'

export let personBroadcaster: PersonBroadcaster
export let elevatorBroadcaster: ElevatorBroadcaster

export const initializeBroadcasters = (io : Server) : void => {
  personBroadcaster = new PersonBroadcaster(io)
  elevatorBroadcaster = new ElevatorBroadcaster(io)
}
