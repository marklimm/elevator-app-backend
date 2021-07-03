import { Server as SocketIOServer } from 'socket.io'

// import { statusLoop } from './statusLoop'
import { fluctuatingNumPeopleLoop } from './fluctuatingNumPeopleLoop'
import { elevatorLoop } from './elevatorLoop'
import { spawnNewUserLoop } from './spawnNewUserLoop'
import { GameLoopIntervals } from '../lib/BuildingActions'
import { getElevatorsAsArray } from '../state/Elevators'
import { elevatorManagerLoop } from './elevatorManagerLoop'

export class GameLoopManager {
  private _io: SocketIOServer

  /**
   * This flag is true when the game loops are currently running
   */
  private _active: boolean

  /**
 * Contains the ids for all of the currently running game loops
 */
  //  private intervalsArr: NodeJS.Timeout[] = []
  private intervalsObj: GameLoopIntervals = {}

  constructor (io: SocketIOServer) {
    this._io = io
    this._active = false
  }

  public start () : void {
    this._active = true

    //  fluctating number of people in the building
    //  this.intervalsArr.push()

    this.intervalsObj['fluctuating-people'] = setInterval(fluctuatingNumPeopleLoop.bind(this), 3000)

    //  "main" loop ... wondering if this will end up changing
    //  this.intervalsArr.push(setInterval(this.mainLoop.bind(this), 2500))

    //  elevator manager
    // this.intervalsArr.push(setInterval(getElevatorManagerLoop(this._io), 2500))

    //  this.intervalsArr.push()
    this.intervalsObj['spawn-new-user-loop'] = setInterval(spawnNewUserLoop.bind(this, this.intervalsObj), 3000)

    //  this.intervalsArr.push(setInterval(personLoop.bind(this), 5000))

    getElevatorsAsArray().forEach(elevator => {
      //  this.intervalsArr.push(setInterval(elevatorLoop.bind(this, elevator), 1000))
      this.intervalsObj[`${elevator.name}`] = setInterval(elevatorLoop.bind(this, elevator), 1000)
    })

    //  this.intervalsArr.push(setInterval(elevatorManagerLoop.bind(this), 4000))
    this.intervalsObj['elevator-manager'] = setInterval(elevatorManagerLoop.bind(this), 4000)
  }

  public stop () : void {
    this._active = false

    //  clear all of the intervals/game loops
    Object.keys(this.intervalsObj).map(intervalKey => clearInterval(this.intervalsObj[intervalKey]))
    // this.intervalsArr.forEach(interval => clearInterval(interval))
  }

  get areRunning () : boolean {
    return this._active
  }
}
