import AsyncLock from 'async-lock'
import { BuildingDetails, ElevatorRequest } from './BuildingActions'

const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'
const NUM_PEOPLE_LOCK = 'num-people-lock'

const lock = new AsyncLock()

export class Building {
  private name: string
  private numFloors: number
  private yearBuilt: number

  private numPeople: number

  private elevatorRequestQueue: ElevatorRequest[]

  constructor (name: string) {
    this.name = name
    this.numFloors = 10
    this.yearBuilt = 2005

    this.numPeople = 500

    this.elevatorRequestQueue = []
  }

  getStaticStats () : BuildingDetails {
    return {
      name: this.name,
      numFloors: this.numFloors,
      yearBuilt: this.yearBuilt
    }
  }

  getNumPeople () : number {
    return this.numPeople
  }

  async addPeople (toAdd = 0) : Promise<void> {
    await lock.acquire(NUM_PEOPLE_LOCK, () => {
      this.numPeople += toAdd
    })
  }

  async removePeople (toRemove = 0) : Promise<void> {
    await lock.acquire(NUM_PEOPLE_LOCK, () => {
      this.numPeople -= toRemove
    })
  }

  async addElevatorRequest (elevatorRequest: ElevatorRequest) : Promise<void> {
    await lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
      this.elevatorRequestQueue.push(elevatorRequest)
    })
  }

  async removeElevatorRequest () : Promise<ElevatorRequest | undefined> {
    const elevatorRequest = await lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
      return this.elevatorRequestQueue.shift()
    })

    return elevatorRequest
  }
}

/**
 * The building state variable that the game loop reads from and the client action listeners write to
 */
export const building = new Building('1919 Fairview Park')
