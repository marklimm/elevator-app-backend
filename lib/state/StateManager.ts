import AsyncLock from 'async-lock'

import { Elevator } from './Elevator'
import { ElevatorRequests } from './ElevatorRequests'
import { Elevators } from './Elevators'
import { People } from './People'

import { Person } from './Person'
import { Building } from './Building'
import { Direction, ElevatorStatus, PersonStatus } from '../types/ElevatorAppTypes'

//  so maybe a rule for this StateManager class is that it deals with the locks for handling the array of elevators and the array of people, but NOT the individual elevators and individual people

/**
 * This class is the single source of truth for the state of the application.  It contains methods to read and modify state
 */
export class StateManager {
  private _elevators: Elevators
  private _people: People
  private _elevatorRequests: ElevatorRequests
  public building: Building

  private _lock: AsyncLock

  constructor (lock: AsyncLock) {
    this._elevators = new Elevators()
    this._people = new People()
    this._elevatorRequests = new ElevatorRequests()
    this.building = new Building()

    this._lock = lock
  }

  public get numPeople () : number {
    return this._people.numPeople
  }

  public async getElevators () : Promise<Elevator[]> {
    const elevators = await this._lock.acquire(Elevators.ELEVATORS_LOCK, async () => {
      return this._elevators.elevators
    })

    return elevators
  }

  public async resetAll () : Promise<void> {
    //  get the elevators lock
    await this._lock.acquire(Elevators.ELEVATORS_LOCK, async () => {
      this._elevators.reset()
    })

    //  get the people lock
    await this._lock.acquire(People.PEOPLE_LOCK, async () => {
      this._people.reset()
    })

    //  get the elevator requests lock
    await this._lock.acquire(ElevatorRequests.ELEVATOR_REQUESTS_LOCK, async () => {
      this._elevatorRequests.reset()
    })
  }

  public async addToPeople (newPersonName?: string) : Promise<Person> {
    //  get the people lock
    const newPerson = await this._lock.acquire(People.PEOPLE_LOCK, async () => {
      return this._people.addPerson(newPersonName, this.building.numFloors)
    })

    return newPerson
  }

  public async addElevatorRequest (personCallingElevator: Person) : Promise<void> {
    const direction = personCallingElevator.currFloor < personCallingElevator.destFloor ? Direction.UP : Direction.DOWN

    const elevatorRequest = { destFloor: personCallingElevator.currFloor, direction }

    await this._lock.acquire(ElevatorRequests.ELEVATOR_REQUESTS_LOCK, () => {
      this._elevatorRequests.addElevatorRequest(elevatorRequest)
    })
  }

  public async findElevatorToTakeRequest () : Promise<Elevator | void> {
    // console.log('-- START -- findElevatorToTakeRequest')

    //  the ELEVATOR_REQUEST_LOCK has already been taken before this function is called

    //  take the elevator requests lock
    const elevatorTakingRequest = await this._lock.acquire(ElevatorRequests.ELEVATOR_REQUESTS_LOCK, async () => {
      const elevatorRequest = await this._elevatorRequests.getElevatorRequest()

      if (!elevatorRequest) {
        return
      }

      // console.log('elevatorRequest to be processed', elevatorRequest)

      //  take the elevators lock
      const elevatorTakingRequest = await this._lock.acquire(Elevators.ELEVATORS_LOCK, async () => {
        return this._elevators.chooseElevator(elevatorRequest.destFloor)
      })

      if (!elevatorTakingRequest) {
        // console.log('no elevator is available to handle the request - will try again later')
        return
      }

      // console.log(`${chosenElevator.name} is currently on ${chosenElevator.currFloor} and will accept the request to go to ${elevatorRequest.destFloor}`)

      //  remove the elevator request from the queue since it's been processed
      this._elevatorRequests.removeElevatorRequest()

      //  take the lock for the specific elevator
      const updatedElevator = await this._lock.acquire(elevatorTakingRequest.lockName, async () => {
        elevatorTakingRequest.takeRequest(elevatorRequest)

        return elevatorTakingRequest
      })

      console.log('updatedElevator', updatedElevator)

      return updatedElevator
    })

    // console.log('-- END -- findElevatorToTakeRequest')

    return elevatorTakingRequest
  }

  /**
   * Determines if there's an elevator with its doors open that's going in the same direction as the given person
   * @param person
   * @returns
   */
  public async elevatorHasOpenDoorsAndPersonWantsToGoInTheSameDirection (person: Person) : Promise<Elevator | undefined> {
    const elevator = await this._lock.acquire(Elevators.ELEVATORS_LOCK, async () => {
      return this._elevators.elevators.find(elevator =>
        elevator.status === ElevatorStatus.DOORS_OPEN && elevator.currFloor === person.currFloor && elevator.direction === person.direction && person.status === PersonStatus.REQUESTED_ELEVATOR
      )
    })

    return elevator
  }

  public async removeFromPeople (personName: string) : Promise<void> {
    //  get the people lock
    await this._lock.acquire(People.PEOPLE_LOCK, async () => {
      return this._people.removePerson(personName)
    })
  }
}
