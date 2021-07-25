import AsyncLock from 'async-lock'
import { PersonBroadcaster } from '../broadcasters/PersonBroadcaster'
import { StateManager } from '../state/StateManager'
import { GameLoopIntervals } from '../types/types'
import { PersonStatus } from '../types/EventPayloads'
import { Person } from '../state/Person'

export class PersonLoopCreator {
  private _stateManager: StateManager
  private _intervalsObj: GameLoopIntervals
  private _personBroadcaster: PersonBroadcaster
  private _lock: AsyncLock

  constructor (stateManager: StateManager, intervalsObj: GameLoopIntervals, personBroadcaster: PersonBroadcaster, lock: AsyncLock) {
    this._stateManager = stateManager
    this._intervalsObj = intervalsObj
    this._personBroadcaster = personBroadcaster
    this._lock = lock
  }

  /**
   * This personLoop represents the actions of an individual person.  It (1) both makes and listens for changes in the Person status and (2) broadcasts updates to the client using `personBroadcaster`
   * @param person
   */
  public async personLoop (person: Person) : Promise<void> {
    await this._lock.acquire(person.lockName, async () => {
      //  this personLoop now has the specific lock for this person

      if (person.status === PersonStatus.NEWLY_SPAWNED) {
        //  broadcast that a new person has appeared
        this._personBroadcaster.broadcastNewPersonSpawned(person)

        await this._stateManager.addElevatorRequest(person)

        this._personBroadcaster.broadcastPersonRequestedElevator(person)

        person.status = PersonStatus.REQUESTED_ELEVATOR
      }

      // if (person.status === PersonStatus.REQUESTED_ELEVATOR) {

      //   person.status = PersonStatus.WAITING_FOR_ELEVATOR

      //   return
      // }

      // if (person.status === PersonStatus.WAITING_FOR_ELEVATOR) {

      //   return
      // }

      //  if elevator opens doors AND

      // elevators.getElevatorPickingUpPerson(person.)
      // const elevatorPickingUpPerson = await getElevatorPickingUpPerson(person)

      // if (elevatorPickingUpPerson) {
      //   await elevatorGetsRiderAndDestination(elevatorPickingUpPerson, person)

      //   elevatorBroadcaster.broadcastElevatorReceivesDestination(elevatorPickingUpPerson)
      // }
    })
  }

  /**
   * This function is used to create a new person
   * @param newPersonName
   * @returns
   */
  public async spawnNewPersonLoop (newPersonName?: string) : Promise<Person | null> {
  //  limit the amount of people who get created
    if (this._stateManager.numPeople > 3) { return null }

    const newPerson = await this._stateManager.addToPeople(newPersonName)

    this._intervalsObj[`${newPerson.name}`] = setInterval(this.personLoop.bind(this, newPerson), 5000)

    return newPerson
  }
}
