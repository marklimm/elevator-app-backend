import AsyncLock from 'async-lock'

const NUM_PEOPLE_LOCK = 'num-people-lock'

const lock = new AsyncLock()

export class Building {
  private name: string

  private numPeople: number

  constructor (name: string) {
    this.name = name

    this.numPeople = 500
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
export const building = new Building('This name of building')
