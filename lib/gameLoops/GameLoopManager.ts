import { Server as SocketIOServer } from 'socket.io'
import AsyncLock from 'async-lock'

import { elevatorLoop } from './elevatorLoop'
import { personLoop } from './personLoop'

import { GameLoopIntervals } from '../types/ServerSideTypes'
import { elevatorManagerLoop } from './elevatorManagerLoop'
import { StateManager } from '../state/StateManager'

import { Person } from '../state/Person'

import { Broadcasters } from '../broadcasters/Broadcasters'

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
  private _intervalsObj: GameLoopIntervals = {}

  private _lock: AsyncLock

  private _stateManager: StateManager
  private _broadcasters: Broadcasters

  constructor (io: SocketIOServer, stateManager: StateManager, broadcasters: Broadcasters, lock: AsyncLock) {
    this._io = io
    this._active = false

    this._lock = lock

    this._stateManager = stateManager
    this._broadcasters = broadcasters
  }

  private async startLoops () {
    //  getting the elevators requires getting the Elevators lock, which is why this is a promise (that needs to be called with await)
    const elevators = await this._stateManager.getElevators()

    elevators.forEach(elevator => {
      this._intervalsObj[`${elevator.name}`] = setInterval(elevatorLoop.bind(this, elevator, this._broadcasters.elevatorBroadcaster, this._lock), 2000)

      this._broadcasters.elevatorBroadcaster.broadcastElevatorReady(elevator)
    })

    this._intervalsObj['elevator-manager-loop'] = setInterval(elevatorManagerLoop.bind(this, this._stateManager), 2500)

    //  7/31 - I'm moving away from spawning new users on a loop from the server-side because this doesn't translate once the app is deployed up to vercel ... now new people will only be spawned by the client
    //  this loop spawns new users, and whenever a new user is spawned a personLoop is created
    // this._intervalsObj['spawn-new-person-loop'] = setInterval(async () => {
    //   await this._personLoopCreator.spawnNewPersonLoop()
    // }, 5000)
  }

  public start () : void {
    this._active = true

    this.startLoops()
  }

  public stop () : void {
    this._active = false

    //  clear all of the intervals/game loops
    Object.keys(this._intervalsObj).map(intervalKey => clearInterval(this._intervalsObj[intervalKey]))

    //  reset (elevators, people, elevator requests) all back to their initial state
    this._stateManager.resetAll()
  }

  get areRunning () : boolean {
    return this._active
  }

  /**
   * Removes the app's awareness of the person since they have reached their destination floor.  The opposite of `spawnNewPerson()`
   * @param personName
   */
  private async removePerson (person: Person) : Promise<void> {
    await this._stateManager.removeFromPeople(person.name)

    clearInterval(this._intervalsObj[`${person.name}`])

    person.removeFromApp()
  }

  /**
   * Spawns a new person
   */
  public async spawnNewPerson (newPersonName = 'New Person') : Promise<Person> {
    const newPerson = await this._stateManager.addToPeople(newPersonName)

    //  broadcast that a new person has appeared
    this._broadcasters.personBroadcaster.broadcastNewPersonSpawned(newPerson)

    //  setup the personLoop for the new person
    this._intervalsObj[`${newPerson.name}`] = setInterval(personLoop.bind(this, {
      person: newPerson,
      stateManager: this._stateManager,
      personBroadcaster: this._broadcasters.personBroadcaster,
      lock: this._lock,
      removePerson: this.removePerson.bind(this)
    }), 2000)

    return newPerson
  }
}
