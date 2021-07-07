import { Server as SocketIOServer } from 'socket.io'

// import { statusLoop } from './statusLoop'
import { elevatorLoop } from './elevatorLoop'
import { spawnNewPersonLoop } from './spawnNewPersonLoop'
import { GameLoopIntervals } from '../types/types'
import { stateManagerLoop } from './stateManagerLoop'
import { StateManager } from '../StateManager'
import AsyncLock from 'async-lock'

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

  private _lock: AsyncLock

  private _stateManager: StateManager

  constructor (io: SocketIOServer, stateManager: StateManager, lock: AsyncLock) {
    this._io = io
    this._active = false

    this._lock = lock

    this._stateManager = stateManager
  }

  private async startLoops () {
    //  this loop spawns new users, and whenever a new user is spawned a personLoop is created
    //  this seems like a code smell, it seems like there should be a more elegant way of setting this up, but I haven't found that solution yet
    this.intervalsObj['spawn-new-person-loop'] = setInterval(spawnNewPersonLoop.bind(this, this.intervalsObj, this._stateManager, this._lock), 3000)

    //  getting the elevators requires getting the Elevators lock, which is why this is a promise (that needs to be called with await)
    const elevators = await this._stateManager.getElevators()

    elevators.forEach(elevator => {
      this.intervalsObj[`${elevator.name}`] = setInterval(elevatorLoop.bind(this, elevator, this._lock), 1000)
    })

    this.intervalsObj['state-manager'] = setInterval(stateManagerLoop.bind(this, this._stateManager), 2500)
  }

  public start () : void {
    this._active = true

    this.startLoops()
  }

  public stop () : void {
    this._active = false

    //  clear all of the intervals/game loops
    Object.keys(this.intervalsObj).map(intervalKey => clearInterval(this.intervalsObj[intervalKey]))

    //  reset (elevators, people, elevator requests) all back to their initial state
    this._stateManager.resetAll()
  }

  get areRunning () : boolean {
    return this._active
  }
}
