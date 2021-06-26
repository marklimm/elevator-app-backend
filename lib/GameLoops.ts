import { Server as SocketIOServer } from 'socket.io'

import { addPeople, getBroadcasterInformation, getNumUsers, spawnNewUser } from './BuildingState'
import { getChangeByAmount } from './Randomizer'

export class GameLoops {
  private _io: SocketIOServer

  /**
   * This flag is true when the game loops are currently running
   */
  private _active: boolean

  /**
 * Contains the ids for all of the currently running game loops
 */
   private intervalsArr: NodeJS.Timeout[] = []

   constructor (io: SocketIOServer) {
     this._io = io
     this._active = false
   }

   public start () : void {
     this._active = true

     //  fluctating number of people in the building
     this.intervalsArr.push(setInterval(this.fluctuatingNumPeopleLoop.bind(this), 4000))

     //  "main" loop ... wondering if this will end up changing
     this.intervalsArr.push(setInterval(this.mainLoop.bind(this), 2500))

     //  elevator manager
     // this.intervalsArr.push(setInterval(getElevatorManagerLoop(this._io), 2500))

     this.intervalsArr.push(setInterval(this.personSpawnLoop.bind(this), 3000))

     this.intervalsArr.push(setInterval(this.broadcasterLoop.bind(this), 3000))
   }

   public stop () : void {
     this._active = false

     //  clear all of the intervals/game loops
     this.intervalsArr.forEach(interval => clearInterval(interval))
   }

   get areRunning () : boolean {
     return this._active
   }

   private mainLoop () {
     //  console.log(`-- loop is executing at ${new Date()}`)

     //  const numPeople = building.getNumPeople()

     //  console.log(`there are currently ${numPeople} people in the building`)

     //  const newStatusMessage = {
     //    name: 'some name',
     //    text: `there are currently ${numPeople} people in the building`,
     //    numPeopleInBuilding: numPeople
     //  }

     //  //  broadcast the number of people in the building to all clients
     //  this._io.emit('status-update', newStatusMessage)
   }

   private fluctuatingNumPeopleLoop () : void {
     //  increase or decrease the amount of people in the building to simulate people entering and leaving the building
     addPeople(getChangeByAmount())
   }

   private personSpawnLoop () : void {
     //  don't add more people if there's already one user
     if (getNumUsers() > 0) { return }

     spawnNewUser()
   }

   private broadcasterLoop () : void {
     const broadcastStr = getBroadcasterInformation()

     //  broadcast the number of people in the building to all clients
     this._io.emit('status-update', { text: broadcastStr })
   }
}
