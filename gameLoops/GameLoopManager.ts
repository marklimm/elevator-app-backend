import { Server as SocketIOServer } from 'socket.io'

import { statusLoop } from './statusLoop'
import { fluctuatingNumPeopleLoop } from './fluctuatingNumPeopleLoop'
import { spawnNewUserLoop } from './spawnNewUserLoop'

export class GameLoopManager {
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
     this.intervalsArr.push(setInterval(fluctuatingNumPeopleLoop.bind(this), 4000))

     //  "main" loop ... wondering if this will end up changing
     //  this.intervalsArr.push(setInterval(this.mainLoop.bind(this), 2500))

     //  elevator manager
     // this.intervalsArr.push(setInterval(getElevatorManagerLoop(this._io), 2500))

     this.intervalsArr.push(setInterval(spawnNewUserLoop.bind(this), 3000))

     this.intervalsArr.push(setInterval(statusLoop.bind(this), 3000))
   }

   public stop () : void {
     this._active = false

     //  clear all of the intervals/game loops
     this.intervalsArr.forEach(interval => clearInterval(interval))
   }

   get areRunning () : boolean {
     return this._active
   }
}
