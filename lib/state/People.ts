import { Person } from './Person'
import { getRandomFloor, getRandomName } from '../Randomizer'

export class People {
  private _people: Person[]

  //  this class is kind of sparse.  It might not even be necessary.  It would be more necessary if I added logic that dealt with doing operations over the list of people, like what Elevators.ts does for elevators

  public static PEOPLE_LOCK = 'people-lock'

  constructor () {
    this._people = []
  }

  /**
   * Returns the number of people who are currently interacting with elevators
   * @returns
   */
  public get numPeople () : number {
    // const numPeople = await this._lock.acquire(PEOPLE_LOCK, () => {
    return this._people.length
    // })

    // return numPeople
  }

  /**
   * Returns the number of people who are currently interacting with elevators
   * @returns
   */
  public get usedNames () : string[] {
    // const usedNames = await this._lock.acquire(PEOPLE_LOCK, () => {
    return this._people.map(person => person.name)
    // })

    // return usedNames
  }

  /**
   * Reset to the default initial setup of 0 people within the building
   */
  public reset () : void {
    this._people = []
  }

  public addPerson (numFloors = 10) : Person | undefined {
    //  don't add more people if there's already one user

    if (this.numPeople > 1) { return }

    const name = getRandomName(this.usedNames)
    const currFloor = getRandomFloor(numFloors)
    const destFloor = getRandomFloor(numFloors, currFloor)

    const newPerson = new Person(name, currFloor, destFloor)

    console.log(`${newPerson.name} was just spawned`)

    this._people.push(newPerson)

    return newPerson
  }
}
