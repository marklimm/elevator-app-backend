import { Direction, PersonStatus } from '../types/ElevatorAppTypes'
import { Elevator } from './Elevator'

const PERSON_LOCK = 'person-lock'

export class Person {
  public currFloor: number
  public destFloor: number
  public name: string
  public status: PersonStatus

  public elevator: Elevator | null

  constructor (name = 'Unnamed Person', currFloor = 1, destFloor = 2) {
    this.name = name
    this.currFloor = currFloor
    this.destFloor = destFloor

    this.status = PersonStatus.NEWLY_SPAWNED

    this.elevator = null
  }

  /**
   * The name of a lock specifically for this person
   */
  public get lockName () : string {
    return `${PERSON_LOCK}-${this.name}`
  }

  public get direction () : Direction {
    return this.currFloor > this.destFloor ? Direction.DOWN : Direction.UP
  }
}
