import { Server as SocketIOServer } from 'socket.io'
import AsyncLock from 'async-lock'

import { elevatorLoop } from './elevatorLoop'
import { GameLoopIntervals } from '../types/types'
import { elevatorManagerLoop } from './elevatorManagerLoop'
import { StateManager } from '../state/StateManager'

import { Person } from '../state/Person'

import { Broadcasters } from '../broadcasters/Broadcasters'
import { PersonLoopCreator } from './PersonLoopCreator'

/**
 * This class owns the asynchronous loops for the application (elevator loop, elevator manager loop and new person spawn loop)
 */
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
  private _broadcasters: Broadcasters

  private _personLoopCreator: PersonLoopCreator

  constructor (io: SocketIOServer, stateManager: StateManager, broadcasters: Broadcasters, lock: AsyncLock) {
    this._io = io
    this._active = false

    this._lock = lock

    this._stateManager = stateManager
    this._broadcasters = broadcasters

    this._personLoopCreator = new PersonLoopCreator(this._stateManager, this.intervalsObj, this._broadcasters.personBroadcaster, this._lock)
  }

  private async startLoops () {
    //  getting the elevators requires getting the Elevators lock, which is why this is a promise (that needs to be called with await)
    const elevators = await this._stateManager.getElevators()

    elevators.forEach(elevator => {
      this.intervalsObj[`${elevator.name}`] = setInterval(elevatorLoop.bind(this, elevator, this._broadcasters.elevatorBroadcaster, this._lock), 1000)

      this._broadcasters.elevatorBroadcaster.broadcastElevatorReady(elevator)
    })

    this.intervalsObj['elevator-manager-loop'] = setInterval(elevatorManagerLoop.bind(this, this._stateManager), 2500)

    //  this loop spawns new users, and whenever a new user is spawned a personLoop is created

    this.intervalsObj['spawn-new-person-loop'] = setInterval(async () => {
      await this._personLoopCreator.spawnNewPersonLoop()
    }, 10000)
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

  /**
   * Spawn a new person by running spawnNewPersonLoop() once
   */
  public async spawnNewPerson (newPersonName = 'New Person') : Promise<Person | null> {
    console.log('calling spawnNewPersonLoop()')

    //  call spawnNewPersonLoop() to create a new person
    const newPerson = await this._personLoopCreator.spawnNewPersonLoop(newPersonName)

    return newPerson
  }
}
