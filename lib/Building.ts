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

  addPeople (toAdd = 0) : void {
    this.numPeople += toAdd
  }

  removePeople (toRemove = 0) : void {
    this.numPeople -= toRemove
  }
}

/**
 * The building state variable that the game loop reads from and the client action listeners write to
 */
export const building = new Building('1919 Fairview Park')
