import { Server } from 'socket.io'

import { building } from './Building'
import { getChangeByAmount } from './Randomizer'

export class GameLoops {
  private _io: Server

  /**
   * This flag is true when the game loops are currently running
   */
  private _active: boolean

  /**
 * Contains the ids for all of the currently running game loops
 */
   private intervalsArr: NodeJS.Timeout[] = []

   constructor (io: Server) {
     this._io = io
     this._active = false
   }

   public startGameLoops () : void {
     this._active = true

     //  fluctating number of people in the building
     this.intervalsArr.push(setInterval(this.fluctuatingNumPeopleLoop.bind(this), 4000))

     //  "main" loop ... wondering if this will end up changing
     this.intervalsArr.push(setInterval(this.mainLoop.bind(this), 2500))
   }

   public stopGameLoops () : void {
     this._active = false

     //  clear all of the intervals/game loops
     this.intervalsArr.forEach(interval => clearInterval(interval))
   }

   public areRunning () : boolean {
     return this._active
   }

   private mainLoop () {
     console.log(`-- loop is executing at ${new Date()}`)

     const numPeople = building.getNumPeople()

     console.log(`there are currently ${numPeople} people in the building`)

     const newStatusMessage = {
       name: 'some name',
       text: `there are currently ${numPeople} people in the building`,
       numPeopleInBuilding: numPeople
     }

     //  broadcast the number of people in the building to all clients
     this._io.emit('status-update', newStatusMessage)
   }

   private fluctuatingNumPeopleLoop () : void {
     //  increase or decrease the amount of people in the building to simulate people entering and leaving the building
     building.addPeople(getChangeByAmount())
   }
}
