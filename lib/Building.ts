import AsyncLock from 'async-lock'
import { BuildingDetails } from './payloads/Building'

const NUM_PEOPLE_LOCK = 'num-people-lock'

const lock = new AsyncLock()

export class Building {
  private name: string
  private numFloors: number
  private yearBuilt: number

  private numPeople: number

  constructor (name: string) {
    this.name = name
    this.numFloors = 10
    this.yearBuilt = 2005

    this.numPeople = 500
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
}

/**
 * The building state variable that the game loop reads from and the client action listeners write to
 */
export const building = new Building('1919 Fairview Park')
