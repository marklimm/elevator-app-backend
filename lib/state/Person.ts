import { PersonStatus } from '../types/EventPayloads'

const PERSON_LOCK = 'person-lock'

export class Person {
  public currFloor: number
  public destFloor: number
  public name: string
  public status: PersonStatus

  constructor (name = 'Unnamed Person', currFloor = 1, destFloor = 2) {
    this.name = name
    this.currFloor = currFloor
    this.destFloor = destFloor

    this.status = PersonStatus.NEWLY_SPAWNED
  }

  /**
   * The name of a lock specifically for this person
   */
  public get lockName () : string {
    return `${PERSON_LOCK}-${this.name}`
  }
}
