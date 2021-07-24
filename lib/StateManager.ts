import AsyncLock from 'async-lock'

import { Direction } from './types/types'
import { Elevator } from './state/Elevator'
import { ElevatorRequests } from './state/ElevatorRequests'
import { Elevators } from './state/Elevators'
import { People } from './state/People'
import { PersonStatus } from './types/EventPayloads'

import { Person } from './state/Person'
import { Building } from './state/Building'

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

  public async addToPeople () : Promise<Person | undefined> {
    //  get the people lock
    const newPerson = await this._lock.acquire(People.PEOPLE_LOCK, async () => {
      return this._people.addPerson(this.building.numFloors)
    })

    return newPerson
  }

  public async addElevatorRequest (personCallingElevator: Person) : Promise<void> {
    const direction = personCallingElevator.currFloor < personCallingElevator.destFloor ? Direction.GOING_UP : Direction.GOING_DOWN

    const elevatorRequest = { destFloor: personCallingElevator.currFloor, direction }

    await this._lock.acquire(ElevatorRequests.ELEVATOR_REQUESTS_LOCK, () => {
      this._elevatorRequests.addElevatorRequest(elevatorRequest)
    })

    await this._lock.acquire(personCallingElevator.lockName, () => {
      //  specify that the user is now waiting for the elevator
      personCallingElevator.status = PersonStatus.WAITING_FOR_ELEVATOR
    })
  }

  public async findElevatorToTakeRequest () : Promise<Elevator | void> {
    // console.log('-- START -- findElevatorToTakeRequest')

    //  the ELEVATOR_REQUEST_LOCK has already been taken before this function is called

    //  take the elevator requests lock
    const elevatorTakingRequest = await this._lock.acquire(ElevatorRequests.ELEVATOR_REQUESTS_LOCK, async () => {
      const elevatorRequest = await this._elevatorRequests.getElevatorRequest()

      if (!elevatorRequest) { return }

      console.log('elevatorRequest to be processed', elevatorRequest)

      //  take the elevators lock
      const elevatorTakingRequest = await this._lock.acquire(Elevators.ELEVATORS_LOCK, async () => {
        return this._elevators.chooseElevator(elevatorRequest.destFloor)
      })

      if (!elevatorTakingRequest) {
        console.log('no elevator is available to handle the request - will try again later')
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
}
